// create express app, set up routes, with a error handler middlewares that prints trace
const express = require("express");
const path = require("path");
const app = express();

const cors = require("cors");

app.use(cors());

// Set up routes here
// add express.static middleware, serving any file extension from the public folder
app.use("/images", (req, res, next) => {
  req.url = req.originalUrl;

  return express.static(path.join(__dirname, "public"))(req, res, next);
});

// add a GET / route that renders some HTML
app.get("/", (req, res, next) => {
  res.status(200).send(`<html>
                <head>
                    <title></title>
                </head>
                <body>

                    Hello world ${new Date().toLocaleTimeString()}
                    <br />
                    <img width="300px" src="http://localhost:3000/images/sample-product-orig.jpg"/>
                </body>
            </html>`);
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

// Start the server
const port = 3000 || process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
