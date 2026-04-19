const fs = require("fs");

const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Tour = require("../../models/tourModel");

dotenv.config({ path: "../../config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB)
  .then((con) => console.log("DB connection successful!"))
  .catch((err) => console.log("DB connection failed", err));

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/tours-simple.json`, "utf-8"),
);

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("Data imported successfully!!!");
  } catch (err) {
    console.log(err);
  } finally {
    process.exit();
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("Data deleted successfully!!!");
  } catch (err) {
    console.log(err);
  } finally {
    process.exit();
  }
};

if (process.argv[2] == "--import") {
  importData();
} else if (process.argv[2] == "--delete") {
  deleteData();
}
