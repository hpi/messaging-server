const { checkAuth } = require(`../_util`)
const Twilio = require(`twilio`)

const {
  log,
  error,
} = console

const {
  TWILIO_TOKEN,
  TWILIO_ACCOUNT_ID,
} = process.env

const twilioClient = Twilio(TWILIO_ACCOUNT_ID, TWILIO_TOKEN)

module.exports = async (req, res, next) => {
  const { sid } = req.body

  const isAllowed = checkAuth(req, `messaging:numbers:release`)

  if (!isAllowed) {
    return res.sendStatus(403)
  }

  try {
    // TODO Consider keeping a list of released numbers so you don't re-assign
    // it to another user before the number is fully 'cleaned' by Twilio.
    await twilio.incomingPhoneNumbers(sid).remove()

    return res.sendStatus(200)
  } catch (err) {
    error(`error occurred releasing number: `, error)

    return res.sendStatus(500)
  }
}

