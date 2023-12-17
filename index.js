const express = require("express");
const jwt = require("jsonwebtoken");
const jwtPassword = "123456";

const app = express();

app.use(express.json());

const ALL_USERS = [
  {
    username: "harkirat@gmail.com",
    password: "123",
    name: "harkirat singh",
  },
  {
    username: "raman@gmail.com",
    password: "123321",
    name: "Raman singh",
  },
  {
    username: "priya@gmail.com",
    password: "123321",
    name: "Priya kumari",
  },
];

function userExists(username, password) {
  // write logic to return true or false if this user exists
  // in ALL_USERS array
  const user = ALL_USERS.find((user) => { user.username === username && user.password === password });
  if(!user) {return true}
  return false;
}

app.get('/', (req, res) => {
    res.send('Hello World!');
  });
app.post("/signin", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  console.log(username, password);
  if (!userExists(username, password)) {
    return res.status(403).json({
      msg: "User doesnt exist in our in memory db",
    });
  }

  var token = jwt.sign({ username: username }, jwtPassword);
  return res.json({
    token,
  });
});

app.get("/users", function (req, res) {
  const token = req.headers.authorization;
  console.clear();
  console.log(`the token string is ${token}`);
  try {
    console.log(`now we are validating the token `);
    const decoded = jwt.verify(token, jwtPassword);

    console.log(`the decoded string is ${decoded}`);
    const username = decoded.username;
    // return a list of users other than this username

    const users = ALL_USERS.filter((user) => user.username !== username);
    return res.json({
      users,
    });
  } catch (err) {
    return res.status(403).json({
      msg: "Invalid token",
    });
  }
});

console.log("app is rnning at 3001")
app.listen(3001)