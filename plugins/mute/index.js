/**
 * Maintenance window plugin
 *
 * Adds the ability to pollers to set a maintenance window so that checks do not generate noise.
 *
 * Installation
 * ------------
 * This plugin is enabled by default. To disable it, remove its entry 
 * from the `plugins` key of the configuration:
 *
 *   // in config/production.yaml
 *   plugins:
 *     # - ./plugins/maintenanceWindow
 *
 * Usage
 * -----
 * Add a start date time of the maintenance window including timezone
 * such as: YYYY-MM-DD HH:mm z, plus duration of the window in minutes (e.g. 30, 60)
 *
 * When Uptime polls a check having a maintenance window set, if check time falls in 
 * maintenance window, then it will not be shown as down.
 */
var fs   = require('fs');
var ejs  = require('ejs');
var moment = require('moment')

var template = fs.readFileSync(__dirname + '/views/_detailsEdit.ejs', 'utf8');

exports.initWebApp = function(options) {
    
      var dashboard = options.dashboard;
    
      dashboard.on('populateFromDirtyCheck', function(checkDocument, dirtyCheck, type) {
        
        var muteStart = dirtyCheck.muteStart;
        if (muteStart) {
          if (!moment(muteStart).isValid()) {
            throw new Error('Bad format ' + dirtyCheck.muteStart);
          }
        }

        var muteLast = dirtyCheck.muteLast;
        if (muteLast) {
          if (!parseInt(muteLast)){
            throw new Error('Bad duration ' + dirtyCheck.muteLast);
          }
        }

        checkDocument.setPollerParam('muteStart', muteStart)
        checkDocument.setPollerParam('muteLast', parseInt(muteLast));
      });
    
      dashboard.on('checkEdit', function(type, check, partial) {
        partial.push(ejs.render(template, { locals: { check: check } }));
      });
};

exports.initMonitor = function(options) {
  
  options.monitor.on('pollerPolled', function(check, res, details) {
    // no specific implementation "after" poll
    return;
  });
  
};
  
