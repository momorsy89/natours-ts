import nodemailer from 'nodemailer';

export const sendEmail=async (options:any)=>{
    //1-create tansporter
    const transporter=nodemailer.createTransport({
       host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        }
    })

    const mailOptions={
        from:'Mohamed Aly <hello@mohamed.io>',
       to:options.email,
       subject:options.subject,
        text:options.message
    }
    //sending the email
    await transporter.sendMail(mailOptions);
}

