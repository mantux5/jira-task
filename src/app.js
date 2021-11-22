const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const cors = require('cors');
const httpStatus = require('http-status');
const routes = require('./routes/v1');

const app = express();

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(mongoSanitize());

// enable cors
app.use(cors());
app.options('*', cors());

// v1 api routes
app.use('/v1', routes);

app.use(express.static('public'))

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new Error(httpStatus.NOT_FOUND, 'Not found'));
});

module.exports = app;