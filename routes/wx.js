var express = require('express');
var router = express.Router();
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { db_insertBusiness, db_insertUser, getWxOpenidByCode, db_UserLoginByAccount, db_BindOpenId, db_UserLoginByOpenid } = require('../controller/wxapi')
const { upload, createFolder, uploadFolder } = require('../controller/common')
const { baseUrl } = require('../conf/wx')
const { db_insertActAnti, db_insertReceiveAct } = require('../controller/code')
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
        console.log(result);
        if (result.length > 0) {
            db_BindOpenId(req.body).then(isUpdate => {
                return res.json(new SuccessModel(result[0]))
            })
        } else {
            return res.json(new ErrorModel('账号或密码错误'))
        }
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
/**
 * 申请成为商户
 */
router.post('/wxApplyforPos', function (req, res, next) {
    console.log(req.body);
    db_insertUser(req.body).then(insertState => {
        console.log(insertState);
        if (insertState.insertId) {
            req.body.userId = insertState.insertId
            db_insertBusiness(req.body).then(data => {
                console.log(data);
                if (data.insertId) {
                    return res.json(new SuccessModel(data))
                }

            }).catch(err => {
                return res.json(new ErrorModel(err))
            })
        }
    }).catch(err => {
        return res.json(new ErrorModel(err))
    })
})
/**
 * 管理员扫码激活码绑定防伪码
 * @param {actSn} 激活码sn 
 * @param {antis} 防伪码起始
 */
router.post('/bindActAnti', function (req, res, next) {
    let antis = req.body.antis;
    let param = {}
    param.actSn = req.body.actSn;
    for (let i = antis.split(',')[0]; i <= antis.split(',')[1]; i++) {
        param.antiSn = i;
        db_insertActAnti(param).then(r => {
            if (i == antis.split(',')[1]) {
                return res.json(new SuccessModel(r))
            }
        }).catch(err => {
            return res.json(new ErrorModel(err))
        })
    }
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