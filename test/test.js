const paillier = require('paillier-bigint')

const { publicKey, privateKey } = paillier.generateRandomKeysSync(3076)

const test = 10n
const c1 = publicKey.encrypt(test)
console.log(c1)
const d1 = privateKey.decrypt(c1)
console.log(d1)
