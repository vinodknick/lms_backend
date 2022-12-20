const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

//Handling Uncaught Exception -- umdefined --like -- console.log(twitter)
process.on("uncaughtException", (err) => {
  console.log(`Error:${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

//config
dotenv.config({ path: "config/config.env" });

//connect to database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(`server is woking on http://localhost:${process.env.PORT}`);
});

//Unhandled Promise Rejection  -- mongodb incorrect spelling
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});

