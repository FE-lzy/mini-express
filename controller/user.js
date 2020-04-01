const { exec, escape } = require('../db/mysql')
const login = (data) => {

    const sql = `
        select  * from user where username='${data.username}' and password='${data.password}'
    `
    return exec(sql).then(rows => {
        return rows
    })
}

module.exports = {
    login
}
