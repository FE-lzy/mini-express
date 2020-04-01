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
        console.log(rows,rows.insertId);
        return rows.insertId || null;
    })
}

module.exports = {
    db_batch_add
}