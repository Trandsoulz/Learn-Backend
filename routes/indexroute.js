import express from "express";
import multer from "multer";
import upload from "../helpers/imgupload.js";

const indexRoute = express.Router();

indexRoute.get("/", (req, res, next) => {
  const headers = req.headers;

  const query = req.query["techcrush"];

  console.log(query);

  res.status(200).send({
    status: "success",
    message: "Index route is functional",
  });
});

indexRoute.post("/", upload.array("image", 5), (req, res, next) => {
  const images = req.files.map((items) => {
    return items.filename;
  });

  res
    .status(200)
    .send(`Files have been uploaded to the server [${images}]`);
});

export default indexRoute;
