const { db_insertBatch, createAntiCode, getLastSn, createCipherText, db_insertReceive, createCodeBy, createCode, db_AntiTotal, db_insertActAnti, db_insertActCode, db_selectAntiList, db_insertAntiCode } = require('../controller/code')
const { getYearMonth, transformStrNumber, createRandom, createRandomNumber, getCodeCheckNum } = require('../utils/cryp')

//循环创建激活码
var lastActSn = '';
var index_act = 0
// var index = 0 //当前索引位置
const createAct = (number, batchId) => {
    length = number;
    console.log('act数量', number);
    return new Promise(function (resolve, reject) {
        getLastSn('actCode').then(result => {
            lastActSn = result.sn;
            let data = { batchId: batchId };
            return new Promise(function (resolve, reject) {
                fun_createAct(data, resolve, reject)
            }).then(resultdata => {
                resolve(resultdata)
            })
        }).catch(err => {
            reject(err)
        })
    })
}
const fun_createAct = (data, resolve, reject) => {
    data.sn = lastActSn.slice(0, 5).toString() + (parseInt(lastActSn.slice(4)) + 1).toString();
    console.log(data);
    data.salt = createRandom(true, 6, 10);
    data.number = createRandomNumber(false, 8)
    data.ciphertext = createCipherText(data.salt, data.number);
    db_insertActCode(data).then(result => {
        index_act++;
        console.log(length, index_act);
        if (index_act == length) {
            console.log("我结束了")
            resolve(result)
        } else {
            lastActSn = data.sn;
            fun_createAct(data, resolve, reject)
        }
    }).catch(err => {
        reject(err)
    })
}
//循环创建防伪码
var lastSn = '';
var index = 0 //当前索引位置
const createAnti = (number, type, batchId) => {
    length = number
    index = 0
    return new Promise(function (resolve, reject) {
        getLastSn('antiCode').then(result => {
            lastSn = result.sn;
            let data = {}
            data.type = type;
            data.batchId = batchId;
            return new Promise(function (resolve, reject) {
                fun_createAnti(data, resolve, reject)
            }).then(resultdata => {
                resolve(resultdata)
            })
        }).catch(err => {
            reject(err)
        })
    })
}
const fun_createAnti = (data, resolve, reject) => {
    data.sn = lastSn.slice(0, 5).toString() + (parseInt(lastSn.slice(4)) + 1).toString();
    console.log(data);
    db_insertAntiCode(data).then(result => {
        index++;
        if (index == length) {
            console.log("我结束了")
            resolve(result)
        } else {
            lastSn = data.sn;
            fun_createAnti(data, resolve, reject)
        }
    }).catch(err => {
        reject(err)
    })
}
var lastRecSn = '';
var inde_rec = 0 //当前索引位置
const createRec = (number, batchId) => {
    length = number
    return new Promise(function (resolve, reject) {
        getLastSn('receivecode').then(result => {
            lastRecSn = result.sn;
            let data = {}
            data.batchId = batchId;
            return new Promise(function (resolve, reject) {
                fun_createRec(data, resolve, reject)
            }).then(resultdata => {
                resolve(resultdata)
            })
        }).catch(err => {
            reject(err)
        })
    })
}
const fun_createRec = (data, resolve, reject) => {
    data.sn = lastRecSn.slice(0, 5).toString() + (parseInt(lastRecSn.slice(4)) + 1).toString();
    console.log(data);
    db_insertReceive(data).then(result => {
        inde_rec++;
        if (inde_rec == length) {
            console.log("我结束了")
            resolve(result)
        } else {
            lastRecSn = data.sn;
            fun_createRec(data, resolve, reject)
        }
    }).catch(err => {
        reject(err)
    })
}
module.exports = {
    createAnti,
    createAct,
    createRec,
}