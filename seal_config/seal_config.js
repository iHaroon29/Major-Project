const SEAL = require('node-seal')

module.exports = {
  async sealInitialize() {
    try {
      const seal = await SEAL()
      const schemeType = seal.SchemeType.bfv
      const securityLevel = seal.SecurityLevel.tc128
      const polyModulusDegree = 4096
      const bitSizes = [36, 36, 37]
      const bitSize = 20
      const parms = seal.EncryptionParameters(schemeType)

      parms.setPolyModulusDegree(polyModulusDegree)

      parms.setCoeffModulus(
        seal.CoeffModulus.Create(polyModulusDegree, Int32Array.from(bitSizes))
      )

      parms.setPlainModulus(
        seal.PlainModulus.Batching(polyModulusDegree, bitSize)
      )

      const context = seal.Context(parms, true, securityLevel)

      if (!context.parametersSet()) {
        throw new Error(
          'Could not set the parameters in the given context. Please try different encryption parameters.'
        )
      }

      const encoder = seal.BatchEncoder(context)
      const keyGenerator = seal.KeyGenerator(context)

      return { seal, context, keyGenerator, encoder }
    } catch (e) {
      console.log(e.message)
    }
  },
}
