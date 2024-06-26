import * as nodemailer from 'nodemailer';

export type TransporterType = ReturnType<typeof MailTransporter>;

export function MailTransporter(
  host: string,
  port: number,
  secure: boolean,
  user: string,
  pass: string,
) {
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}
