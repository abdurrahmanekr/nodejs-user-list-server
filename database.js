const { Client } = require('pg');

// Burayı kendi sisteminize göre düzenlemelisiniz
var opts = {
    user: 'postgres',
    database: 'postgres',
    password: 'password',
    host: '127.0.0.1',
    port: 5432,
};

if (process.env.DATABASE_URL) {
    opts = {
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    };
}

const client = new Client(opts)
client.connect();

module.exports = client;