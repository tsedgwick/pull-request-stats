const sum = require('./sum');
const divide = require('./divide');

module.exports = (list) => parseFloat(divide(sum(list), list.length)).toFixed(2);;
