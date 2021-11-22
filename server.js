require("dotenv").config();
const express = require("express");
const app = express();
// Database is MongoDB
const mongoose = require("mongoose");
// Connection with MongoDB -> Use .env variables
mongoose
  .connect(process.env.CONNECTIONSTRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    app.emit("pronto");
  })
  .catch((e) => console.log(e));
// Using Express Session (Cookie)
const session = require("express-session");
// Using MongoStore to store the Session of Express inside of database
const MongoStore = require("connect-mongo");
// Messages Flash -> When read disappear
const flash = require("connect-flash");
// Routes of the App
const routes = require("./routes");
const path = require("path");
// Used to improve de security of the web
const helmet = require("helmet");
// For the forms, use a valid token - CSRF Token
const csrf = require("csurf");
// Importing the middlewares
const {
  middlewareGlobal,
  checkCsrfError,
  csrfMiddleware,
} = require("./src/middlewares/middleware");

app.use(helmet());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "public")));

// Session Config
const sessionOptions = session({
  secret: "akasdfj0út23453456+54qt23qv  qwf qwer qwer qewr asdasdasda a6()",
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
});
app.use(sessionOptions);
app.use(flash());

// Files of VIEWS
app.set("views", path.resolve(__dirname, "src", "views"));
// Using EJS to render js in HTML
app.set("view engine", "ejs");

app.use(csrf());
// Our Middlewares
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);

app.on("pronto", () => {
  app.listen(3000, () => {
    console.log("Acessar http://localhost:3000");
    console.log("Servidor executando na porta 3000");
  });
});
