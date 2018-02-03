'use strict';

const Joi = require('joi');


let convertRequest = {
  method: 'POST',
  url: '/convert',
  payload: {
    text: ''
  }
};

async function getIncomingUssdMessage(request, h) {
  let { sessionId, serviceCode, phoneNumber, text } = request.payload;
  let responseMessage = null;

  if (text === '') {
    responseMessage = `CON Welcome to Forex Mobile.
    1. Convert currencies
    2. Help`;
  }
  else if (text == 1) {
    responseMessage = `CON Enter the command`;
  }
  else if (text == 2) {
    convertRequest.payload.text = 'help';
    let response = await h.request.server.inject(convertRequest);
    responseMessage = `END ${response.result.message}`;
  }
  else if (text.startsWith('1*')) {
    let command = text.split('*').reverse()[0];
    convertRequest.payload.text = command;
    let response = await h.request.server.inject(convertRequest);
    responseMessage = `END ${response.result.message}`;
  }
  else {
    responseMessage = `END Invalid option selected`;
  }
  
  return responseMessage;
}


module.exports = [
  {
    method: 'POST',
    path: '/ussd',
    handler: getIncomingUssdMessage,
    options: {
      description: 'USSD Webhook',
      tags: ['api']
    }
  }
];