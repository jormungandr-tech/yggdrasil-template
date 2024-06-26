export interface VerifyCodeTemplate {
  (serviceName: string, code: string): string
}