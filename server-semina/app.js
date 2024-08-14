const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

var app = express();

// router
const categoriesRouter = require("./app/api/v1/categories/router");
const imagesRouter = require("./app/api/v1/images/router");
const talentRouter = require('./app/api/v1/talents/router');

const v1 = "/api/v1/cms";

// middleware
const notFoundMiddleware = require("./app/middlewares/not-found");
const handleErrorMiddleware = require("./app/middlewares/handle-error");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is up and running",
  });
});

app.use(v1, categoriesRouter);
app.use(v1, imagesRouter);
app.use(v1, talentRouter);

app.use(notFoundMiddleware)
app.use(handleErrorMiddleware)

module.exports = app;
