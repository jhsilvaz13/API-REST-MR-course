var config=require("dotenv")

config.config()

module.exports = {
    mongoUri: process.env.MONGO_URI,
    secretSession: process.env.SECRET_SESSION,
    secretKey: process.env.SECRET_KEY,
}
