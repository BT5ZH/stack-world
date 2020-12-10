const AWS = require("aws-sdk");
// AWS.config.loadFromPath("./CONFIG.json");
const STS = new AWS.STS();

const params = {
  DurationSeconds: 3600,
  Policy:
    '{"Version": "2012-10-17", "Statement": [{"Sid": "VisualEditor0","Effect": "Allow","Action": ["s3:PutObject","s3:PutBucketTagging","s3:PutBucketAcl","s3:PutBucketPolicy","s3:PutObjectTagging","s3:PutObjectAcl"],"Resource": "*"}]}',
  RoleArn: "arn:aws-cn:iam::796401082536:role/PutS3OnlySTSFullAccess",
  RoleSessionName: "John",
  ExternalId: "PX66ATDOTAT3SB4NIC5L",
};

function assumeRole() {
  return new Promise((resolve, reject) => {
    STS.assumeRole(params, function (err, data) {
      if (err) reject(err);
      else resolve(data.Credentials);
    });
  });
}

module.exports = { assumeRole };
