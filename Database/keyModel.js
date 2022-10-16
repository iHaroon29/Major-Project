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
    uniqueId: {
      type: String,
    },
  },
  { timestamps: true }
)

keySchema.statics.saveNewKey = async function (data) {
  try {
    const { uniqueId, privateKey, publicKey } = data
    const newKey = await this.create({ uniqueId, privateKey, publicKey })
    return newKey
  } catch (e) {
    console.log(e)
    console.log(e.message)
  }
}

keySchema.statics.findKey = async function (data) {
  try {
    const { uniqueId, publicKey } = data
    const key = await this.findOne({ uniqueId, publicKey })
    return key
  } catch (e) {
    console.log(e.message)
  }
}

keySchema.statics.deleteKey = async function (uniqueId) {
  try {
    const deletedKey = await this.findOneAndDelete(uniqueId)
    return deletedKey
  } catch (e) {
    console.log(e.message)
  }
}

const keyModel = connection.model('Key Collection', keySchema)

module.exports = keyModel
