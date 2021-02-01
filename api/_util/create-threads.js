const crypto = require(`crypto`)

const md5 = str => crypto.createHash('md5').update(str).digest('hex')

module.exports = (messages, internalNumbers) => {
  return messages.reduce((_threads, msg) => {
    const internalNumber = internalNumbers.includes(msg.to) ? msg.to : msg.from
    const fromNumber = internalNumber === msg.to ? msg.from : msg.to

    const id = md5(`${fromNumber}-${internalNumber}`)

    if (id in _threads) {
      _threads[id].messages.push(msg)
    } else {
      _threads[id] = {
        from: fromNumber,
        to: internalNumber,
        messages: [ msg ],
      }
    }

    return _threads
  }, {})
}
