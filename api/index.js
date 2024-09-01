const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user.js");
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');

const app = express();
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

// Middleware setup
app.use(express.json());
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cors({
  origin: 'http://localhost:5173', // Adjust this to match your frontend origin
  credentials: true, // Allow cookies to be sent/received
}));
app.use(cookieParser());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/Airbnb", {
  // useNewUrlParser: true,
  // useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

const port = 4080;

// Test route
app.get('/test', (req, res) => res.send('Hello World!'));

// Register route
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const userDoc = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Respond with user info excluding password
    res.json({ name: userDoc.name, email: userDoc.email });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const userDoc = await User.findOne({ email });
    if (!userDoc) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, userDoc.password);
    if (!isPasswordValid) {
      return res.status(422).json({ error: 'Invalid password' });
    }

    // Sign JWT token
    const token = jwt.sign({ email: userDoc.email, id: userDoc._id }, jwtSecret, { expiresIn: '1h' });

    // Set token in cookie and send user data
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' }); // Secure cookies in production
    res.json({ name: userDoc.name, email: userDoc.email, token }); // Include token in response for debugging
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/profile',(req,res)=>{
  const {token}= req.cookies;
  if(token){

    jwt.verify(token,jwtSecret,{},async(err,userDate)=>{
      if(err)throw err;
    const {name,email,_id} = await User.findById(userDate.id);


      res.json({name,email,_id});
    });
    
  }
  else{
    res.status(422).json('pass not ok');
  }

})
app.post('/logout',(req,res)=>{
  res.cookie('token','').json(true);
})
// console.log(__dirname +'\\uploads');

app.post('/upload-by-link', async(req,res)=>{

  const {link}= req.body;
  const newName='photo' +Date.now()+'.jpg';
  await imageDownloader.image({
    url:link,
    dest:__dirname+'/uploads/'+ newName, 
  });
  // console.log(dest);
  res.json(newName)

  



})

// Start server
app.listen(port, () => console.log(`App listening on port ${port}!`));
