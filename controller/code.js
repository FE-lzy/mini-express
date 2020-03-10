
const { exec } = require('../db/mysql')
const { getYearMonth, transformStrNumber, createRandom, getCodeCheckNum } = require('../utils/cryp')

/*
* 生成激活码
* 参数 type number 
* 返回promise   
*/
const createAntiCode = (type) => {
    let antiCode = createRandom(false, 8);
    let checkCode = getCodeCheckNum(transformStrNumber(antiCode))
    return type +
        getYearMonth() +
        antiCode +
        checkCode;
}
/**
 * 存储激活码
 * @param {*} param 
 */
const db_insertActCode = (param) => {
    let sql = "insert into actCode " +
        "(sn,salt,number,ciphertext,createTime)" +
        "values ( '" +
        param.sn + "','" +
        param.salt + "','" +
        param.number + "','" +
        param.ciphertext + "','" +
        new Date().toLocaleString() + "')"
    return exec(sql).then(rows => {
        return rows
    })
}


/**
 * 创建防伪码
 * @param {} param 
 */
const db_insertAntiCode = (param) => {
    let sql = "insert into antiCode " +
        "(sn,type,createTime)" +
        "values ( '" +
        param.sn + "','" +
        param.type + "','" +
        new Date().toLocaleString() + "')"
    return exec(sql).then(rows => {
        return rows
    })
}
const db_AntiTotal = (param) =>{
    let sql =  `select count(sn) as total from antiCode where 1=1 ` 
    if(param.state != 0) {
        sql += `and state=${param.state}`
    }    
    return exec(sql).then(rows => {
        return rows[0].total
    })
}
/**
 * 创建关联关系
 * @param {*} param 
 */
const db_insertActAnti = (param) => {
    let sql = "insert into act_anti " +
        "(actSn,antiSn,createTime)" +
        "values ( '" +
        param.actSn + "','" +
        param.antiSn + "','" +
        new Date().toLocaleString() + "')"
    return exec(sql).then(rows => {
        return rows
    })
}
/**
 * 根据条件查询防伪码
 * @param {*} param 
 */
const db_selectAntiList = (param) => {
    let n = (param.currentPage - 1) * 10;
    let sql = `select * from antiCode `
    if(param.state != 0) {
        sql += ` where state=${param.state} `
    }  
    sql += `order by sn desc limit ${n},${param.pageSize}`;
    return exec(sql).then(rows => {
        return rows
    })
}
/**
 * 创建码
 * 表类型
 * @param {*} table 
 */
const createCode = (table) => {
    return new Promise((resolve, reject) => {
        getLastSn(table).then(result => {
            console.log('上条', result);
            console.log('234324dfsd', createNewSn(result.sn));
            resolve(createNewSn(result.sn))
        }).catch(err => {
            reject(err)
        })
    })
}
/**
 * 创建新的sn
 * @param {} sn 
 */
const createNewSn = (sn) => {
    console.log('参数 ', sn);
    return sn.slice(0, 5).toString() + (parseInt(sn.slice(4)) + 1).toString()
}
// 获取上一条数据的sn码
const getLastSn = (dbname) => {
    let sql = "select sn from " + dbname + " ORDER BY sn DESC LIMIT 1"

    return exec(sql).then(rows => {
        return rows[0] || {}
    })
}
/**
 * 生成密文
 * @param {*} salt 
 * @param {*} number 
 */
const createCipherText = (salt, number) => {
    return getCodeCheckNum(transformStrNumber(salt + number))
}

module.exports = {
    createAntiCode,
    getLastSn,
    createCipherText,
    createCode,
    db_insertActCode,
    db_insertAntiCode,
    db_insertActAnti,
    db_selectAntiList,
    db_AntiTotal
}