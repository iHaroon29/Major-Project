module.exports = {
  async dataChunking(data, chunkLength) {
    try {
      let a = []
      for (var i = 0; i < data.length; i += chunkLength) {
        a.push(data.substring(i, i + chunkLength))
      }
      return a
    } catch (e) {
      console.log(e.message)
    }
  },
}
