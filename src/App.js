import { useState } from "react";
import Dnd from "./components/DnD";
import "./App.css";

function App() {
  const [list, setList] = useState(
    Array.from({ length: 10 }).map((_, i) => ({
      wrapClass: "wrap",
      content: (
        <div style={{ height: i * 3 + 10 }} key={i}>
          {i}
        </div>
      ),
      id: i,
    }))
  );

  return <Dnd list={list} onChange={setList} />;
}

export default App;
