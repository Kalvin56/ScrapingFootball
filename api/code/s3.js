const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
  region: 'eu-west-3',
});

const s3 = new AWS.S3();

module.exports = {
  s3
}