'use strict';

import { log } from '../lib/logger';

export default (request, response, next) => {
  log('verbose', `Processing: ${request.method} On: ${request.url}`);
  return next();
};
