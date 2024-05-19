//config env
require("dotenv").config();
const express = require("express");
const app = express();
const router = require("./router/index");
const cors = require("cors");
const logger = require('./utils/logger');
const expressWinston = require('express-winston');
// Middleware logging cho các request
app.use(expressWinston.logger({
  winstonInstance: logger,
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true,
  colorize: false,
  ignoreRoute: function (req, res) { return false; }
}));

// Middleware để đo thời gian phản hồi và ghi log
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, originalUrl } = req;
    const { statusCode } = res;

    if (statusCode >= 400) {
      logger.error(`HTTP ${method} ${originalUrl} responded with status ${statusCode} in ${duration}ms`);
    }

    if (duration > 30000) { // 30s là ngưỡng thời gian phản hồi quá lâu
      logger.warn(`HTTP ${method} ${originalUrl} took ${duration}ms to respond`);
    }
  });
  next();
});

// Middleware logging cho các lỗi
app.use(expressWinston.errorLogger({
  winstonInstance: logger
}));

// JSON
app.use(express.json({ limit: "50mb" }));

//cors
app.use(cors());

// Body Parser
const bodyParser = require("body-parser");
app.use(
  bodyParser.urlencoded({
    limit: "200mb",
    extended: true,
    parameterLimit: 1000000,
  })
);
app.use(bodyParser.json({ limit: "200mb" }));

//Router
app.use(router);

//Run Server
app.listen(8000, () => {
  console.log("Server is up");
});
