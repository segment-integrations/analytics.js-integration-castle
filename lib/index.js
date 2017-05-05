'use strict';

/**
 * Module dependencies.
 */

var integration = require('@segment/analytics.js-integration');

/**
 * Expose `Castle` integration.
 */

var Castle = module.exports = integration('Castle')
  .option('appId', '')
  .tag('<script src="//d2t77mnxyo7adj.cloudfront.net/v1/c.js">');

/**
 * Initialize.
 *
 * @api public
 */

Castle.prototype.initialize = function() {
  window._castle = window._castle || {};
  window._castle.q = window._castle.q || [];
  window._castle.q.push(['setAppId', this.options.appId]);

  this.load(this.ready);
};

/**
 * Loaded?
 *
 * @api public
 * @return {boolean}
 */

Castle.prototype.loaded = function() {
  return typeof window._castle === 'function';
};

/**
 * Identify
 *
 * @api public
 */

Castle.prototype.identify = function(identify) {
  var traits = identify.traits();
  delete traits.id;
  window._castle('identify', identify.userId(), traits);
};
