const { exec, escape } = require('../../db/mysql')
const { genPassword } = require('../../utils/cryp')
const jwt = require('jsonwebtoken');
const login = (data) => {
    // 生成加密的密码
    // password = escape(genPassword(password))
    const sql = `
        select  * from admin_user where username='${data.username}' and password='${data.password}'
    `
    return exec(sql).then(rows => {
        return rows[0] || null;
    })
}
var signkey = 'mes_qdhd_mobile_xhykjyxgs';
const setToken = function (username) {
    return new Promise((resolve, reject) => {
        const token = jwt.sign({
            username: username
        }, signkey, { expiresIn: 60 * 60 * 24 * 3 });

        console.log('token', token);
        resolve(token);
    })
}
const verToken = function (token) {
    return new Promise((resolve, reject) => {
        var info = jwt.verify(token, signkey, (error, decoded) => {
            if (error) {
                console.log(error.message)
                return
            }
        });
        console.log(info);
        resolve(info);
    })
}

module.exports = {
    login,
    setToken,
    verToken
}