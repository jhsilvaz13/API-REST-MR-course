//CONNECT TO DB USING MONGOOSE AND DOTENV
const mongoose = require('mongoose');
const config = require('../config/config');
const mongoUri = config.mongoUri
mongoose.connect(mongoUri);
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to DB');
});
module.exports = db;