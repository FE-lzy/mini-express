const { wxconfig, getAccessTokenUrl, getUniCodeUrl, getOpenIdUrl } = require('../conf/wx')
var fs = require('fs');
var request = require('request')
const superagent = require('superagent');
const { exec } = require('../db/mysql')
const { generateOrderNumber } = require('../utils/code')
const time = new Date().toLocaleString();

var qiaoExtWeixin = require('qiao.ext.weixin');
/**
 * 获取绑定关系
 * @param {type,sn} param 
 */
const getBindInfo = (param) => {
    let sql
    if (param.type == 2) {
        sql = `select * from act_anti where actSn = '${param.sn}'`
    } else if (param.type == 3) {
        sql = `select * from receive_act where receiveSn = '${param.sn}'`
    }

    return exec(sql).then(rows => {
        return rows
    })
}
const checkOrder = (param) => {
    let sql = `select * from orders where actSn = '${param.sn}'`;
    return exec(sql).then(data => {
        return data
    })
}
const submitOrder = (param) => {
    const time = new Date().toLocaleString();
    let orderSn = generateOrderNumber();
    let insert_sql = `insert into orders (actSn,orderSn,userId,price,create_time) values 
            ('${param.sn}','${orderSn}',${param.userId},${param.price},'${time}')`
    return exec(insert_sql).then(data => {
        return orderSn
    })
}
const updateOrderState = (param) => {
    let sql = `update receive_record set state = 1 where orderSn = '${param.orderSn}'`
    return exec(sql).then(rows => {
        return rows || {}
    })
}

/**
 * 保留
 * 修改激活表的激活状态
 * @param {*} param 
 */
const updateActCode = (param) => {
    const time = new Date().toLocaleString();
    let sql = `update actcode set userId = ${param.userId} , activeTime = '${time}',state = 1 where sn = '${param.sn}'`;
    return exec(sql).then(rows => {
        return rows
    })
}

/**
 * 根据code获取openid
 * @param {*} param 
 */
const getWxOpenidByCode = (param) => {
    console.log(param);
    let url = getOpenIdUrl + "?appid=" + wxconfig.appid + "&secret=" + wxconfig.appscret
        + "&js_code=" + param.code + "&grant_type=authorization_code";
    return new Promise(function (reslove, reject) {
        superagent.get(url).then(res => {
            // console.log(res);
            reslove(res)
        }).catch(err => {
            reject(err)
        })
    })
}
/**
 * 根据用户名和密码登录获取基本信息
 * @param {*} param 
 */
const db_UserLoginByAccount = (param) => {
    let sql = `select * from User where username = '${param.username}' and password='${param.password}'`;
    return exec(sql).then(rows => {
        return rows
    })
}
/**
 * 绑定用户微信的openid 
 * @param {*} param 
 */
const db_BindOpenId = (param) => {

    const time = new Date().toLocaleString();
    let sql = `update user set openid = '${param.openid}',loginTime='${time}' where username='${param.username}'`;
    return exec(sql).then(rows => {
        return rows
    })
}
const db_selectBusiness = (param) => {
    console.log(param);
    let sql = `select * from business where `
    if (param.shopname) {
        sql += `shopname = '${param.shopname}' or `
    }
    if (param.phone) {
        sql += `phone = '${param.phone}' or `
    }
    if (param.userId) {
        sql += `userId = '${param.userId}' `
    }
    return exec(sql).then(rows => {
        return rows[0] || null
    })
}
/**
 * 插入商户信息
 * @param {*} param 
 */
const db_insertBusiness = (param) => {
    console.log('参数 ', param);

    const time = new Date().toLocaleString();
    //先插入商户表，在插入用户表
    let sql = `insert into business 
            (userId,username,shopname,phone,tel,introduce,
                province,city,district,region,
                licenseImg,shopImg,goodImg,otherImg,createTime) 
            values (${param.userId},'${param.username}','${param.shopname}',
            '${param.phone}','${param.tel}','${param.introduce}',
            '${param.province}','${param.city}','${param.district}','${param.region}',
            '${param.licenseImg}','${param.shopImg}','${param.goodImg}',
            '${param.otherImg}','${time}')`
    return exec(sql).then(rows => {
        return rows
    })
}
/**
 * 生成user
 * @param {*} param 
 */
const db_insertUser = (param) => {
    const time = new Date().toLocaleString();
    let sql = `insert into user (username,password,role,status,createTime) values 
        ('${param.username}','${param.password}',${param.role},${param.status},'${time}') `
    return exec(sql).then(rows => {
        return rows.insertId || ''
    })
}
const db_updateBusState = (param) => {
    let sql = `update business set actived=${param.actived} where id=${param.id}`
    return exec(sql).then(rows => {
        return rows
    })
}
/**
 * 通过openid登录小程序
 * @param {*} param 
 */
const db_UserLoginByOpenid = (param) => {
    let sql = `select * from user where openid = '${param.openid}'`
    return exec(sql).then(rows => {
        return rows
    })
}
const getAccessToken = () => {
    return new Promise(function (reslove, reject) {
        fs.readFile('./utils/wx_access_token.json', (err, data) => {
            console.log(data);
            if (err) { reject(err) }
            if (data && JSON.parse(data.toString()) && JSON.parse(data.toString()).expires_time > (new Date()).getTime()) {
                console.log('从文件中获取的token');
                reslove(JSON.parse(data.toString()).access_token);
            } else {
                // get请求获取token
                let url = getAccessTokenUrl + '?grant_type=client_credential&appid='
                    + wxconfig.appid + '&secret=' + wxconfig.appscret;
                request(url, function (error, response, body) {
                    if (error) {
                        reject(error)
                    }
                    body = JSON.parse(body);
                    body.expires_time = (new Date()).getTime() + body.expires_in;
                    fs.writeFile('./utils/wx_access_token.json', JSON.stringify(body), err => {
                        if (err) reject(err)
                    });
                    reslove(body.access_token);
                });
            }
        })
    })

}
const getCodeStrweam = async function (accessToken, scene) {
    var src2 = await qiaoExtWeixin.mpCodeSrc(2, accessToken,
        { page: '/pages/personal/login/login', scene: scene },
        'jpg');
    console.log('src2 ', src2);
    var base64Data = src2.replace(/^data:image\/\w+;base64,/, "");
    // var dataBuffer = new Buffer(base64Data, 'base64');
    //保存到本地
    return base64Data;
}

const getWxacode = (scene) => {
    //请求参数
    return new Promise(function (reslove, reject) {
        getAccessToken().then(token => {
            console.log('token', token);
            reslove(getCodeStrweam(token, scene));
        }).catch(err => {
            reject(err)
        });
    })
}
const isRecerive = (param) => {

    let sql = `
    select * from receivecode where sn = '${param.sn}'
    `;
    return exec(sql).then(rows => {
        return rows
    })
}
const getRecCodeInfo = (param) => {
    let sql = `
    select type,count(*) num from anticode where sn in 
    (select antiSn from act_anti where actSn in (select actSn from receive_act where receiveSn = '${param.sn}'))
     GROUP BY type`;
    return exec(sql).then(rows => {
        return rows
    })
}
const getActCodeInfo = (param) => {
    let sql = `
    select type,count(*) num from anticode where sn in 
    (select antiSn from act_anti where actSn  = '${param.sn}')
     GROUP BY type`;
    return exec(sql).then(rows => {
        return rows
    })
}
/**
* 确认接收
* @param {*} sn 
*/
const receiveSn = (sn) => {

    const time = new Date().toLocaleString();
    let sql = `update receivecode set receivedTime = '${time}' where sn = ${sn}`
    return exec(sql).then(rows => {
        return rows
    })
}
module.exports = {
    getAccessToken,
    getWxacode,
    getWxOpenidByCode,
    db_UserLoginByAccount,
    db_UserLoginByOpenid,
    db_BindOpenId,
    db_insertUser,
    db_insertBusiness,
    db_updateBusState,
    getBindInfo,
    getRecCodeInfo,
    isRecerive,
    receiveSn,
    submitOrder,
    updateActCode,
    checkOrder,
    getActCodeInfo,
    updateOrderState,
    db_selectBusiness
}