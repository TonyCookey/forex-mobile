'use strict';

const Joi = require('joi');
const { sendMessage } = require('../services/sms');


async function getIncomingSmsMessage(request, h) {
  let { id, linkId, from, to, text, date } = request.payload;

  try {
    let request = {
      method: 'POST',
      url: '/convert',
      payload: {
        text
      }
    };
    let response = await h.request.server.inject(request);
    await sendMessage(to, from, response.result.message);
  } catch (err) {
    console.error(err);
  }

  return h.continue;
}


module.exports = [
  {
    method: 'POST',
    path: '/sms',
    handler: getIncomingSmsMessage,
    options: {
      description: 'SMS Webhook',
      tags: ['api']
    }
  }
];