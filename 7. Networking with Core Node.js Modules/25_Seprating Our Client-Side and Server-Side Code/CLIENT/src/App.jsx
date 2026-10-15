import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [directoryItems, setDirectoryItems] = useState([]);
  async function getDirectoryItems() {
    const response = await fetch("http://192.168.0.210/");
    const data = await response.json();
    setDirectoryItems(data);
  }

  useEffect(() => {
    getDirectoryItems();
  }, []);
  return (
    <>
      <h1>My Files</h1>
      {directoryItems.map((item, i) => (
        <div key={i}>
          {item} <a href={`http://192.168.0.210/${item}?action=open`}>Open</a>
          <a href={`http://192.168.0.210/${item}?action=download`}>
            Download
          </a>{" "}
          <br />
        </div>
      ))}
    </>
  );
}

export default App;
