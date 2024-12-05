import express from "express";
import indexRoute from "./routes/indexroute.js";

const app = express();
const PORT = 8000;

app.get("/", (_, res, next) => {
  res.status(200).send({
    status: "success",
    message: "Server is active",
  });
});

app.use("/users", indexRoute);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
