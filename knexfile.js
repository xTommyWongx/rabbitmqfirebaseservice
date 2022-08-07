require('dotenv').config();

module.exports = {
    development: {
        client: 'mysql',
        connection: {
            host : process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        } 
    },

    staging: {
        client: 'mysql',
        connection: {
            host : process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    },

    production: {
        client: 'mysql',
        connection: {
            host : process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.PRO_NAME,
            user: process.env.PRO_USERNAME,
            password: process.env.PRO_PASSWORD
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    }
};
