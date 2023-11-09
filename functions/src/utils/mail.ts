import ejs from "ejs";
import path from "path";
import nodemailer from "nodemailer";
import sendgridMail, { MailDataRequired } from "@sendgrid/mail";

interface MailTemplateBody {
    userName?: string;
    userLoginId: string;
    userPassword: string;
    orgName?: string;
    type: "student" | "teacher" | "school";
}

const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "apikey",
        pass: "sendgrid api key",
    },
});

export async function sendNodeMailer(mail: nodemailer.SendMailOptions, body: MailTemplateBody) {
    if (body.type === "school") {
        const HTMLString = await ejs.renderFile(path.join(__dirname, "../views/schoolMailFormat.ejs"), {
            userLoginId: body.userLoginId,
            userPassword: body.userPassword,
        });

        const info = await transporter.sendMail({
            from: "examkul.developers@gmail.com",
            to: mail.to,
            subject: mail.subject,
            text: mail.text,
            html: HTMLString,
        });

        return info.messageId;
    } else {
        const HTMLString = await ejs.renderFile(path.join(__dirname, "../views/mail.ejs"), {
            userName: body.userName,
            userLoginId: body.userLoginId,
            userPassword: body.userPassword,
            orgName: body.orgName,
        });

        const info = await transporter.sendMail({
            from: "examkul.developers@gmail.com",
            to: mail.to,
            subject: mail.subject,
            text: mail.text,
            html: HTMLString,
        });

        return info.messageId;
    }
}

sendgridMail.setApiKey("sendgrid api key");

export async function sendMail(mail: MailDataRequired) {
    return sendgridMail.send(mail);
}
