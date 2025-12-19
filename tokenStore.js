let accessToken  = null

module.exports = {
    setToken : (token) => (accessToken = token),
    getToken: () => accessToken

}