/**
 * Module dependencies.
 */

var Mute          = require('../../../models/mute');
var async         = require('async');

/**
 * Mute Routes
 */
module.exports = function(app) {
  
  app.get('/mute/:name', function(req, res) {
    Mute
    .findOne({name: req.params.name })
    .exec(function(err, mute) {
      if (err) return next(err);
      res.json(mute);
    });
  });

};
