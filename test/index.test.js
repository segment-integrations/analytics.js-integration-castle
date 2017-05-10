'use strict';

var Analytics = require('@segment/analytics.js-core').constructor;
var integrationTester = require('@segment/analytics.js-integration-tester');
var integration = require('@segment/analytics.js-integration');
var sandbox = require('@segment/clear-env');
var Castle = require('../lib/');

describe('Castle', function() {
  var analytics;
  var castle;
  var options = { publishableKey: 'pk_123456789012345' };

  beforeEach(function() {
    analytics = new Analytics();
    castle = new Castle(options);
    analytics.use(integrationTester);
    analytics.use(Castle);
    analytics.add(castle);
  });

  afterEach(function() {
    analytics.restore();
    analytics.reset();
    castle.reset();
    sandbox();
  });

  it('should have the correct settings', function() {
    analytics.compare(Castle, integration('Castle')
    .option('publishableKey', '')
    .tag('<script src="//d2t77mnxyo7adj.cloudfront.net/v1/cs.js">'));
  });

  it('should load lib from CDN', function(done) {
    analytics.load(castle, done);
  });

  describe('initialize', function() {
    beforeEach(function() {
      analytics.spy(castle, 'load');
    });

    it('should push credentials to _castle queue', function() {
      analytics.initialize();
      analytics.deepEqual(window._castle.q, [['setKey', options.publishableKey]]);
    });

    it('should call load', function() {
      analytics.initialize();
      analytics.called(castle.load);
    });
  });

  describe('after loading', function() {
    beforeEach(function(done) {
      analytics.once('ready', done);
      analytics.initialize();
    });

    it('window._castle should be defined', function() {
      analytics.assert(window._castle);
    });

    describe('identify', function() {
      beforeEach(function() {
        analytics.spy(window, '_castle');
      });

      it('should call _castle with id and empty userProperties', function() {
        analytics.identify('id');
        analytics.called(window._castle, 'identify', 'id', {});
      });

      it('should call _castle with id and userProperties', function() {
        var userProperties = {
          email: 'young@fathers.com'
        };

        analytics.identify('id', {
          email: 'young@fathers.com'
        });

        analytics.called(window._castle, 'identify', 'id', userProperties);
      });
    });

    describe('page', function() {
      beforeEach(function() {
        analytics.spy(window, '_castle');
      });

      it('should call _castle#page', function() {
        analytics.page('Category', 'Name');
        analytics.called(window._castle, 'page');
      });
    });

    describe('track', function() {
      beforeEach(function() {
        analytics.spy(window, '_castle');
      });

      it('should call _castle#track', function() {
        var eventName = 'Event';
        var eventProperties = { prop: true };
        analytics.track(eventName, eventProperties);
        analytics.called(
          window._castle,
          'track',
          eventName,
          eventProperties
        );
      });
    });
  });
});
