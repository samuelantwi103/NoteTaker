const nodemailer = require('nodemailer')

class MailService {
  constructor() {
    this.address = process.env.EMAIL_ADDRESS
    this.password = process.env.EMAIL_PASSWORD
    this.host = process.env.EMAIL_HOST
    this.port = process.env.EMAIL_PORT
    this.senderName = process.env.EMAIL_SENDER_NAME
    this.service = process.env.EMAIL_SERVICE

    const transporter = nodemailer.createTransport({
      // host: this.host,
      // port: this.port,
      service: this.service,
      secure: false,
      auth: {
        user: this.address,
        pass: this.password,
        
      }
    })
    this.transporter = transporter
  }

  static initialize() {
    console.log("Mail Service initialized")
    return new MailService()
  }

  async sendMail(receipients, subject, text, html) {
    try {

      // await (async () => {
      var receipientString = ""
      receipients.forEach((userMail, index) => {
        if (index === receipients.length || index === 0) {
          receipientString += userMail
        }
        else {
          receipientString += `, ${userMail}`

        }
      })
      console.log(receipientString)
      const info = await this.transporter.sendMail({
        from: `"${this.senderName}" <${this.address}>`,
        to: receipientString,
        subject: subject,
        text: text,
        html: html
      })
      console.log("Message sent: ", info.messageId)
      // })()

    } catch (error) {
      console.log(error)
      return {
        status: false,
        error: error.message
      }
    }
    return true
  }
}

module.exports = MailService