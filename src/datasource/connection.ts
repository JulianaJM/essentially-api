const { Client } = require('@elastic/elasticsearch')
const client = new Client({
    node: process.env.BONSAI_URL,
});

export default client;
