const express = require('express');
const creatorRoute = require('./creator.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/creators',
    route: creatorRoute,
  },
];
defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;