var config=require("dotenv")

config.config()

module.exports = {
    mongoUri: process.env.MONGO_URI,
}
