const { postgresPool } = require('../config/databases')

const syncChangesToPostgres = async (change) => {
    try {
      const { operationType, fullDocument, documentKey, updateDescription } = change
  
      if (operationType === 'insert') {
        const { _id, name, username, password } = fullDocument
        await postgresPool.query(
          'INSERT INTO users (id, name, username, password) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING',
          [_id.toString(), name, username, password]
        )
        console.log('Inserted new user into PostgreSQL:', fullDocument)
      
      } else if (operationType === 'update') {
        const { updatedFields } = updateDescription
        const id = documentKey._id.toString()
  
        const updates = []
        const values = []
        let index = 1
  
        for (const [key, value] of Object.entries(updatedFields)) {
          updates.push(`${key} = $${index}`)
          values.push(value)
          index++
        }
  
        if (updates.length > 0) {
          values.push(id)
          const query = `UPDATE users SET ${updates.join(', ')} WHERE id = $${index}`
          await postgresPool.query(query, values)
          console.log('Updated user in PostgreSQL:', updatedFields)
        } else {
          console.warn('Update skipped: No fields to update.')
        }
  
      } else if (operationType === 'delete') {
        const id = documentKey._id.toString()
        await postgresPool.query('DELETE FROM users WHERE id = $1', [id])
        console.log('Deleted user from PostgreSQL:', id)
      }
    } catch (error) {
      console.error('Error syncing change to PostgreSQL:', error.message)
    }
}

module.exports = syncChangesToPostgres