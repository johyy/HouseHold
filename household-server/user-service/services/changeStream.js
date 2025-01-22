const { mongoose } = require('../config/databases')
const syncChangesToPostgres = require('./syncService')

const startChangeStream = () => {
  mongoose.connection.once('open', () => {
    console.log('Listening to changes in MongoDB...')
    const changeStream = mongoose.connection.collection('users').watch()

    changeStream.on('change', async (change) => {
      console.log('Change detected:', change)
      await syncChangesToPostgres(change)
    })
  })
}

module.exports = startChangeStream
