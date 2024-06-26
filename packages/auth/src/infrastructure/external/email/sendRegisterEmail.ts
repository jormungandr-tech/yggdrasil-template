import {TransporterType} from './transporter';
import {VerifyCodeTemplate} from '../../../application/verifyCodeTemplate';
import {TaskOption, tryCatch} from 'fp-ts/TaskOption';

export function sendRegisterEmail(
  from: string,
  to: string,
  code: string,
  serviceName: string,
  transporter: TransporterType,
  subjectTemplate: VerifyCodeTemplate,
  htmlTemplate: VerifyCodeTemplate,
  textTemplate?: VerifyCodeTemplate,
): TaskOption<void> {
  return tryCatch(async () => {
    await transporter.sendMail({
      from,
      to,
      subject: subjectTemplate(serviceName, code),
      text: textTemplate ? textTemplate(serviceName, code) : undefined,
      html: htmlTemplate(serviceName, code),
    })
  })
}