const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery', false);

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    // eslint-disable-next-line no-console
    console.log(`db connection successful: ${conn.connection.host}`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`connection error: ${error}`);
    throw error;
  }
};

module.exports = { dbConnect };
