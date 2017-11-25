var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var moment   = require('moment');
var async    = require('async');

// main model
var Mute = new Schema({
  name           : String,
  start          : String,
  last           : Number,
});
Mute.index({ name: 1 }, { unique: true });
Mute.plugin(require('mongoose-lifecycle'));

Mute.pre('remove', function(next) {
  this.removeStats(function() {
    next();
  });
});

Mute.methods.active = function() {
  var m = moment(this.start);
  var diffInMins = m.diff(Date.now(), 'minutes');
  return (diffInMins + this.last) > 0;
};

Mute.methods.populateFromDirtyMute = function(dirtyMute) {
  this.name = dirtyMute.name || this.name;
  this.start = dirtyMute.start || this.start;
  this.last = dirtyMute.last || this.last;

  if (typeof(dirtyMute.name) !== 'undefined' && dirtyMute.name.length) {
    this.name = dirtyMute.name;
  }

  if (typeof(dirtyMute.start) !== 'undefined' && dirtyMute.start.length && moment(dirtyMute.start).isValid()) {
      this.start = dirtyMute.start;
  }

  if (typeof(dirtyMute.last) != 'undefined' && dirtyMute.last.length && parseInt(dirtyMute.last)) {
    this.last = parseInt(dirtyMute.last);
  }
};

module.exports = mongoose.model('Mute', Mute);
