'use strict';
const faker = require('faker');
module.exports = {generateRandomAccount};

function generateRandomAccount(userContext, events, done) {
  userContext.vars.username = faker.internet.userName();
  userContext.vars.email = faker.internet.email();
  userContext.vars.password = faker.internet.password();

  return done();
}
