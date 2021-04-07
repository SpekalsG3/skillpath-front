/* eslint-disable no-console */
class Logger {
  constructor (name = null) {
    this.name = name;
  }

  formatLog (level, message) {
    return `[${this.name}] ${level}: ${new Date().toJSON().slice(0, -1)} ${message}`;
  }

  log (message, level) {
    console.log(this.formatLog(level, message));
  }

  verbose (message) {
    console.log(this.formatLog('VERBOSE', message));
  }

  debug (message) {
    console.log(this.formatLog('DEBUG', message));
  }

  info (message) {
    console.log(this.formatLog('INFO', message));
  }

  warn (message) {
    console.log(this.formatLog('WARN', message));
  }

  error (message, ex) {
    if (ex && ex.message) {
      message += ` ErrorMsg: ${ex.message}`;
    }

    console.error(this.formatLog('ERROR', message));
  }
}

module.exports = Logger;
