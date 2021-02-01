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
  const phoneQuery = {
    smsEnabled: true,
    voiceEnabled: true,
    excludeAllAddressRequired: true,
    excludeLocalAddressRequired: true,
    excludeForeignAddressRequired: true,
    ...req.query
  }

  const isAllowed = checkAuth(req, `messaging:numbers:find`)

  if (!isAllowed) {
    return res.status(403).end()
  }

  try {
    // TODO Change `US` to another ISO country code, if you like?
    const numbers = await twilio.availablePhoneNumbers(`US`).local.list(phoneQuery)

    log(`found ${numbers.length} numbers`)
    numbers = numbers.map(number => ({ capabilities: number.capabilities, friendlyName: number.friendlyName, notFriendlyName: number.phoneNumber }))

    return res.json({ numbers })
  } catch (err) {
    error(`error occurred while finding numbers: `, error)

    return res.status(500).end()
  }
}

