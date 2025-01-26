import express from "express";

const app = express();
app.use(express.json());

const port = 3003;

app.get("/", (req, res) => {
  res.send({ message: "Server started successfully." });
});

app.listen(port, () => {
  console.log(`server started on port: ${port}`);
});
