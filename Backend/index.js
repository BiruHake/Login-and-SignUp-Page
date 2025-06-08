const express = require("express");
const bcrypt = require('bcrypt');
const  uuid4 = require ("uuid4");
const mysql = require('mysql2');
const path=require("path");
const cors = require('cors');
const app = express();
app.use(cors());
const port = 3000;

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.set("view engine","ejs");
app.set("views",path.join("views"));

// Create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'college',
  password: 'Biru@123',
});


app.get("/",(req,res)=>{
    res.send("server will start")
})

//store the sign up user info...
app.post("/signUp", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.json({ success: false, message: "Username and password required" });
  }

  bcrypt.hash(password,10, (err,hash)=>{
    if(err){
      console.log(err);
      return;
    }
     const id = uuid4();
  const sql = 'INSERT INTO userInfo (id, username, password) VALUES (?, ?, ?)';
  const values = [id, username, hash];

  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error(err);
      return res.json({ success: false, message: "Database error" });
    }
    res.json({ success: true, message: "User registered successfully!" });
  });
  })
});


app.listen(port,()=>{
   console.log(`server will start ${port}`)
})

process.on('SIGINT', () => {
  connection.end(err => {
    if (err) console.error('Error closing db connection:', err);
    else console.log('DB connection closed.');
    process.exit();
  });
});
