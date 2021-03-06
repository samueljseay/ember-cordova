'use strict';

var EmberBuildTask  = require('../tasks/ember-build');
var CdvBuildTask    = require('../tasks/cordova-build');
var LinkTask        = require('../tasks/link-environment');
var HookTask        = require('../tasks/run-hook');

var path            = require('path');
var defaultPlatform = require('../utils/default-platform');

module.exports = {
  name: 'cordova:build',
  aliases: ['cdv:build'],
  description: 'Build ember & cordova applications',
  works: 'insideProject',

  availableOptions: [{
    name: 'environment',
    type: String,
    default: 'development'
  }, {
    name: 'platform',
    type: String
  }],

  run: function(options) {
    var platform = options.platform || defaultPlatform(this.project);

    var hook = new HookTask({
      project: this.project,
      ui: this.ui
    });

    var emberBuild = new EmberBuildTask({
      project: this.project,
      ui: this.ui
    });

    var link = new LinkTask({
      project: this.project,
      ui: this.ui
    });

    var cordovaBuild = new CdvBuildTask({
      project: this.project,
      ui: this.ui
    });

    return hook.run('beforeBuild')
           .then(emberBuild.run(options.environment))
           .then(link.run())
           .then(cordovaBuild.run(platform))
           .then(hook.run('afterBuild'));
  }
};
