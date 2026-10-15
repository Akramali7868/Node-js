import { useEffect, useState } from "react";
import "./App.css";
import { useParams } from "react-router-dom";

function DirectoryView() {
  const BASE_URL = "http://192.168.0.210:4000";
  const [directoryItems, setDirectoryItems] = useState([]);
  const [progress, setProgress] = useState(0);
  const [newFileName, setNewFileName] = useState("");
  const { "*": dirPath } = useParams();

  async function getDirectoryItems() {
    const response = await fetch(`${BASE_URL}/directory/${dirPath}`);
    const data = await response.json();
    setDirectoryItems(data);
  }

  useEffect(() => {
    getDirectoryItems();
  }, []);

  function handleChange(e) {
    const file = e.target.files[0];
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${BASE_URL}/files/${file.name}`, true);
    xhr.addEventListener("load", (e) => {
      getDirectoryItems();
    });
    xhr.upload.addEventListener("progress", (e) => {
      const totalProgress = `${Math.round((e.loaded / e.total) * 100)}% Uploaded`;
      setProgress(totalProgress);
    });
    xhr.send(file);
  }
  async function handleDelete(fileName) {
    const response = await fetch(`${BASE_URL}/files/${fileName}`, {
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
    const response = await fetch(`${BASE_URL}/files/${oldFileName}`, {
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
      {directoryItems.map(({ name, isDirectory }, i) => (
        <div key={i}>
          {name} {isDirectory && <a href={`./${name}`}>Open</a>} <br />
          {name} <a href={`${BASE_URL}/files/${name}?action=open`}>Open</a>
          {!isDirectory && (
            <a href={`${BASE_URL}/files/${name}?action=download`}>Download</a>
          )}
          <button onClick={() => renameFile(name)}>Rename</button>
          <button onClick={() => handleDelete(name)}>Delete</button>
          <button onClick={() => saveFileName(name)}>Save</button>
          <br />
        </div>
      ))}
    </>
  );
}

export default DirectoryView;
