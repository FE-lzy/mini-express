const { exec } = require('../../db/mysql')
/**
 * 创建-批次batch
 * param {anti_jin}
 * param {anti_yin}
 * param {anti_chaye}
 * param {actNum}
 * param {recNum}
 * param {name}
 * param {note}
 */
const db_batch_add = (param) => {
    const time = new Date().toLocaleString();
    let sql = `insert into batch (name,state,anti_jin,anti_yin,anti_chaye,actNum,recNum,note,createTime)
     value
     ('${param.name}',1,${param.anti_jin},${param.anti_yin},${param.anti_chaye},${param.actNum},${param.recNum},'${param.note}','${time}')`

    return exec(sql).then(rows => {
        console.log(rows, rows.insertId);
        return rows.insertId || null;
    })
}
const db_anti_info = (param) => {
    let sql = `select * from anticode where`
    if (param.sn) {
        sql += ` sn = '${param.sm}'`
    }
    if (param.batchId) {
        sql += ` batchId = ${param.batchId}`
    }
    return exec(sql).then(rows => {
        return rows || null;
    })
}
const db_act_info = (param) => {
    let sql = `select * from actcode where`
    if (param.sn) {
        sql += ` sn = '${param.sm}'`
    }
    if (param.batchId) {
        sql += ` batchId = ${param.batchId}`
    }
    return exec(sql).then(rows => {
        return rows || null;
    })
}
const db_rec_info = (param) => {
    let sql = `select * from receivecode where`
    if (param.sn) {
        sql += ` sn = '${param.sm}'`
    }
    if (param.batchId) {
        sql += ` batchId = ${param.batchId}`
    }
    return exec(sql).then(rows => {
        return rows || null;
    })
}
module.exports = {
    db_batch_add,
    db_anti_info,
    db_act_info,
    db_rec_info
}