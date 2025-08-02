import nodemailer from "nodemailer";
import config from "../config";
import path from "path";
import ejs from "ejs";
import { AppError } from "../errors/AppError";
const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST as string,
  port: Number(config.SMTP_PORT),
  secure: true,
  auth: {
    user: config.SMTP_USER as string,
    pass: config.SMTP_PASS as string,
  },
});

interface ISendEmail {
  to: string;
  subject: string;
  templateName: string;
  templateData?: Record<string, any>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

export const sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments,
}: ISendEmail) => {
  try {
    const templatePath = path.join(__dirname, `templates/${templateName}.ejs`);
    const html = await ejs.renderFile(templatePath, templateData);
    const info = await transporter.sendMail({
      from: config.SMTP_FORM as string,
      to: to,
      subject: subject,
      html: html,
      attachments: attachments?.map((x) => ({
        filename: x.filename,
        content: x.content,
        contentType: x.contentType,
      })),
    });
    console.log(`Email send to ${to}:- ${info.messageId}`);
  } catch (err: any) {
    console.log(`Email send Error`, err?.message);
    throw new AppError(401, "Email Error");
  }
};
