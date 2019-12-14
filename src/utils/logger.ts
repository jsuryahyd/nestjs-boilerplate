import { configure, getLogger } from 'log4js';
import { join } from 'path';
configure({
  appenders: {
    errors: {
      type: 'dateFile',
      filename: join(__dirname, '../../logs', 'errors.log'),
    },
    debug: { type: 'file', filename: 'debug.log' },
  },
  categories: {
    debug: { appenders: ['debug'], level: 'debug' },
    default: { appenders: ['errors'], level: 'error' },
  },
});

export const errorLog = getLogger('errors');
