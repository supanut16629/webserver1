const dotenv = require("dotenv")
dotenv.config()
const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors')
const jwt = require('jsonwebtoken')

const port = 5000

app.use(cors());
app.use(express.json());
//by part Axios
app.use((req,res,next) =>{
    res.header("Access-Control-Allow-Origin" , '*')
    res.header("Access-Control-Allow-Headers" , 'Origin, X-Requested-With, Content-Type, Accept');
    next();
})


//connection MySQL database
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test2",
    port: '3307'
})

connection.connect((err) =>{
    if(err){
        console.log("Error connecting to MySQL datebase =",err)
        return;
    }
    console.log("MySQL successfully connected!");
})

//Http Method

//create new user(Sign up)
app.post("/signup",async (req,res) => {
    const {email,name,password,phone} = req.body
    const sqlQuery = "INSERT INTO user(email,name,password,phone) VALUES(?,?,?,?)"
    try{
        connection.query(sqlQuery,[email,name,password,phone],(err,result,fields) => {
            if (err){
                console.error("Error while inserting a user into the database :",err);
                return res.status(400).send();
            } 
            return res.status(201).json({ message: "New user Successfully created!"})
            }
        )
    } catch(err){
        console.error("Error = ",err);
        return res.status(500).send();
    }
})

//fetch data from Database check Login
app.post('/login',(req,res) => {
    //Authenticate User
    const {email,password} = req.body;
    const sqlQuery = "SELECT * FROM user WHERE email = ? AND password = ?";
    connection.query(sqlQuery,[email,password],(err,data,fields) => {
        if (err){
            console.error("Error Login :",err)
            res.status(500).json({error : 'Internal Server Error' })
        }
        else{
            if(data.length > 0){
                const id = data[0].email
                const token = jwt.sign({id},process.env.ACCESS_TOKEN_SECRET,{ expiresIn : 30})


                // Send tokens in the response
                return res.json({Login: true , token , data });
                // res.json({ accessToken });
            }
            else{
                res.status(401).json({ message: 'Login Fail Invalid email or password' });
            }
        }
    })

})

// const generateAccessToken = (email) =>{
//     const expiresIn = 20;
//     return jwt.sign(email,process.env.ACCESS_TOKEN_SECRET,{ expiresIn : expiresIn})
// }

const authenticationToken = (req,res,next) => {
    const authHeader = req.headers['authorization']
    //if authHeader have value return authHeader.split(" ")[1] else underfiled
    const token = authHeader && authHeader.split(" ")[1] 
    if(token == null) return res.sendStatus(401)

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,email) => {
        if(err) return res.sendStatus(403)
        req.email = email
        next()
    })
}

//test method
app.get('/',(req,res) =>{
    res.send('Data from Backend server');
})

app.post('/check-token', (req, res) => {
    const token = req.body.token;

    if (!token) {
        return res.status(400).json({ error: 'Token is missing' });
      }
    
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          console.error('Token verification failed:', err);
          return res.status(401).json({ error: 'Token verification failed' });
        }
    
        console.log('Token verification successful. Decoded payload:', decoded);
        res.json({ message: 'Token verification successful' });
      });
})


app.listen(port, () =>{
    console.log(`Example server listen port ${port}`)
})