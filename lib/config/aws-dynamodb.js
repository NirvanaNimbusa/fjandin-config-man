module.exports = async function getConfigAwsDynamo(o) {
    if (o.sync) {
        throw new Error('This type does not support sync');
    }
    const scanParams = {TableName: o.tableName};
    const awsConfig = {region: o.region};
    const AWS = require('aws-sdk');
    AWS.config.update(awsConfig);
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    const result = await new Promise((resolve, reject) => {
        dynamodb.scan(scanParams, (err, data) => {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        });
    });
    const config = result.Items.reduce((a, b) => ({...a, [b.key]: b.value}), {});
    return config;
};