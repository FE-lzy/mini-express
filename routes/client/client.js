var express = require('express');
var router = express.Router();
const { SuccessModel, ErrorModel } = require('../../model/resModel')
const { login, setToken } = require('../../controller/client/user')
const { batch_add, batch_info } = require('../../controller/client/batch')
/**
 * 登录
 */
router.post('/login', async (req, res, next) => {
    let user = await login(req.body);
    if (user) {
        let token = await setToken(user.username)
        if (token) {
            let data = { token: token, userInfo: user }
            return res.json(new SuccessModel(data))
        }
    } else {
        return res.json(new ErrorModel('用户不存在'))
    }
});

router.post('/createBatch', async (req, res, next) => {
    let insertId = await batch_add(req.body);
    return res.json(new SuccessModel(insertId))
})
/**
 * 根据batchId查询详情
 */
router.post('/getBatchInfo', async (req, res, next) => {
    try {
        let data = await batch_info(req.body)
        return res.json(new SuccessModel(data))
    } catch (e) {
        return res.json(new ErrorModel(e))
    }
})

module.exports = router