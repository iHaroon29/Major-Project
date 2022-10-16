const { Schema } = require('mongoose')
const connection = require('./dbConfig')

const keySchema = new Schema(
  {
    publicKey: {
      n: String,
      _n2: String,
      g: String,
    },
    privateKey: {
      type: String,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
  },
  { timestamps: true }
)

keySchema.statics.saveNewKeys = async function (data) {
  try {
    const { user_id, privateKey, publicKey } = data
    const newKey = await this.create({ user_id, privateKey, publicKey })
    return newKey
  } catch (e) {
    console.log(e)
    console.log(e.message)
  }
}

keySchema.statics.findKeys = async function (data) {
  try {
    const { user_id } = data
    const key = await this.findOne({ user_id })
    return key
  } catch (e) {
    console.log(e.message)
  }
}

keySchema.statics.deleteKeys = async function (user_id) {
  try {
    const deletedKey = await this.findOneAndDelete(user_id)
    return deletedKey
  } catch (e) {
    console.log(e.message)
  }
}

const keyModel = connection.model('Key Collection', keySchema)

module.exports = keyModel
