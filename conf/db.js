const env = process.env.NODE_ENV  //环境参数

// 配置
let MYSQL_CONF

if (env === 'dev') {
    // mysql
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: '123456',
        port: '3306',
        database: 'miniprogram_trace'
    }
}

if (env === 'production') {
    // mysql
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: '123456',
        port: '3306',
        database: 'miniprogram_trace'
    }
}

module.exports = {
    MYSQL_CONF
}