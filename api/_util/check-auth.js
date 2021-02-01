const Auth = require(`@qnzl/auth`)

const {
  JWT_PUBLIC_KEY,
  ISSUER,
} = process.env

module.exports = (req, claim) => {
  const auth = new Auth(JWT_PUBLIC_KEY)

  const [ _, token ] = req.headers.authorization.split(` `)

  console.log("TOKEN:", token)
  if (!token) {
    return false
  }

  return auth.check(token, {
    desiredClaim: claim,
    issuer: ISSUER,
    subject: `watchers`,
  })
}
