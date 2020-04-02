var express = require('express');
var router = express.Router();
const { SuccessModel, ErrorModel } = require('../../model/resModel')

const { getInfo, updateInfo, getverify, updateverify, getbusInfo, updateBus } = require('../../controller/db/society')
/**
 * 茶叶协会
 */
router.post('/getInfo', async (req, res, next) => {
    let data = await getInfo(req.body)
    return res.json(new SuccessModel(data))
})
router.post('/updateInfo', async (req, res, next) => {
    let data = await updateInfo(req.body)
    return res.json(new SuccessModel(data))
})
router.post('/getverify', async (req, res, next) => {
    let data = await getverify(req.body)
    return res.json(new SuccessModel(data))
})
router.post('/updateverify', async (req, res, next) => {
    let data = await updateverify(req.body)
    return res.json(new SuccessModel(data))
})
router.post('/getbusInfo', async (req, res, next) => {
    let data = await getbusInfo(req.body)
    return res.json(new SuccessModel(data))
})
router.post('/updateBus', async (req, res, next) => {
    let data = await updateBus(req.body)
    return res.json(new SuccessModel(data))
})
module.exports = router;