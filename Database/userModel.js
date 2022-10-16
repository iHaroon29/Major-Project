const { Schema } = require('mongoose')
const connection = require('./dbConfig')

const userSchema = new Schema(
  {
    username: {
      type: String,
    },
    password: {
      type: String,
    },
    keyGenerated: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

userSchema.statics.saveUsers = async function (data) {
  try {
    const { username, password } = data
    const newUser = await this.create({ username, password })
    return newUser
  } catch (e) {
    console.log(e.message)
  }
}

userSchema.statics.findUsers = async function (data) {
  try {
    const { username } = data
    const existingUser = await this.findOne({ username })
    return existingUser
  } catch (e) {
    console.log(e.message)
  }
}

userSchema.statics.updateUsers = async function (data) {
  try {
    const { keysGenerated, username, password } = data
    let query = {},
      update = {}

    if (username) query.username = username
    if (keysGenerated) update.keyGenerated = keysGenerated

    return await this.findOneAndUpdate(query, update, { new: true })
  } catch (e) {
    console.log(e.message)
  }
}

userSchema.statics.deleteUsers = async function (data) {
  try {
    const { username } = data
    const deletedUser = await this.findOneAndDelete({ username })
    return deletedUser
  } catch (e) {
    console.log(e.message)
  }
}

const userModel = connection.model('Users', userSchema)

module.exports = userModel
