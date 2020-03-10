
const { exec } = require('../db/mysql')
/**
 * 创建记录
 * @param {*} param 
 */
var time = new Date().toLocaleString()
const db_insertRecord = (param) =>{
    let sql =  `insert into record (sn,state,userId,type,createTime) 
        values ('${param.sn}',${param.state},${param.userId},${param.type},'${time}')`

        return exec(sql).then(rows => {
            return rows
        })
}
/**
 * 更新最新状态
 * @param {*} param 
 */
const updateAntiState = (param) =>{
    let sql =  `update antiCode set 
    updateTime ='${time}' ,  
    state = ${param.state} 
    where sn = '${param.sn}'`

    return exec(sql).then(rows => {
        return rows
    })
}


module.exports = {
    db_insertRecord,
    updateAntiState
}