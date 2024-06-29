import chalk from 'chalk';

export function info(message: string): void {
  const time = new Date().toISOString();
  console.info(
    time +
    chalk.green(`INFO`) +
    ` ${message}`
  )
}

export function error(message: string): void {
  const time = new Date().toISOString();
  console.error(
    time +
    chalk.red(`ERROR`) +
    ` ${message}`
  )
}

export function warn(message: string): void {
  const time = new Date().toISOString();
  console.warn(
    time +
    chalk.yellow(`WARN`) +
    ` ${message}`
  )
}