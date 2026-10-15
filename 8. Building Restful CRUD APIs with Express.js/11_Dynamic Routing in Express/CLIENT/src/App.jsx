import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const URL = "http://192.168.0.210:4000/";
  const [directoryItems, setDirectoryItems] = useState([]);
  const [progress, setProgress] = useState(0);
  const [newFileName, setNewFileName] = useState("");
  async function getDirectoryItems() {
    const response = await fetch(URL);
    const data = await response.json();
    setDirectoryItems(data);
  }

  useEffect(() => {
    getDirectoryItems();
  }, []);

  function handleChange(e) {
    const file = e.target.files[0];
    const xhr = new XMLHttpRequest();
    xhr.open("POST", URL, true);
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
    const response = await fetch(`${URL}${fileName}`, {
      method: "DELETE",
    });
    const data = await response.text();
    getDirectoryItems();
  }

  async function renameFile(oldFileName) {
    setNewFileName(oldFileName);
  }
  async function saveFileName(oldFileName) {
    setNewFileName(oldFileName);
    const response = await fetch(`${URL}${oldFileName}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newFileName }),
    });
    getDirectoryItems();
  }

  return (
    <>
      <h1>My Files</h1>
      <div>
        <p>Progress: {progress}</p>
      </div>
      <input type="file" onChange={handleChange} />
      <input
        type="text"
        onChange={(e) => setNewFileName(e.target.value)}
        value={newFileName}
      />
      {directoryItems.map((item, i) => (
        <div key={i}>
          {item} <a href={`${URL}${item}?action=open`}>Open</a>
          <a href={`${URL}${item}?action=download`}>Download</a>{" "}
          <button onClick={() => renameFile(item)}>Rename</button>
          <button onClick={() => handleDelete(item)}>Delete</button>
          <button onClick={() => saveFileName(item)}>Save</button>
          <br />
        </div>
      ))}
    </>
  );
}

export default App;
