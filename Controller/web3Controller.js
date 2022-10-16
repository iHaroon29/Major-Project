require('dotenv').config()

const Web3 = require('web3')
const provider = Web3.givenProvider || process.env.GANACHE_URL
const web3Provider = new Web3.providers.HttpProvider(provider)
let web3 = new Web3(web3Provider)

module.exports = {
  async basicWeb3Fnc(req, res, next) {
    try {
      const accounts = await web3.eth.getAccounts()
      res.send({ message: 'message', accounts })
    } catch (e) {
      console.log(e)
      res.status(400).send(e)
    }
  },
}
