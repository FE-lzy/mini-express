var express = require('express');
var router = express.Router();
var request = require('request')
const { getYearMonth, transformStrNumber, createRandom, createRandomNumber,
    getCodeCheckNum } = require('../utils/cryp')
const { db_insertBatch, createAntiCode, getLastSn, createCipherText,
    db_insertReceive, createCodeBy, createCode, db_AntiTotal, db_insertActAnti,
    db_insertActCode, db_selectAntiList, db_insertAntiCode, batchTotal, db_selectbatch } = require('../controller/code')
const { db_insertRecord, updateAntiState, func_updateRecord, db_insertRecordByBatch, updateRecordByBatch } = require('../controller/record')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { createAct, createRec, createAnti } = require('../controller/createCode')
const { getAccessToken, getWxacode, db_updateBusState } = require('../controller/wxapi')
var fs = require('fs');
const { login } = require('../controller/client/user')

/**
 * 创建批次
 */
router.post('/createBatch', function (req, res, next) {
    db_insertBatch(req.body).then(result => {
        console.log('db_insertBatch', result);
        if (result.affectedRows > 0) {
            createAnti(req.body.anti_jin, 1, result.insertId).then(data => {
                createAnti(req.body.anti_yin, 2, result.insertId).then(data => {
                    createAnti(req.body.anti_chaye, 3, result.insertId).then(data => {
                        createAct(req.body.actNum, result.insertId).then(data => {
                            createRec(req.body.recNum, result.insertId).then(data => {
                                let param = {
                                    batchId: result.insertId,
                                    state: 1,
                                    userId: req.body.userId,
                                }
                                db_insertRecordByBatch(param).then(data => {
                                    if (data) {
                                        return res.json(new SuccessModel(data))
                                    }
                                })
                            })
                        })
                    })
                })
            })


        } else {
            return res.json(new ErrorModel('失败'))
        }
    }).catch(err => {
        console.log(err);
        return res.json(new ErrorModel(err))
    })
});
/**
 * 分页查询批次
 */
router.post('/getBatchList', function (req, res, next) {
    console.log(req.body);
    batchTotal(req.body).then(totalData => {
        db_selectbatch(req.body).then(result => {
            result = Object.assign({ data: result }, { total: totalData })
            return res.json(
                new SuccessModel(result)
            )
        })
    })
})
/**
 * 新增一条记录,--更新batch表
 * batchId
 * state
 * userId
 */
router.post('/addRecordByBatch', function (req, res, next) {
    db_insertRecordByBatch(req.body).then(result => {
        console.log(result);
        updateRecordByBatch(req.body).then(isUpdate => {
            return res.json(new SuccessModel(isUpdate))
        }).catch(err => {
            return res.json(new ErrorModel(err))
        })

    }).catch(err => {
        return res.json(new ErrorModel(err))
    })
})

router.post('/login', function (req, res, next) {
    login(req.body).then(result => {
        console.log(result);
        if (result.length == 0) {
            console.log('object');
            return res.json(new ErrorModel('用户不存在'))
        }
        let data = { token: "admin-token", result: result[0] }
        return res.json(new SuccessModel(data))
    }).catch(err => {
        return res.json(new ErrorModel(err))
    })
})

async function createCodes(param) {
    let r_id = await db_insertBatch(param);
    console.log(r_id);
    return r_id
}
router.post('/test', function (req, res, next) {
    let id = createCodes(req.body);
    console.log(id);
    return res.json(new SuccessModel(id))
})
/**
 * 创建激活码
 */
router.get('/createActCode', function (req, res, next) {
    createCode('actCode').then(actCode => {
        let data = {}
        data.sn = actCode
        data.salt = createRandom(true, 6, 10);

        data.number = createRandomNumber(false, 8)

        data.ciphertext = createCipherText(data.salt, data.number);

        db_insertActCode(data).then(result => {
            console.log(result);
            if (result.affectedRows > 0) {
                return res.json(new SuccessModel(result));
            } else {
                return res.json(new ErrorModel())
            }
        }).catch(err => {
            return res.json(new ErrorModel(err))
        })
    })

})
// const createActCode
router.post('/createReceiveCode', function (req, res, next) {
    // createCode('receivecode').then(data => {
    createCodeBy('receivecode').then(data => {
        db_insertReceive({ sn: data }).then(result => {
            return res.json(new SuccessModel(result));
        })
    })
})

/**
 * 创建发送到印刷厂的记录
 */
router.post('/sendPrintRecord', function (req, res, next) {
    let param = {
        selects: req.body.selects,
        state: req.body.state,
        userId: req.body.userId,
    }
    func_updateRecord(param, res);
})
/**
 * 新增记录
 * 创建防伪码---公司接收
 */
router.post('/addRecord', function (req, res, next) {
    let param = {
        selects: req.body.selects,
        state: req.body.state,
        userId: req.body.userId,
    }
    func_updateRecord(param, res);
})
/**
 * 印刷厂接收
 */
router.post('/receivedPrintRecord', function (req, res, next) {
    let param = {
        selects: req.body.selects,
        state: req.body.state,
        userId: req.body.userId,
    }
    func_updateRecord(param, res);
})
/**
 * 更改商户的审核状态
 */
router.post('/updateBusState', function (req, res, next) {
    db_updateBusState(req.body).then(data => {
        return res.json(new SuccessModel(data))
    })
});
/**
 * 获取anti防伪码列表
 */
router.post('/getAntiList', function (req, res, next) {

    db_AntiTotal(req.body).then(totalData => {
        if (totalData > 0) {
            db_selectAntiList(req.body).then(result => {

                result = Object.assign({ data: result }, { total: totalData })
                console.log(result);
                return res.json(
                    new SuccessModel(result)
                )
            })
        } else {
            return res.json(
                new SuccessModel([])
            )
        }

    })
});

router.post('/createQrCode', function (req, res, next) {
    let sn = req.body.sn; //获取sn
    let type = req.body.type; //获取type
    console.log(sn + type);
    getWxacode(sn + type).then(originBuffer => {
        console.log(originBuffer);
        //生成二维码图片名称
        var imgname = './static/imgs/' + sn + '.jpg'
        fs.exists(imgname, function (exists) {
            if (!exists) {
                // var base64Img = originBuffer.toString('base64'); // base64图片编码字符串
                var dataBuffer = new Buffer(originBuffer, 'base64');

                //保存到本地
                fs.writeFile(imgname, dataBuffer, function (err) {
                    if (err) {
                        return res.json(new ErrorModel(err))
                    } else {
                        console.log("保存成功！");
                        return res.json(new SuccessModel(imgname))
                    }
                });
            } else {
                return res.json(new ErrorModel('已存在'))
            }
        })

    }).catch(err => {
        return res.json(new ErrorModel(err))
    })
})

router.get('/createImg', function (req, res, next) {
    fs.readFile('./static/1.jpg', function (err, originBuffer) {
        console.log(Buffer.isBuffer(originBuffer));

        // 生成图片2(把buffer写入到图片文件)
        fs.writeFile('./static/2.jpg', originBuffer, function (err) {
            if (err) { console.log(err) }
        });

        var base64Img = originBuffer.toString('base64');  // base64图片编码字符串

        // console.log(base64Img);

        var decodeImg = new Buffer.from(base64Img, 'base64');  // new Buffer(string, encoding)

        console.log(Buffer.compare(originBuffer, decodeImg));  // 0 表示一样


        // 生成图片3(把base64位图片编码写入到图片文件)
        fs.writeFile('./static/3.jpg', decodeImg, function (err) {
            if (err) { console.log(err) }
        });
    });
})
module.exports = router;