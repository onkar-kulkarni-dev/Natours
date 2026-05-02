const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then((con) => console.log("DB connection successful!"));

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});

//global async promise rejection handler
process.on("unhandledRejection", (err) => {
  console.log(err, "unhandled rejection");
  //first shutting down server without receiving any new request, all prev requests get processed
  server.close(() => {
    //exiting the process with exit code 1 which means something is broken and 0 means success
    process.exit(1); //here we pass either 0 or 1
  });
});
