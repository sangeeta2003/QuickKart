const mongoose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config();
const mongouri = process.env.MONGO_URI;

mongoose.connect(mongouri)
  .then(() => console.log("mongodb connected"))
  .catch(err => console.error("MongoDB connection error:", err));


module.exports = mongoose;
