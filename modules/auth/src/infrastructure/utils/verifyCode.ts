const verifyCodeAlphabet = '0123456789';
export function generateVerifyCode(): string {
  return Array.from({length: 8})
    .map(() => verifyCodeAlphabet[Math.floor(Math.random() * verifyCodeAlphabet.length)])
    .join('');
}