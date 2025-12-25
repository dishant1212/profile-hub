require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectMongoDB = require('./config/db');
const userRouter = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URL = process.env.MONGODB_URL;

connectMongoDB(MONGODB_URL);

const whitelist = [
  'http://localhost:3000',
  'https://profile-hub-x0f8.onrender.com',
];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use('/api', userRouter);

app.listen(PORT, () => {
  console.log(`App Listening port ${PORT}.`);
});
