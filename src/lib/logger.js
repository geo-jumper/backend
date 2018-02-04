'use strict';

import winston from 'winston';
const winstonLevels = { error: 0, warn: 1, info: 2, verbose: 3, debug: 4};

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      filename: 'logs/log.json',
      levels: winstonLevels,
      level: 0,
    }),
  ],
});

export const log = (method, text) => {
  logger.log(method, text);
};
