'use strict';

const Promise = require('bluebird');
const axios = require('axios');


async function getExchangeRate(currencyFrom, currencyTo) {
  return new Promise((resolve, reject) => {
    var currencies = `${currencyFrom.trim().toUpperCase()}_${currencyTo.trim().toUpperCase()}`;
    var url = `${process.env.CURRENCY_API_HOST}/convert?q=${currencies}&compact=ultra`;
    axios
      .get(url)
      .then(response => {
        if (Object.keys(response.data).length > 0) {
          return resolve(response.data[currencies]);
        }
        else {
          return reject({ type: 'formatted', message: 'Unable to get exchange rate. Please try again.' });
        }
      })
      .catch(() => reject({ type: 'formatted', message: 'Unable to get exchange rate. Please try again.' }));
  });
}

async function getCurrencies() {
  return new Promise((resolve, reject) => {
    var url = `${process.env.CURRENCY_API_HOST}/currencies`;
    axios
      .get(url)
      .then(response => resolve(response.data))
      .catch(err => reject(err));
    });
}


module.exports = {
  getExchangeRate,
  getCurrencies
};