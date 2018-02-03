'use strict';

const Joi = require('joi');
const Promise = require('bluebird');
const { getExchangeRate } = require('../services/exchange');


const helpText = `Valid Formats:
1. From USD To NGN
2. From GBP To USD Amount 100
3. To EUR From GBP
4. To NGN From BTC Amount 12.15`;


function getParams(text) {
  return new Promise((resolve, reject) => {
    text = text.trim();
    let regex = /^(from|to) ([a-z]{3}) ((from|to) ([a-z]{3}))( (amount)( \d*\.?\d+))?$/i;
    let match = regex.exec(text);

    if (!match) {
      return reject({ type: 'invalid-format' });
    }

    let v1 = match[1].trim().toLowerCase();
    let v2 = match[2].trim().toUpperCase();
    let v3 = match[4].trim().toLowerCase();
    let v4 = match[5].trim().toUpperCase();
    let v5 = null;
    let v6 = null;

    if (match[7]) {
      v5 = match[7].trim().toLowerCase();
      v6 = match[8].trim();
    }

    var from = v1 === 'from' ? v2 : v4;
    var to = v1 === 'to' ? v2 : v4;
    var amount = v5 === 'amount' ? parseFloat(v6) : 1; // Set amount to 1 if no amount is given

    return resolve({ from, to, amount });
  });
}

function formatAmount(amount) {
  return amount.toLocaleString(undefined, { maximumFractionDigits: 18 });
}

async function convertCurrency(request, h) {
  let { text } = request.payload;
  let message = null;

  if (text.trim().toLowerCase() === 'help') {
    message = helpText;
  }
  else {
    try {
      let params = await getParams(text);
      let rate = await getExchangeRate(params.from, params.to);
      let totalAmount = rate * params.amount;
      message = `${formatAmount(params.amount)} ${params.from} = ${formatAmount(totalAmount)} ${params.to}`;
    } catch (err) {
      if (err.type) {
        if (err.type === 'invalid-format') {
          message = `Invalid format.`;
        }
        else if (err.type === 'formatted') {
          message = err.message
        }
      }
      else {
        message = 'Unable to get exchange rate. Please try again.';
      }
    }
  }

  return h.response({ message })
          .code(200);
}


module.exports = [
  {
    method: 'POST',
    path: '/convert',
    handler: convertCurrency,
    options: {
      description: 'Convert currencies',
      tags: ['api'],
      validate: {
        payload: {
          text: Joi.string().required().description('Conversion command text')
        }
      }
    }
  }
];