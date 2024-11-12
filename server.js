import express from "express";
import userRoutes from "./routes/api.route.js";

const app = express();
app.use(express.json());

app.get("/api", (req, res) => {
  res.send("Exercice Backend");
});

app.use("/api", userRoutes);

app.listen(3000, () => {
  console.log("Server started : http://localhost::3000/api");
});
