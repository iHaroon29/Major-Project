export default {
  async httpRequestWithFetch({ url, options }) {
    try {
      const response = await fetch(url, options)
      const data = await response.json()
      return data
    } catch (e) {
      console.log(e.message)
    }
  },
}
