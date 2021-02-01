const { cleanNumber } = require(`../_util`)
const twilio = require(`twilio`)

const { MessagingResponse } = twilio.twiml

const {
  log,
  error,
} = console

module.exports = async (req, res, next) => {
  const {
    SmsSid: sid,
    Body,
    To,
    From
  } = req.body

  log(`incoming message ${sid}: ${From} -> ${To}`)

  // TODO Send notification?

  const response = new MessagingResponse()

  return res.status(204).end()
}
