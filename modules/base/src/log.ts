import chalk from 'chalk';

export function info(moduleName: string, message: string): void {
  const time = new Date().toISOString();
  console.info(
    time +
    chalk.green(`INFO`) +
    ` [${moduleName}] ${message}`
  )
}

export function error(moduleName: string, message: string): void {
  const time = new Date().toISOString();
  console.error(
    time +
    chalk.red(`ERROR`) +
    ` [${moduleName}] ${message}`
  )
}

export function warn(moduleName: string, message: string): void {
  const time = new Date().toISOString();
  console.warn(
    time +
    chalk.yellow(`WARN`) +
    ` [${moduleName}] ${message}`
  )
}