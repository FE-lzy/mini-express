
const { exec } = require('../db/mysql')
const { getYearMonth, transformStrNumber, createRandom, getCodeCheckNum } = require('../utils/cryp')

const time = new Date().toLocaleString();
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
 * 保留
 * 存储激活码
 * @param {*} param 
 */
const db_insertActCode = (param) => {
    let sql = "insert into actCode " +
        "(sn,salt,number,ciphertext,createTime,batchId)" +
        "values ( '" +
        param.sn + "','" +
        param.salt + "','" +
        param.number + "','" +
        param.ciphertext + "','" +
        new Date().toLocaleString() + "'," + param.batchId + ")"
    return exec(sql).then(rows => {
        return rows
    })
}
const batchTotal = (param) => {
    let sql = `select count(id) as total from batch where 1=1 `
    if (param.role == 2) {
        sql += ' and state in (2,3)'
    }
    return exec(sql).then(rows => {
        return rows[0].total
    })
}
const db_selectbatch = (param) => {
    let n = (param.currentPage - 1) * 10;
    let sql = `select * from batch where 1=1 `
    if (param.role == 2) {
        sql += ' and state in (2,3)'
    }
    sql += ` order by id desc limit ${n},${param.pageSize}`;
    return exec(sql).then(rows => {
        return rows
    })
}
/**
 * 保留
 * 创建防伪码
 * @param {} param 
 */
const db_insertAntiCode = (param) => {
    const time = new Date().toLocaleString();
    let sql = `insert into anticode (sn,type,batchId,createTime) values 
    ('${param.sn}',${param.type},${param.batchId},'${time}')`
    return exec(sql).then(rows => {
        return rows
    })
}
const db_AntiTotal = (param) => {
    let sql = `select count(sn) as total from antiCode where 1=1 `
    if (param.state != 0) {
        sql += `and state=${param.state}`
    }
    return exec(sql).then(rows => {
        return rows[0].total
    })
}
/**
 * 删除act_anti的关系
 * @param {actSn} parma 
 */
const db_deleteActAnti = (param) => {
    param = param.trim();
    let sql = `delete from act_anti where actSn = '${param}'`;
    return exec(sql).then(rows => {
        return rows
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
 * 保留
 * 创建接收码
 * @param {receivesn} param 
 */
const db_insertReceive = (param) => {
    let sql = "insert into receivecode " +
        "(sn,batchId,createTime)" +
        "values ( '" +
        param.sn + "'," + param.batchId + ",'" +
        new Date().toLocaleString() + "')"
    return exec(sql).then(rows => {
        return rows
    })
}
/**
 * 绑定接收码和激活码
 * @param {receiveSn} param 
 * @param {actSn} param 
 */
const db_insertReceiveAct = (param) => {
    const time = new Date().toLocaleString();
    let sql = `insert into receive_act (receiveSn,actSn,createTime) 
    values 
    ('${param.receiveSn}','${param.actSn}','${time}')`;
    console.log(sql);
    return exec(sql).then(rows => {
        return rows
    })
}
/**
 * 删除rec_act的关系
 * @param {actSn} parma 
 */
const db_deleteRecAct = (param) => {
    param = param.trim();
    let sql = `delete from receive_act where receiveSn = '${param}'`;
    return exec(sql).then(rows => {
        return rows
    })
}
const getAntiRecord = (param) => {
    let sql = `
    select * from batch_record,state,user where batchId =  
    (select batchId from anticode where sn = '${param}') and batch_record.state = state.code and batch_record.userId = user.id`
    console.log(sql);
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
    if (param.state != 0) {
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

const createCodeBy = (table) => {
    let sql = "select sn from " + table + " ORDER BY sn DESC LIMIT 1"

    return exec(sql).then(rows => {
        if (rows.length > 0) {
            let sn = rows[0].sn
            return sn.slice(0, 5).toString() + (parseInt(sn.slice(4)) + 1).toString();
        }
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
 * 根据接收码获取激活码
 * @param {*} recCode 
 */
const getActByReciveCode = (recCode) => {
    let sql = `select actSn from receive_act where receiveSn = '${recCode}'`
    return exec(sql).then(rows => {
        return rows || {}
    })
}
/**
 * 根据激活码获取防伪码
 * @param {*} actCode  Array
 */
const getAntiByAct = (actCode) => {
    let sql = `select antiSn from act_anti where actSn in (${actCode})`
    return exec(sql).then(rows => {
        return rows || {}
    })
}
/**
 * 保留
 * 生成密文
 * @param {*} salt 
 * @param {*} number 
 */
const createCipherText = (salt, number) => {
    return getCodeCheckNum(transformStrNumber(salt + number))
}
/**
 * 插入批量
 * @param {*} param 
 */
const db_insertBatch = (param) => {
    const time = new Date().toLocaleString();
    let sql = `insert into batch (name,state,anti_jin,anti_yin,anti_chaye,actNum,recNum,note,createTime)
     value
     ('${param.name}',1,${param.anti_jin},${param.anti_yin},${param.anti_chaye},${param.actNum},${param.recNum},'${param.note}','${time}')`
    return exec(sql).then(rows => {
        return rows || {}
    })
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
    db_AntiTotal,
    db_insertReceive,
    db_insertReceiveAct,
    getActByReciveCode,
    getAntiByAct,
    db_insertBatch,
    createCodeBy,
    batchTotal,
    db_selectbatch,
    db_deleteActAnti,
    db_deleteRecAct,
    getAntiRecord,
    
}