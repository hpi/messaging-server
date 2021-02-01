const { cleanNumber } = require(`../_util`)
const twilio = require(`twilio`)

const {
  INTERNAL_NUMBERS,
} = require(`../_constants`)

const { VoiceResponse } = twilio.twiml

const {
  log,
  error,
} = console

const {
  FORWARDED_NUMBER,
} = process.env

module.exports = (req, res, next) => {
  const {
    CallSid: sid,
    To,
    From,
  } = req.body

  log(`incoming call ${sid}: ${From} -> ${To}`)

  const response = new VoiceResponse()

  if (INTERNAL_NUMBERS.includes(From)) {
    log(`forwarding call`)

    const dial = response.dial({
      callerId: From
    })

    dial.number(FORWARDED_NUMBER)
  } else {
    log(`rejecting call`)

    response.reject()
  }

  return res.send(response.toString())
}
