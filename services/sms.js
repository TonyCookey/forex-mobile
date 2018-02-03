'use strict';

const Promise = require('bluebird');
const AfricasTalking = require('africastalking')({ apiKey: process.env.API_KEY, username: process.env.API_USERNAME });

const sms = AfricasTalking.SMS;

async function sendMessage(from, to, message) {
  return new Promise((resolve, reject) => {
    sms.send({ from, to, message })
      .then(response => resolve(response))
      .catch(err => reject(err));
  });
}


module.exports = {
  sendMessage
};