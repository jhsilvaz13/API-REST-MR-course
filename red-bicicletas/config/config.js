var config=require("dotenv")

config.config()

module.exports = {
    nodeEnv: process.env.NODE_ENV,
    mongoUri: process.env.MONGO_URI,
    secretSession: process.env.SECRET_SESSION,
    secretKey: process.env.SECRET_KEY,
    sendGridApiKey: process.env.SENDGRID_API_KEY,
}
