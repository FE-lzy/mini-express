var express = require('express');
var router = express.Router();
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { getWxOpenidByCode, db_UserLoginByAccount, db_BindOpenId, db_UserLoginByOpenid } = require('../controller/wxapi')
/**
 * 根据小程序的code获取openid
 */
router.post('/getWxOpenid', function (req, res, next) {
    getWxOpenidByCode({ code: '021JiO1E0l7m6i2a925E0uMR1E0JiO1a' }).then(result => {
        console.log(result.text, JSON.parse(result.text).errcode);

        if (JSON.parse(result.text).errcode == undefined) {
            return res.json(new SuccessModel(result.text))
        } else {
            return res.json(new ErrorModel(result.text))
        }

    })
});
/**
 * 用户登录
 */
router.post('/wxUserLogin', function (req, res, next) {
    db_UserLoginByAccount(req.body).then(result => {
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
 */
router.post('/wxUserLoginByOpenid', function (req, res, next) {
    db_UserLoginByOpenid(req.body).then(result => {
        console.log(result);
        return res.json(new SuccessModel(result))
    })
})
module.exports = router;