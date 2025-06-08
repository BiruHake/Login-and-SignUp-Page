const express = require("express");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const uuid4 = require("uuid4");
const mysql = require('mysql2');
const path = require("path");
const cors = require('cors');
const app = express();
app.use(cors());
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname, 'public')));

const secreate_key = 'welcome';

const baseUrl='/Login-and-SignUp-Page'
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});


// Create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'college',
  password: 'Biru@123',
});

app.get("/", (req, res) => {
  res.send("server will start");
});



// Login validation route
app.post(`${baseUrl}/login`, (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required.' });
  }

  // MySQL query
  const query = 'SELECT * FROM userInfo WHERE username = ?';

  connection.query(query, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Server error.' });
    }

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    const user = results[0];

    bcrypt.compare(password,user.password,(err,isMatch)=>{
      if(err){
        return res.json({success:false,message:'internal server error'})
      }
      if(!isMatch){
        return res.json({success:false,message:'invalid username and password'})
      }
        // Successful login
    let token = jwt.sign({id:user.id,username:user.username,role:user.role},secreate_key,{expiresIn:'7d'})
   res.json({ success: true, message: 'Login successful!', redirectUrl: `${baseUrl}/showList`,token});
    })
  });
});


app.listen(port, () => {
  console.log(`server will start ${port}`);
});

process.on('SIGINT', () => {
  connection.end(err => {
    if (err) console.error('Error closing db connection:', err);
    else console.log('DB connection closed.');
    process.exit();
  });
});
