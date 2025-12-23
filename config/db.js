const mongoose = require('mongoose');

const connectMongoDB = (URL) => {
  mongoose.connect(URL).then(() => {
    console.log('MongooDB Connect sccessfully.');
  });
};

module.exports = connectMongoDB;
