'use strict';

process.env.MONGODB_URI = 'mongodb://localhost/testing';
process.env.PORT = 3000;
process.env.CORS_ORIGINS = 'http://localhost:8080';
process.env.SECRET = 'ingonito';
process.env.NODE_ENV = 'debug';
process.env.API_URL = `http://localhost:${process.env.PORT}`;