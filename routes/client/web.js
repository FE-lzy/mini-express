var express = require('express');
var router = express.Router();
const { SuccessModel, ErrorModel } = require('../../model/resModel')

const { batch_add } = require('../../controller/client/batch')

router.post('/createBatch', async (req, res, next) => {
    let insertId = await batch_add(req.body);
    return res.json(new SuccessModel(insertId))
})

router.post('/batchList', function (req, res, next) {
    
})

module.exports = router
