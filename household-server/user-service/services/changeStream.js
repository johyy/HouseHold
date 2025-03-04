const { mongoose } = require("../config/databases")
const syncChangesToPostgres = require("./syncService")
const logger = require("../utils/logger")

const startChangeStream = () => {
    mongoose.connection.once("open", () => {
        logger.info("Listening to changes in MongoDB...")

        const changeStreams = [
            mongoose.connection.collection("users").watch(),
            mongoose.connection.collection("user_preferences").watch(),
        ]

        changeStreams.forEach((changeStream) => {
            changeStream.on("change", async (change) => {
                logger.info("Change detected:", change)
                await syncChangesToPostgres(change)
            })
        })
    })
}

module.exports = startChangeStream
