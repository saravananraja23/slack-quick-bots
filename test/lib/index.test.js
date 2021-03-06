'use strict';

const sinon = require('sinon');
const chai = require('chai'),
  expect = chai.expect;

const root = '../../';
const botLogger = require(root + 'lib/utils/logger');
const SlackBot = require(root + 'lib/index');
const config = require(root + 'test/mock/config');
const socketServer = require('./../../lib/bot/socket-server');

botLogger.setLogger();

describe('SlackBot test', function () {
  describe('single bot', function () {

    var testBots;

    beforeEach(function () {
      testBots = new SlackBot(config.singleBot, { isMock: true });
    });

    afterEach(function () {
      socketServer.closeClient();
    });

    describe('Should instantiate slackbots correctly', function () {

      it('Should contain all the basic config', function () {
        testBots.config.slack.should.be.ok;
        testBots.config.bots.should.be.ok;
      });

      it('Should be able send and receive message', function (done) {

        var onMessageSpy = sinon.spy((response) => {
          setTimeout(() => {
            expect(response.message).to.equal('Hello 1');
            done();
          }, 1);
        });

        testBots.start().then((botEvt) => {

          botEvt[0].on('connect', () => {
            botEvt[0].injectMessage({
              text: 'ping 1',
              channel: 'D1234567'
            });
          });

          botEvt[0].on('message', onMessageSpy);
        });
      });

    });

  });

  describe('multiple bot', function () {

    var testBots;

    beforeEach(function () {
      testBots = new SlackBot(config.multipleBot, { isMock: true });
    });

    afterEach(function () {
      socketServer.closeClient();
    });

    describe('Should instantiate slackbots correctly', function () {

      it('Should contain all the basic config', function () {
        testBots.config.slack.should.be.ok;
        testBots.config.bots.should.be.ok;
      });

      it('Should be able to send and receive message for all bots', function (done) {

        var onMessageSpy = sinon.spy((response) => {
          setTimeout(() => {
            expect(response.message).to.equal('Hello 1');
          }, 1);
        });

        var onMessageSpy1 = sinon.spy((response) => {
          setTimeout(() => {
            expect(response.message).to.equal('Hello 2');
            done();
          }, 1);
        });

        testBots.start().then((botEvt) => {

          botEvt[0].on('connect', () => {
            botEvt[0].injectMessage({
              text: 'ping 1',
              channel: 'D1234567'
            });
          });

          botEvt[0].on('message', onMessageSpy);

          botEvt[1].on('connect', () => {
            botEvt[1].injectMessage({
              text: 'ping 2',
              channel: 'D1234567'
            });
          });

          botEvt[1].on('message', onMessageSpy1);
        });
      });

    });

  });
});
