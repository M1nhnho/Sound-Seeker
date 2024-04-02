const mongoose = require('mongoose');
const ENV = process.env.NODE_ENV || 'development';

require('dotenv').config(
  {
    path: `${__dirname}/../.env.${ENV}`,
  }
);

async function connectDatabase() {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
  } catch (error) {
    console.error(error);
  }
}

mongoose.connection.on('connected', () => console.log('Connected to MongoDB'));
mongoose.connection.on('disconnected', () => console.log('Disconnected from MongoDB'));

module.exports = connectDatabase;