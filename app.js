// create express app, set up routes, with a error handler middlewares that prints trace
const express = require("express");
const path = require("path");
const app = express();

const cookieParser = require("cookie-parser");
const cors = require("cors");
const {
  clearAllCookies,
  timerUI,
  subRequestContent,
  formUI,
} = require("./utils");

app.use(cors());
app.use(cookieParser());

const colorRed = "\x1b[31m"; // Red
const colorYellow = "\x1b[33m"; // Yellow

function coloredLog(color, message) {
  console.log(color + message);
}

app.use((req, res, next) => {
  res.locals.reqIsThirdParty =
    req.headers.host.includes("cross") || req.headers.host.includes("www");
  res.locals.fromMain = !res.locals.reqIsThirdParty;
  coloredLog(res.locals.reqIsThirdParty ? colorRed : colorYellow, "=========");
  console.log("Received cookies", req.cookies);
  console.log("Received body", req.query);
  console.log("request details", {
    url: req.url,
    host: req.headers.host,
    // referrer: req.headers.referer,
  });
  next();
});
// Set up routes here
// add express.static middleware, serving any file extension from the public folder
app.use("/images", (req, res, next) => {
  // clearAllCookies(req, res, {
  //   path: "/images",
  // });
  // res.cookie("x", "val", {
  //   maxAge: 1e3 * 3600,
  //   path: "/images",
  // });
  res.cookie("image-cross", "valp", {
    maxAge: 1e3 * 3600,
    sameSite: "none",
    secure: true,
  });
  req.url = req.originalUrl;
  return express.static(path.join(__dirname, "public"))(req, res, next);
});

// add a GET / route that renders some HTML
app.get("/", (req, res, next) => {
  // clearAllCookies(req, res);
  if (res.locals.fromMain) {
    // console.log("Set");
    // res.cookie("x", "val", {
    //   maxAge: 1e3 * 3600,
    // });
  } else {
    // res.cookie("bankPassword3", "valp", {
    //   maxAge: 1e3 * 3600,
    // });
    // clearAllCookies(req, res);
    // res.cookie("y", "val", {
    //   maxAge: 1e3 * 3600,
    // });
    console.log("Not set");
  }

  res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <link rel="icon" href="data:;base64,iVBORwOKGO=" />
        <head>
          <title></title>
          <style>
            code { background-color: lightgray; padding: 4px; }
            input { margin: 4px; }
          </style>
        </head>
          <body>
            <h1>${
              res.locals.fromMain
                ? `Main site (aka 1st party) at  ${port}`
                : `Cross site (aka 3rd party) at ${port}`
            }</h1>
            <p>Hello world</p>
            <p>local: ${new Date().toLocaleTimeString()}</p>
            <p>local: ${new Date().toUTCString()}</p>
            <pre>Cookies now   <code id="init-cookies">nothing</code></pre>
              <script defer>
                document.querySelector("#init-cookies").innerHTML = document.cookie || "nothing";
              </script>
            <pre>Cookies later <code id="post-cookies">can't say</code></pre>

            <h3>Testing domain</h3>

            ${subRequestContent({
              callThirdParty: !res.locals.reqIsThirdParty,
              src: `http://${
                true ? "cross" : "cross"
                // true ? "www.wdiff" : "www.wdiff"
              }.com/images/sample-product-orig.jpg`,
            })}

            <a  href="http://${
              true ? "cross" : "cross"
              // true ? "www.wdiff" : "www.wdiff"
            }.com?amount=3000&account=123id">3rd (good) site</a>
            <br />
          </body>
        </html>`);
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

// Start the server
// const port = process.env.PORT || 80;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// https
const port = process.env.PORT || 443;
const https = require("https");
const fs = require("fs");
const httpsOptions = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
};

const httpsServer = https.createServer(httpsOptions, app);

httpsServer.listen(port, () => {
  console.log(`HTTPS server is running on port ${port}`);
});
