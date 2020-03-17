const { wxconfig, getAccessTokenUrl, getUniCodeUrl, getOpenIdUrl } = require('../conf/wx')
var fs = require('fs');
var request = require('request')
const superagent = require('superagent');
const { exec } = require('../db/mysql')
const time = new Date().toLocaleString();
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
/**
 * 插入商户信息
 * @param {*} param 
 */
const db_insertBusiness = (param) => {
    console.log('参数 ', param);

    const time = new Date().toLocaleString();
    //先插入商户表，在插入用户表
    let sql = `insert into business 
            (userId,legal,busLicence,storePicture,introduce,phone,createTime) 
            values (${param.userId},'${param.legal}','${param.busLicence}',
            '${param.storePicture}',
            '${param.introduce}','${param.phone}','${time}')`
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
    let sql = `insert into user (username,password,role,createTime) values 
        ('${param.username}','${param.password}',${param.role},'${time}') `
    return exec(sql).then(rows => {
        return rows
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

const getWxacode = (scene) => {
    //请求参数
    return new Promise(function (reslove, reject) {
        getAccessToken().then(token => {
            console.log('token', token);
            let url = getUniCodeUrl + '?access_token=' + token;
            let param = { scene: '1234567897877dsfjskdfh' }
            superagent.post(url).send(JSON.stringify(param)).timeout(50000).end((err, result) => {
                console.log(err);
                if (err) {
                    reject(err);
                } else {
                    reslove(result.body)
                }
            })

            // superagent.post('/api/pet')
            //     .send({ scene: 'Manny' })
            //     .set('Accept', 'application/json')
            //     .then(res => {
            //         alert('yay got ' + JSON.stringify(res.body));
            //     });
            // superagent.post(url)
            //     .set('Content-Type', 'application/json')
            //     .send(JSON.stringify(param))
            //     .then(res => {
            //         console.log('sssss ', res);
            //         reslove(res)
            //     })

            // request({
            //     url: url,
            //     method: "POST",
            //     body: JSON.stringify(param)
            // }, function (error, response, body) {
            //     console.log(body);
            //     if (!error && response.statusCode == 200) {
            //         reject(error)
            //     } else {
            //         reslove(body)
            //     }
            // });
        }).catch(err => {
            reject(err)
        });
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
    getBindInfo
}