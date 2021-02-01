const Auth = require(`@qnzl/auth`)

const {
  JWT_PUBLIC_KEY,
  ISSUER,
} = process.env

module.exports = (req, claim) => {
  const auth = new Auth(JWT_PUBLIC_KEY)

  if (!req.headers.authorization) {
    return false
  }

  const [ _, token ] = req.headers.authorization.split(` `)

  if (!token) {
    return false
  }

  return auth.check(token, {
    desiredClaim: claim,
    issuer: ISSUER,
    subject: `watchers`,
  })
}
