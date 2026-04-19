const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB)
  .then((con) => console.log("DB connection successful!"))
  .catch((err) => console.log("DB connection failed", err));



const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
