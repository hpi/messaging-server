const {
  createThreads,
  checkAuth,
} = require(`../_util`)
const moment = require(`moment`)
const Twilio = require(`twilio`)

const {
  INTERNAL_NUMBERS,
} = require(`../_constants`)

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
  const {
    to,
    from,
    date,
  } = req.query

  if (!req.query) {
    return res.status(400).send(`Make sure to include a query string`)
  }

  const isAllowed = checkAuth(req, `messaging:history:sms`)

  if (!isAllowed) {
    return res.status(403).end()
  }

  log(`getting SMS history for query: `, req.query)

  try {
    const messageQuery = { 'dateSent>': moment(date).format('YYYY-MM-DD'), ...req.query }

    log(`finding messages using query: `, messageQuery)

    const rawMessages = await twilioClient.messages.list(messageQuery)

    log(`found ${rawMessages.length} messages`)

    const messagePromises = rawMessages.map(async (msg) => {
      if (Number(msg.numMedia) > 0) {
        log('parsing media messages (to)')

        msg.pictures = []

        const pictures = await twilioClient.messages(msg.sid)
            .media
            .list()

        const pictureUrl = `
          https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_ID}/Messages/${msg.sid}/Media/{pic.sid}
        `.trim()

        pictures.forEach((pic) => {
          const formattedPicUrl = pictureUrl.replace(`{pic.sid}`, pic.sid)

          msg.pictures.push(formattedPicUrl)
        })
      }

      return msg
    })

    const messages = await Promise.all(messagePromises)

    const threads = createThreads(messages, INTERNAL_NUMBERS)

    return res.json(threads)
  } catch (err) {
    error(`Error occurred while getting sms history: `, err)

    return res.sendStatus(500)
  }
}


