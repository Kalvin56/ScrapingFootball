const { v4: uuidv4 } = require('uuid');

const generateUniqueKey = () => {
  return uuidv4();
}

module.exports = {
  generateUniqueKey
}