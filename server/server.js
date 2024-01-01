const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const port = 5000;

app.use(cors());
app.use(express.json());
//by part Axios
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//connection MySQL database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "document_flow",
  port: "3307",
});

connection.connect((err) => {
  if (err) {
    console.log("Error connecting to MySQL datebase =", err);
    return;
  }
  console.log("MySQL successfully connected!");
});

app.post("/signup", async (req, res) => {
  const { firstname, surname, email, isAdmin, password } = req.body;
  const sqlQuery =
    "INSERT INTO users(firstname,surname,email,isAdmin,password) VALUES(?,?,?,?,?)";

  try {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      connection.query(
        sqlQuery,
        [firstname, surname, email, isAdmin, hash],
        (err, result, fields) => {
          if (err) {
            console.error(
              "Error while inserting a user into the database (err status 401):",
              err
            );
            return res.json({ status: "error" });
          }
          return res.json({
            status: "ok",
            message: "New user Successfully created!",
          });
        }
      );
    });
  } catch (err) {
    console.error("Error = ", err);
    return res.json({ status: "error" });
  }
});

app.post("/login", (req, res) => {
  //Authenticate User
  const { email, password } = req.body;
  const sqlQuery = "SELECT * FROM users WHERE email = ?";

  connection.query(sqlQuery, [email], (err, data, fields) => {
    if (err) {
      res.json({ status: "error", message: err });
      return;
    }
    if (data.length == 0) {
      res.json({ status: "error", message: "no user found (status 401)" });
      return;
    }
    bcrypt.compare(password, data[0].password, function (err, result) {
      if (result) {
        const emailLocal = data[0].email;
        const token = jwt.sign(
          { email: emailLocal },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: 3600 }
        );
        return res.json({ status: "ok", token, data });
      } else {
        res.json({ status: "error", message: "no user found (status 401)" });
        return;
      }
    });
  });
});

app.post("/auth", function (req, res, next) {
  const authHeader = req.headers["authorization"];
  /*split because authHeader = Bearer {token}
        const token = {token}
    */
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
    if (err) return res.json({ status: "error", message: err });
    //data = email ,iat,exp
    res.json({ status: "ok", data });
  });
});

app.post("/checkEmailRepeat", (req, res) => {
  const { email } = req.body;
  const sqlQuery = "SELECT * FROM users WHERE email = ?";

  connection.query(sqlQuery, [email], (err, data, fields) => {
    if (err) {
      res.json({ status: "error", message: err });
      return;
    }
    if (data.length != 0) {
      res.json({ status: "repeat" });
      return;
    }
    else{
      res.json({status: 'ok'})
    }
  });
});

app.get("/api/fetchRoles",(req,res) =>{
  const queryString = 'SELECT * FROM roles';
  connection.query(queryString,(error, results)=>{
    res.json({ results });
  })
})



app.post("/api/addUsertoRole",(req, res) => {
  //array
  const { usersInRole } = req.body;

  if (!Array.isArray(usersInRole)) {
    return res.status(400).json({ error: `Invalid data format ${usersInRole}` });
  }
  
  const existingEmailsQuery = 'SELECT * FROM users';
  const existingEmailsValues = usersInRole.map(user => user.email);
  connection.query(existingEmailsQuery,(error, results) =>{
    if (error) {
      console.error('Error querying MySQL:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const results2 = results.filter(element => !existingEmailsValues.includes(element.email))
    
    res.json({ results2 });
  })
})


//test method
app.get("/", (req, res) => {
  res.send("Data from Backend server");
});

app.post("/check-post", (req, res) => {
  res.json({ msg: "Hello" });
});

app.listen(port, () => {
  console.log(`Example server listen port ${port}`);
});
