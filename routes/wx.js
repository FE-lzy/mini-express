var express = require('express');
var router = express.Router();
const { exec } = require('../db/mysql');
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { db_insertBusiness, db_selectBusiness, db_insertUser, getWxOpenidByCode, isRecerive, getBindInfo,
    db_UserLoginByAccount, getRecCodeInfo, getActCodeInfo, updateOrderState, db_BindOpenId, db_UserLoginByOpenid, checkOrder, submitOrder, updateActCode }
    = require('../controller/wxapi')
const { upload, createFolder, uploadFolder } = require('../controller/common')
const { baseUrl } = require('../conf/wx')
const { createUnifiedOrder } = require('../service/weixin')
const { func_updateRecord, db_recordByReceive, updateRecordByReceive, selectRecordByReceive } = require('../controller/record')
const { db_insertActAnti, db_insertReceiveAct, getActByReciveCode, getAntiByAct,
    db_deleteActAnti, db_deleteRecAct, getAntiRecord } = require('../controller/code')
/**
 * 获取当前二维码绑定信息
 * type 类型
 * sn 二维码sn
 */
router.post('/wxGetBindInfo', function (req, res, next) {
    let param = req.body;
    if (!param.type || !param.sn) { return res.json(new ErrorModel('缺乏参数')) }
    getBindInfo(req.body).then(result => {
        return res.json(new SuccessModel(result))
    })

});
router.post('/wxBindSn', function (req, res, next) {
    let param = req.body;
    if (!param.type || !param.sn || !param.selects) { return res.json(new ErrorModel('缺乏参数')) }
    getBindInfo(req.body).then(result => {
        return res.json(new SuccessModel(result))
    })
})

/**
 * 根据小程序的code获取openid
 * @param {code} param 
 */
router.post('/wxOpenid', function (req, res, next) {
    getWxOpenidByCode(req.body).then(result => {
        console.log(result.text, JSON.parse(result.text).errcode);

        if (JSON.parse(result.text).errcode == undefined) {
            return res.json(new SuccessModel(result.text))
        } else {
            return res.json(new ErrorModel(result.text))
        }

    })
});
/**
 * 用户登录-更新openid
 * @param {username} param 
 * @param {password} param 
 * @param {openid} param 
 */
router.post('/wxUserLogin', function (req, res, next) {
    console.log(req.body);
    db_UserLoginByAccount(req.body).then(result => {
        console.log(result.length);
        if (result.length > 0) {
            db_BindOpenId(req.body).then(isUpdate => {
                return res.json(new SuccessModel(result[0]))
            })
        } else {
            return res.json(new ErrorModel('账号或密码错误'))
        }
    })
});
router.post('/checkOrder', function (req, res, next) {
    checkOrder(req.body).then(data => {
        if (data.length > 0) {
            return res.json(new SuccessModel(data))
        } else {
            return res.json(new SuccessModel([]))
        }
    })
})
router.post('/updateOrder', function (req, res, next) {
    updateOrderState(req.body).then(data => {
        return res.json(new SuccessModel(data))
    }).catch(err => {
        return res.json(new ErrorModel(err))
    })
})
/**
 * 创建激活订单
 */
router.post('/submitOrder', function (req, res, next) {
    submitOrder(req.body).then(data => {
        console.log(data);
        if (data) {
            updateActCode(req.body).then(isUpdate => {
                return res.json(new SuccessModel(data))
            })
        } else {
            return res.json(new ErrorModel())
        }
    }).catch(err => {
        return res.json(new ErrorModel(err))
    })
});
router.post('/payfor', function (req, res, next) {
    let orderInfo = req.body;
    try {
        createUnifiedOrder({
            openid: orderInfo.openid,
            body: '订单编号：' + orderInfo.orderSn,
            out_trade_no: orderInfo.orderSn,
            total_fee: parseInt(orderInfo.price * 100),
            spbill_create_ip: ''
        }).then(returnParams => {
            console.log(returnParams);
            return res.json(new SuccessModel(returnParams))
        }).catch(err => {
            return res.json(new ErrorModel(err))
        })
    } catch (err) {
        return res.json(new ErrorModel(`微信支付失败 ${err.err_code_des || err.return_msg}`))
    }

});
router.post('/getActInfo', function (req, res, next) {
    let sql = `select price,sn,state,activeTime from actcode where sn = '${req.body.sn}'`
    exec(sql).then(data => {
        console.log(data);
        if (data.length > 0) {
            getActCodeInfo({ sn: req.body.sn }).then(result => {
                console.log(data[0].price);
                let returnParams = {
                    anti: result,
                    price: data[0].price,
                    state: data[0].state,
                    activeTime: data[0].activeTime
                }
                console.log(returnParams);
                return res.json(new SuccessModel(returnParams))
            })
        } else {
            return res.json(new ErrorModel('不存在'))
        }

    }).catch(err => {
        return res.json(new ErrorModel(err))
    })
});
/**
 * 判断用户是否已经登录，根据openid匹配用户并返回基本信息
 * @param {openid} param 
 */
router.post('/wxUserLoginByOpenid', function (req, res, next) {
    db_UserLoginByOpenid(req.body).then(result => {
        console.log(result);
        if (result.length > 0) {
            return res.json(new SuccessModel(result[0]))
        } else {
            return res.json(new ErrorModel(result))
        }
    })
})
router.post('/getRecCodeInfo', function (req, res, next) {
    isRecerive(req.body).then(result => {
        if (result.length > 0) {
            getRecCodeInfo(req.body).then(data => {
                data = Object.assign({ receiveTime: result[0].receiveTime, state: result[0].state }, { data })
                return res.json(new SuccessModel(data))
            })

        } else {
            return res.json(new ErrorModel('不存在次二维码'))
        }
    }).catch(err => {
        return res.json(new ErrorModel('出错'))
    })
});
/**
 * 接收码确认接收
 */
router.post('/receiveSn', async (req, res, next) => {
    if (!req.body || !req.body.sn) {

    }
    let isRec = await selectRecordByReceive(req.body);
    console.log(isRec);
    if (isRec.state == 1) {
        return res.json(new ErrorModel('已激活'))
    }
    let insertId = await db_recordByReceive(req.body);
    if (insertId) {
        let update = await updateRecordByReceive(req.body);
        if (update) {
            return res.json(new SuccessModel())
        } else {
            return res.json(new ErrorModel('接收失败'))
        }
    } else {
        return res.json(new ErrorModel(err))
    }
})
router.post('/updateRecRecord', function (req, res, next) {
    let recCode = '320201000000001';
    getActByReciveCode(recCode).then(data => {
        if (data.length > 0) {
            let actArray = data.map(i => {
                return "'" + i.actSn + "'"
            })
            getAntiByAct(actArray).then(antiArr => {
                let antiArray = antiArr.map(e => {
                    return { sn: e.antiSn }
                });
                let param = {
                    selects: antiArray,
                    state: 7,
                    userId: 1
                    // userId: req.body.userId,
                }
                console.log(param);
                func_updateRecord(param, res);
            })
        } else {
            return res.json(new ErrorModel('查询失败'))
        }
    })
});
//创建上传文件地址
createFolder(uploadFolder);

/**
 * 处理多个上传文件，一次最多上传9张
 * 上传图片，返回图片地址
 */
router.post('/uploadImg', upload.array('file', 9), function (req, res, next) {
    var file = req.files;
    console.log(file);
    let fileName = [];
    for (let i = 0; i < file.length; i++) {
        fileName.push(file[i].path.replace(/\\/g, "/"));
        // let url = baseUrl + `/` + fileName; //拼接好的前缀
    }
    return res.json(new SuccessModel(fileName))
});
router.post('/businessStatus', async (req, res, next)=> {
    let register = await db_selectBusiness(req.body)
    return res.json(new SuccessModel(register))
})
/**
 * 申请成为商户
 */
router.post('/wxApplyforPos', async (req, res, next) => {
    let register = await db_selectBusiness(req.body)
    console.log(register);
    if (register) {
        // if (register.status == 0) {
        //     return res.json(new ErrorModel('已申请，请勿重复申请'))
        // }
        return res.json(new ErrorModel('已申请，请勿重复申请'))
    }
    console.log(req.body);
    let param = {
        username: req.body.phone,
        password: req.body.phone.substring(5),
        role: 5,
        status: 0
    }
    let insertId = await db_insertUser(param)
    if (insertId) {
        let param = Object.assign({ userId: insertId }, req.body)
        db_insertBusiness(param).then(data => {
            console.log(data);
            if (data.insertId) {
                return res.json(new SuccessModel(data))
            }
        }).catch(err => {
            return res.json(new ErrorModel(err))
        })
    }

})
/**
 * 管理员扫码激活码绑定防伪码
 * @param {actSn} 激活码sn 
 * @param {antis} 防伪码起始
 */
router.post('/bindActAnti', function (req, res, next) {
    let antis = req.body.selects;
    let param = {}
    param.actSn = req.body.actSn.trim();
    db_deleteActAnti(req.body.actSn).then(isdelete => {
        console.log(isdelete);
        for (let j = 0; j < antis.length; j++) {
            console.log(antis[j]);
            for (let i = antis[j].start; i <= antis[j].end; i++) {
                param.antiSn = i;
                db_insertActAnti(param).then(r => {
                    if (i == antis[j].end && j == (antis.length - 1)) {
                        return res.json(new SuccessModel())
                    }
                }).catch(err => {
                    return res.json(new ErrorModel(err))
                })
            }
        }
    })
})
/**
 * 绑定接收码和激活码
 */
router.post('/bindRecAct', function (req, res, next) {
    let acts = req.body.selects;
    let param = {}
    param.receiveSn = req.body.recSn;
    db_deleteRecAct(param.receiveSn).then(isdelete => {
        console.log(isdelete);
        for (let j = 0; j < acts.length; j++) {
            console.log(acts[j]);
            for (let i = acts[j].start; i <= acts[j].end; i++) {
                param.actSn = i;
                db_insertReceiveAct(param).then(r => {
                    if (i == acts[j].end && j == (acts.length - 1)) {
                        return res.json(new SuccessModel())
                    }
                }).catch(err => {
                    console.log(err);
                    return res.json(new ErrorModel(err))
                })
            }
        }
    })
})
/**
 * 获取追溯记录
 */
router.post('/AntiRecord', function (req, res, next) {
    let param = req.body;
    console.log(param);
    if (!param.sn) { return res.json(new ErrorModel('参数缺失')) }
    getAntiRecord(param.sn).then(result => {
        console.log(result);
        return res.json(new SuccessModel(result))
    })
})
/**
 * 管理员扫码接收码绑定激活码
 */
router.post('/bindReceiveSn', function (req, res, next) {
    let param = { receiveSn: req.body.receiveSn }
    let actSns = req.body.actSn
    console.log(actSns);
    for (let i = actSns.split(',')[0]; i <= actSns.split(',')[1]; i++) {
        param.actSn = i;
        console.log(i);
        db_insertReceiveAct(param).then(data => {
            if (i == actSns.split(',')[1]) {
                return res.json(new SuccessModel(data))
            }
        }).catch(err => {
            return res.json(new ErrorModel(err))
        })
    }
})
module.exports = router;