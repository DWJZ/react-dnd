import { useEffect, useRef, useState } from "react";
import "./DnD.css";

const swap = (list, i, j) => {
  const t = list[i];
  list[i] = list[j];
  list[j] = t;
  return list;
};

const pxStr2Num = (str) => Number(str.replace("px", ""));

const getTranslateY = (transformStr) => {
  const res = transformStr.match(/translate.*,(.*)px/);
  if (!res) return 0;
  return Number(res[1]);
};

const getElHeight = (el) => {
  const style = getComputedStyle(el);
  const { height } = el.getBoundingClientRect();
  console.log(style['margin-bottom'])

  return height + pxStr2Num(style['margin-bottom']) + pxStr2Num(style['margin-top']);
};

const DnD = ({ list: _list, onChange = () => {} }) => {
  const rootEl = useRef(null);
  const draggingItem = useRef(null);
  const [list, setList] = useState(_list);

  useEffect(() => {
    setList(_list);
  }, [_list]);

  return (
    <div className="dnd_wrap" ref={rootEl}>
      {list.map((item) => (
        <div
          className={item.wrapClass}
          onMouseDown={(e) => {
            const draggingEl = e.currentTarget;
            const draggingElHeight = getElHeight(draggingEl);
            console.log({ draggingElHeight });
            const children = Array.from(rootEl.current.children).map(
              (el, index) => ({
                el,
                data: list[index],
              })
            );

            const startY = e.clientY;
            let draggingIndex = list.indexOf(item);
            let lastY = startY;

            draggingItem.current = { data: item, el: draggingEl };
            draggingEl.classList.add("dragging");

            const onMouseMove = (e) => {
              const mouseY = e.clientY;
              const movingY = mouseY - startY;
              const relativeY = mouseY - lastY;

              draggingEl.style.top = `${movingY}px`;
              if (relativeY === 0) return;
              if (relativeY > 0) {
                const nextEl = children[draggingIndex + 1]?.el;
                if (!nextEl) return;
                const { top } = nextEl.getBoundingClientRect();
                const height = getElHeight(nextEl);
                if (mouseY > height / 2 + top) {
                  const transY = getTranslateY(nextEl.style.transform);
                  nextEl.style = `transition: .3s transform; transform: translate(0, ${
                    transY - draggingElHeight
                  }px);`;
                  swap(children, draggingIndex, draggingIndex + 1);
                  draggingIndex++;
                  lastY = mouseY;
                }
              } else {
                const nextEl = children[draggingIndex - 1]?.el;
                if (!nextEl) return;
                const { top } = nextEl.getBoundingClientRect();
                const height = getElHeight(nextEl);
                if (mouseY < height / 2 + top) {
                  const transY = getTranslateY(nextEl.style.transform);
                  nextEl.style = `transition: .3s transform; transform: translate(0, ${
                    transY + draggingElHeight
                  }px);`;
                  swap(children, draggingIndex, draggingIndex - 1);
                  draggingIndex--;
                  lastY = mouseY;
                }
              }
            };

            const onMouseUp = (e) => {
              onChange(children.map((_) => _.data));
              draggingEl.classList.remove("dragging");
              draggingEl.style.top = "";
              children.forEach((_) => (_.el.style = ""));
              document.removeEventListener("mousemove", onMouseMove, true);
              document.removeEventListener("mouseup", onMouseUp, true);
            };

            document.addEventListener("mousemove", onMouseMove, true);
            document.addEventListener("mouseup", onMouseUp, true);
          }}
          key={item.id}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
};

export default DnD;
