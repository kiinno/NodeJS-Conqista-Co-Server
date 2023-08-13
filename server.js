const path = require("path");
const http = require("http");

const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const ApiError = require("./utils/apiError");

// Load configurations
dotenv.config({
  path: "config.env",
  encoding: "utf8",
  override: true,
});

const app = express();

app.use(cors());
app.options("*", cors());

app.use(
  express.json({
    limit: "5kb",
  })
);

app.use(express.urlencoded({ extended: true, limit: "5kb" }));
app.use(morgan("common"), helmet());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const server = http.createServer(app);

const { HOST = "localhost", PORT = 8000, DB_URI } = process.env;

// Mount routes

const authRotue = require("./routes/authRoute");
const usersRoute = require("./routes/userRoute");
const storeRoute = require("./routes/storeRoute");
const downloadRoute = require("./routes/downloadRoute");
const orderRoute = require("./routes/orderRoute");

app.use("/api/users", usersRoute);
app.use("/api/store", storeRoute);
app.use("/api/auth", authRotue);
app.use("/api/downloads", downloadRoute);
app.use("/api/order", orderRoute);

// server configration api for admins
app.get("/config", (req, res) => {
  res.status(200).json({ ...process.env });
});

// Error handlgin
app.use("*", (req, res, next) => {
  next(
    new ApiError(
      404,
      `Route ${req.originalUrl} Not Found`,
      "404 Page Not Found",
      {
        originalUrl: req.originalUrl,
        method: req.method,
      }
    )
  );
});

app.use((err, req, res, next) => {
  let error = err;

  if (!(err instanceof ApiError))
    error = new ApiError(500, err.message, err.name);

  res.status(error.statusCode).json({
    ...error,
    message: error.message,
    stack: error.stack,
  });
});

mongoose.connect(DB_URI).then((connection) => {
  const {
    connection: { host: db_host, port: db_port, name: db_name },
  } = connection;

  console.log(
    `Database Connection\nHOST=${db_host}\nPORT=${db_port}\nDatabase=${db_name}`
  );

  server.listen(PORT, HOST, () => {
    console.log(`Server is running on ${HOST} port ${PORT}`);
  });
});
