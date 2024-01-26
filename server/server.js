require("dotenv").config();
const express = require("express");
const cors = require("cors");
const scannerRouter = require("./routes/scannerRoute.js");
const productsRouter = require("./routes/productsRoute.js");
const { loadAllDataIntoCache } = require("./controllers/productsController.js");
const { checkToken } = require("./middleware/auth");
const exec = require("child_process").exec;
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Initialize express apps
const app = express();

// Apply the rate limiting middleware to all requests.
const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Use an external store for consistency across multiple server instances.
});
app.use(limiter);

app.use(helmet());

// Apply middleware
//funtions that run before the routes
app.use(cors()); // where a requesr is coming from
app.use(express.json()); //turns encoding body into json
app.use(express.urlencoded({ extended: true })); //

// Use routers
app.use("/", productsRouter); //
app.use("/scanner", scannerRouter);
app.use("/favourites", require("./routes/favourites"));
app.use("/private", checkToken, require("./routes/private"));
app.use("/shoppinglist", checkToken, require("./routes/shoppinglist"));
app.use("/location", checkToken, require("./routes/location"));
app.use("/user", require("./routes/user"));

//upload local code
app.post("/github", (req, res) => {
  exec("git pull", (e, std, stdE) => {
    console.log(e, std, stdE);
  });
});

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

const port = process.env.PORT || 7001;
console.log(port);
const startServer = () => {
  app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
    // Start loading cache after server starts
    loadAllDataIntoCache()
      .then(() => {
        console.log("All product data... now in cache");
      })
      .catch((err) => {
        console.error("Failed to load data into cache:", err);
      });
  });
};

startServer();
