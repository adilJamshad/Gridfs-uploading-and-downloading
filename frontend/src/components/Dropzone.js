import { Box } from "@mui/material";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const DropZone = () => {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    const newFile = acceptedFiles[files.length];
    if (
      newFile.type === "image/jpeg" ||
      newFile.type === "image/png" ||
      newFile.type === "application/pdf"
    ) {
      console.log("here: ", newFile);
      let data = new FormData();
      data.append("file", newFile);
      fetch("http://localhost:8000/uploads", {
        method: "POST",
        // headers: { "Content-Type": "multipart/form-data" },
        body: data,
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));
    } else {
      alert("These sort of files are not allowed");
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Box border="3px dotted grey">
      <div {...getRootProps()} style={{ padding: "20px" }}>
        <input
          {...getInputProps()}
          accept="image/jpeg, image/png, application/pdf"
        />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
    </Box>
  );
};

export default DropZone;
