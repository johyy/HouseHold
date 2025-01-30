const { mongoose } = require('../config/databases')
const syncChangesToPostgres = require('./syncService')

const startChangeStream = () => {
  mongoose.connection.once('open', () => {
    console.log('Listening to changes in MongoDB...')
    
    const changeStreams = [
      mongoose.connection.collection('products').watch(),
      mongoose.connection.collection('locations').watch(),
      mongoose.connection.collection('categories').watch(),
      mongoose.connection.collection('testProducts').watch(),
    ]

    changeStreams.forEach(changeStream => {
      changeStream.on('change', async (change) => {
        console.log('Change detected:', change)
        await syncChangesToPostgres(change)
      })
    })
  })
}

module.exports = startChangeStream