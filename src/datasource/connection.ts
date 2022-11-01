const { Client } = require('@elastic/elasticsearch')
const client = new Client({
    node: process.env.ES_URL,
});

export default client;
