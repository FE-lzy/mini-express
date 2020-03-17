
const { exec } = require('../db/mysql')
const { SuccessModel, ErrorModel } = require('../model/resModel')
/**
 * 创建记录
 * @param {*} param 
 */
const db_insertRecord = (param) => {
    const time = new Date().toLocaleString();
    let sql = `insert into record (sn,state,userId,type,createTime) 
        values ('${param.sn}',${param.state},${param.userId},${param.type},'${time}')`

    return exec(sql).then(rows => {
        return rows
    })
}
/**
 * 更新最新状态
 * @param {*} param 
 */
const updateAntiState = (param) => {
    const time = new Date().toLocaleString();
    let sql = `update antiCode set 
    updateTime ='${time}' ,  
    state = ${param.state} 
    where sn = '${param.sn}'`

    return exec(sql).then(rows => {
        return rows
    })
}

/**
 * 新增
 * @param {*} param 
 * @param {*} res 
 */
const func_updateRecord = (data, res) => {
    for (let i = 0; i < data.selects.length; i++) {
        let param = {
            sn: data.selects[i].sn,
            state: data.state,
            userId: data.userId,
            type: 1
        }
        console.log(param);
        db_insertRecord(param).then(result => {
            updateAntiState(param).then(isupdate => {
                console.log(isupdate);
                if (i == data.selects.length - 1) {
                    return res.json(new SuccessModel(result))
                }
            })

        })
    }
}

// 创建记录
const db_insertRecordByBatch = (param) => {
    const time = new Date().toLocaleString();
    let sql = `insert into batch_record (batchId,state,userId,createTime) 
    value (${param.batchId},${param.state},${param.userId},'${time}')`
    return exec(sql).then(rows => {
        return rows || {}
    })
}
/**
 * 更新记录
 * @param {*} param 
 */
const updateRecordByBatch = (param) => {
    let sql = `update batch set state = ${param.state} where id= ${param.batchId}`
    return exec(sql).then(rows => {
        return rows || {}
    })
}
module.exports = {
    db_insertRecord,
    updateAntiState,
    func_updateRecord,
    db_insertRecordByBatch,
    updateRecordByBatch
}