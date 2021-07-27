"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async (options) => {
    //1-create tansporter
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    const mailOptions = {
        from: 'Mohamed Aly <hello@mohamed.io>',
        to: options.email,
        subject: options.subject,
        text: options.message
    };
    //sending the email
    await transporter.sendMail(mailOptions);
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=email.js.map