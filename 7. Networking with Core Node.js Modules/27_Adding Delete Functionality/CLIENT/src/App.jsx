import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [directoryItems, setDirectoryItems] = useState([]);
  const [progress, setProgress] = useState(0);
  async function getDirectoryItems() {
    const response = await fetch("http://192.168.0.210/");
    const data = await response.json();
    setDirectoryItems(data);
  }

  useEffect(() => {
    getDirectoryItems();
  }, []);

  function handleChange(e) {
    const file = e.target.files[0];
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://192.168.0.210/", true);
    xhr.setRequestHeader("filename", file.name);
    xhr.addEventListener("load", (e) => {
      console.log(xhr.response);
      getDirectoryItems();
    });
    xhr.upload.addEventListener("progress", (e) => {
      const totalProgress = `${Math.round((e.loaded / e.total) * 100)}% Uploaded`;
      setProgress(totalProgress);
    });
    xhr.send(file);
  }
  async function handleDelete(fileName) {
    const response = await fetch("http://192.168.0.210/delete", {
      method: "DELETE",
      body: fileName,
    });
    const data = await response.text();
    getDirectoryItems();
  }
  return (
    <>
      <h1>My Files</h1>
      <div>
        <p>Progress: {progress}</p>
      </div>
      <input type="file" onChange={handleChange} />
      {directoryItems.map((item, i) => (
        <div key={i}>
          {item} <a href={`http://192.168.0.210/${item}?action=open`}>Open</a>
          <a href={`http://192.168.0.210/${item}?action=download`}>
            Download
          </a>{" "}
          <button>Rename</button>
          <button onClick={() => handleDelete(item)}>Delete</button>
          <br />
        </div>
      ))}
    </>
  );
}

export default App;
