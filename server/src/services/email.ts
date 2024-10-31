import config from '@server/config'
import logger from '@server/logger'
import nodemailer from 'nodemailer' // or any other email service you prefer

export const sendPasswordSetupEmail = async (
  email: string,
  setupLink: string
) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
      user: config.sendEmail.serviceEmail,
      pass: config.sendEmail.servicePassword,
    },
    authMethod: 'PLAIN',
  })

  const mailOptions = {
    from: config.sendEmail.serviceEmail,
    to: email,
    subject: 'Dentify - Set Up Your Password',
    html: `
      <p>Hello,</p>
      <p>Welcome to our clinic! Please click the link below to set up your password:</p>
      <a href="${setupLink}">Set up your password</a>
      <p>If you didn’t request this, please ignore this email.</p>
    `,
  }
  const info = await transporter.sendMail(mailOptions)
  logger.info('Message sent: %s', info.messageId)
}
