var express = require('express');
var router = express.Router();
var request = require('request')
const { getYearMonth, transformStrNumber, createRandom, createRandomNumber, getCodeCheckNum } = require('../utils/cryp')
const { createAntiCode, getLastSn, createCipherText, db_insertReceive,createCode, db_AntiTotal, db_insertActAnti, db_insertActCode, db_selectAntiList, db_insertAntiCode } = require('../controller/code')
const { db_insertRecord, updateAntiState } = require('../controller/record')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { getAccessToken, getWxacode, db_updateBusState } = require('../controller/wxapi')
var fs = require('fs');
router.get('/test', function (req, res, next) {

    // getWxacode('123').then(result =>{
    //     return res.json(
    //         result
    //     )
    // })getAccessToken()
    getAccessToken().then(result => {
        console.log(result);
        return res.json(result)
    })
    // return res.json(
    //     getAccessToken()   
    // )
    // let date = getYearMonth();
    // let num = transformStrNumber(createRandom(false,8));
    // let randomNum = createRandom(false,8);
    // let total = getCodeCheckNum(num)
    // console.log(createCipherText('abcdefgf', '12234'));
    // console.log(createCode('actCode'));
    // getLastSn('actCode').then(result => {
    //     console.log(result);
    //     return res.json(result);
    // })
    // createAntiCode(1);
    // console.log(code);
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
router.post('/createReceiveCode',function(req,res,next){
    createCode('receivecode').then(data=>{
        
        db_insertReceive({sn:data}).then(result=>{
            return res.json(new SuccessModel(result));
        })
    })
})
/**
 * 新增
 * @param {*} param 
 * @param {*} res 
 */
const func_updateRecord = (data, res) => {
    for (let i = 0; i < data.selects.length; i++) {
        let param = {
            sn: data.selects[i].sn,
            state: data.state,
            userId: data.userId,
            type: data.selects[i].type
        }
        console.log(param);
        db_insertRecord(param).then(result => {
            updateAntiState(param).then(isupdate => {
                console.log(isupdate);
                if (i == data.selects.length - 1) {
                    return res.json(new SuccessModel(result))
                }
            })

        })
    }

}
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
 * 循环创建商品防伪码
 */
const fun_createAnti = (data, res) => {
    data.sn = lastSn.slice(0, 5).toString() + (parseInt(lastSn.slice(4)) + 1).toString();
    db_insertAntiCode(data).then(result => {
        let param = {
            sn: data.sn,
            userId: 1,
            state: 1,
            type: data.type
        }
        db_insertRecord(param).then(result => {
            index++;
            if (index == length) {
                console.log("我结束了")
                return res.json(new SuccessModel())
            } else {
                lastSn = data.sn;
                fun_createAnti(data, res)
            }
        })
    })
}
/**
 * 更改商户的审核状态
 */
router.post('/updateBusState', function (req, res, next) {
    db_updateBusState(req.body).then(data => {
        return res.json(new SuccessModel(data))
    })
});


var lastSn = '';
var length = 0 //总数量
var index = 0 //当前索引位置
router.post('/createAntiCode', function (req, res, next) {

    length = req.body.number
    index = 0
    getLastSn('antiCode').then(result => {
        lastSn = result.sn;
        let data = {}
        data.type = req.body.type;
        fun_createAnti(data, res);
    });
})
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

router.get('/createQrCode', function (req, res, next) {
    getWxacode('123').then(originBuffer => {

        var base64Img = originBuffer.toString('base64'); // base64图片编码字符串
        var dataBuffer = new Buffer(base64Img, 'base64');
        //保存到本地
        fs.writeFile('./static/3.jpg', dataBuffer, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("保存成功！");
            }
        });
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