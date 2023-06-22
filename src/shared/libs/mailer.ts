import * as nodemailer from 'nodemailer';

interface EmailOption {
  host?: string;
  port?: number;
  secure?: boolean;
  username?: string;
  password?: string;
  from?: string;
}

class Mailer {
  private option: EmailOption;

  constructor(option: EmailOption) {
    this.option = option;
  }

  async sendMail(to: string, subject: string, text: string) {
    const transporter = nodemailer.createTransport({
      host: this.option.host,
      port: this.option.port,
      secure: this.option.secure,
      auth: {
        user: this.option.username,
        pass: this.option.password,
      },
    });

    const mailOptions = {
      from: this.option.from,
      to,
      subject,
      text,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}

export default Mailer;