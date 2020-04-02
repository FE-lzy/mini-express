const { exec } = require('../../db/mysql')

const getInfo = (param) => {
    let sql = `select * from society where userId = ${param.userId}`
    return exec(sql).then(rows => {
        return rows[0] || null;
    })
}
const updateInfo = (param) => {
    let sql = `update society set username='${param.username}',region='${param.region}',
    province='${param.province}',city='${param.city}',district='${param.district}'  where userId=${param.userId}`
    return exec(sql).then(rows => {
        return rows || null;
    })
}

const getverify = (param) => {
    let sql = `select * from business where district = '${param.district}' and status = ${param.status}`
    return exec(sql).then(rows => {
        return rows || null;
    })
}
const updateverify = (param) => {
    let sql = `update business set status = 1  where id = ${param.id}`
    return exec(sql).then(rows => {
        return rows || null;
    })
}
const getbusInfo = (param) => {
    let sql = `select * from business where id= ${param.id}`
    return exec(sql).then(rows => {
        return rows[0] || null;
    })
}
const updateBus = (param) => {
    let sql = `update business set status = ${param.status} where id= ${param.id}`
    return exec(sql).then(rows => {
        return rows[0] || null;
    })
}
module.exports = {
    getInfo,
    updateInfo,
    getverify,
    updateverify,
    getbusInfo,
    updateBus
}