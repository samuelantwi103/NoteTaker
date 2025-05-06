const nodemailer = require('nodemailer')

class Mail {
  constructor(receipients, subject, text, html) {
    this.address = process.env.EMAIL_ADDRESS
    this.password = process.env.EMAIL_PASSWORD
    this.host = process.env.EMAIL_HOST
    this.port = process.env.EMAIL_PORT
    this.senderName = process.env.EMAIL_SENDER_NAME

    this.receipients = receipients
    this.subject = subject
    this.text = text
    this.html = html

    const transporter = nodemailer.createTransport({
      host: this.address,
      port: this.port,
      secure: false,
      auth: {
        user: this.address,
        pass: this.password
      }
    })
    this.transporter = transporter
  }

  static initialize() {
    return new Mail(null, null, null, null)
  }

  sendMail(receipients, subject, text, html) {

    (async () => {
      const receipientString = ""
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
        text: text,
        html: this.html
      })
      console.log("Message sent: ", info.messageId)
    })()

  }
}