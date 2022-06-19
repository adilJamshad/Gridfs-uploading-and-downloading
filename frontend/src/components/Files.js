import React, { useEffect, useState } from "react";
import { Box } from "@mui/system";

const Files = () => {
  const [files, setFiles] = useState([]);

  const getFiles = () =>
    fetch("http://localhost:8000/files", { method: "GET" }).then((data) =>
      data.json()
    );
  const downloadFile = (filename) => {
    fetch(`http://localhost:8000/readFiles/${filename}`, {
      method: "GET",
    })
      .then((data) => {
        return data.blob();
      })
      .then((blob) => {
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();
        a.remove(); //afterwards we remove the element again
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getFiles().then((items) => setFiles(items));
  }, []);

  return (
    <div>
      {files.length > 0 ? (
        <Box display="flex" flexDirection="column">
          {files.map((item) => (
            <Box
              key={item.filename}
              border="1px solid black"
              sx={{ cursor: "pointer" }}
              p={3}
              onClick={() => downloadFile(item.filename)}
            >
              {item.filename}
            </Box>
          ))}
        </Box>
      ) : (
        "waiting for files to be loaded"
      )}
    </div>
  );
};

export default Files;
