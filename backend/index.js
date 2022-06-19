const express = require("express");
const crypto = require("crypto");
const mongoose = require("mongoose");
const multer = require("multer");
const Grid = require("gridfs-stream");
const cors = require("cors");
// const Grid = require("method-override");
const bodyParser = require("body-parser");
require("dotenv").config();

const { upload } = require("./utils/storage");

const app = express();

const PORT = process.env.PORT || 8000;
let gfs;

// middlewares
app.use(cors());
app.use(bodyParser.json());

// mongodb configuration

const mongodbURI = process.env.MONGODBURI;

const dbConnection = mongoose.createConnection(mongodbURI);

dbConnection.once("open", () => {
  gfs = Grid(dbConnection.db, mongoose.mongo);
  gfs.collection("uploads");
});

app.get("/", (req, res) => {
  res.send("Welcome to app");
});

app.post("/uploads", upload.single("file"), (req, res) => {
  return res.json({ file: req.file });
});

app.get("/files", async (req, res) => {
  await gfs.files.find().toArray((err, files) => {
    if (err) return res.status(400).json({ err });

    if (!files && files.length === 0)
      return res.status(404).json({ message: "file not found" });

    return res.status(200).send(files);
  });
});

app.get("/readFiles/:name", (req, res) => {
  gfs.files.findOne({ filename: req.params.name }, (err, file) => {
    if (err) return res.status(400).json({ err });

    if (!file) return res.status(404).json({ message: "file not found" });
    res.set("Content-Type", file.contentType);
    res.set(
      "Content-Disposition",
      'attachment; filename="' + file.filename + '"'
    );

    let gridfsBucket = new mongoose.mongo.GridFSBucket(dbConnection.db, {
      chunkSizeBytes: file.chunkSize,
      bucketName: "uploads",
    });

    gridfsBucket
      .openDownloadStreamByName(file.filename)
      .pipe(res)
      .on("error", function (error) {
        console.log("error" + error);
        return res.status(404).json({
          msg: error.message,
        });
      })
      .on("finish", function () {
        console.log("done!!");
      });
  });
});

app.listen(PORT, () => {
  console.log(`app is listening at: ${PORT}`);
});
