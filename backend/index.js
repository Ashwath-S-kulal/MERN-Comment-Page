require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
app.use(cors()); 



const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/project_comments';

//  MongoDB connection 
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});
mongoose.connection.on('error', (err) => {
  console.error(' MongoDB connection error:', err);
});


//  Middleware 
app.use(express.json());

//  API routes 
const commentRoutes = require('./router/comment.router.js');
app.use('/api', commentRoutes);
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});


//  Serve frontend 
const frontendPath = path.join(__dirname, '../frontend/build');
app.use(express.static(frontendPath));

//  Fallback to index.html for React Router 
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});


//  Start server 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});



