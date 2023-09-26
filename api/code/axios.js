const axios = require('axios');

const httpHF =
axios.create({
    baseURL: 'https://api-inference.huggingface.co',
    headers: {
        'Authorization': `Bearer ${process.env.HUGGING_FACE_KEY}`,
    }
});

module.exports = {
  httpHF
}