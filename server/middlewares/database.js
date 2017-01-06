const config = require('../config');
const mysql = require('mysql');
const q = require('q');

let pool;

function get() {
    if (!pool) {
        init();
    }
    const deferred = q.defer();
    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err.message);
            process.exit(1);
        }
        else {
            deferred.resolve(connection);
        }
    });
    return deferred.promise;
}

function init() {
    pool = mysql.createPool({
        host: config.mysql.host,
        user: config.mysql.user,
        password: config.mysql.password,
        database: config.mysql.database
    });
}

function query(queryString, parameters) {
    const deferred = q.defer();

    get().then((connection) => {
        connection.beginTransaction((TransactionErr) => {
            if (TransactionErr) {
                deferred.reject(TransactionErr);
            }

            if (parameters) {
                connection.query(queryString, parameters, queryHandler);
            }
            else {
                connection.query(queryString, queryHandler);
            }

            function queryHandler(queryErr, result) {
                if (queryErr) {
                    connection.rollback(() => {
                        deferred.reject(queryErr);
                    });
                }
                else {
                    connection.commit((commitErr) => {
                        if (commitErr) {
                            connection.rollback(() => {
                                deferred.reject(commitErr);
                            });
                        }
                        else if (result.length === 0) {
                            deferred.resolve();
                        }
                        else if (result.length === 1) {
                            deferred.resolve(result[0]);
                        }
                        else {
                            deferred.resolve(result);
                        }
                    });
                }
            }
        });
    });
    return deferred.promise;
}

function testConnection() {
    get().then((connection) => {
        connection.release();
        console.log('MySQL database is ok');
    });
}

module.exports = {
    init,
    get,
    query,
    testConnection
};
