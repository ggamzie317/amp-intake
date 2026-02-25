// utils/time.js
'use strict';

function getAsOfISO() {
  return new Date().toISOString();
}

function getAsOfDate() {
  return new Date().toISOString().slice(0, 10);
}

module.exports = {
  getAsOfISO,
  getAsOfDate,
};
