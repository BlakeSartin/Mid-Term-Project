// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const database = require('./lib/database');

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();
// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");
const quizzesRoutes = require("./routes/quizzes");
const testsRoutes = require("./routes/tests");
const alternativesRoutes = require("./routes/alternatives");
// const widgets = require("./routes/widgets"); same as above

const answersRoutes = require("./routes/answers");
const questionsRoutes = require("./routes/questions");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
app.use("/api/quizzes", quizzesRoutes(db));
app.use("/api/answers", answersRoutes(db));
app.use("/api/questions", questionsRoutes(db));
app.use("/api/tests", testsRoutes(db));
app.use("/api/alternatives", alternativesRoutes(db));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", (req, res) => {
  Promise.all([
    database.getAllQuizzes(),
    database.getAllTests(),
  ])
  .then((data) => {
    const userId = req.session.user_id;
    const quizzes = data[0];
    const tests = data[1].filter(item => (item.user_id === Number(userId)));
    const templateVars = { quizzes, tests, userId };
    res.render("index", templateVars);
  })
  .catch((err) => {
    res.status(500).json({ error: err.message });
  });
});

app.get("/quizzes/:id", (req, res) => {
  Promise.all([
    database.getQuizByQuizId(req.params.id),
    database.getQuestionsByQuizId(req.params.id),
    database.getAllAlternatives(),
  ])
  .then((data) => {
    const quiz = data[0];
    const questions  = data[1];
    const alternatives = data[2];
    for(let question of questions){
      let currentAlternative = alternatives.filter(el =>el.question_id === question.id);
      question["alternatives"] = currentAlternative;
    }
    const userId = req.session.user_id;
    console.log('User ID:', userId);
    console.log('User:', req.session);
    let templateVars = {quiz, questions, userId};
    res.render("quizzes", templateVars)
  })
  .catch((err) => {
    res.status(500).json({ error: err.message });
  });
});
app.post("/quizzes/:id", (req, res) => {
  console.log('Cookie Session', req.session);
  console.log('User ID', req.session.user_id);
  let testId;
  database.insertTest({
    'user_id': Number(req.session.user_id),
    'quiz_id': Number(req.params.id),
  })
  .then((newTest) => {
    testId = Number(newTest.id);
    for (const questionKey in req.body) {
      const questionId = Number(questionKey.split('-')[1]);
      const alternativeId = Number(req.body[questionKey]);
      const answers = {
        'question_id': questionId,
        'alternative_id': alternativeId,
        'test_id': testId,
      }
      database.insertAnswer(answers);
    }
    res.redirect(`/results/${testId}`);
  })
  .catch((err) => {
    res.status(500).json({ error: err.message });
  });
});

app.get("/login/:id", (req, res) => {
  req.session.user_id = req.params.id;
  console.log('/', req.session);
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
