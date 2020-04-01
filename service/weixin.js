const crypto = require('crypto');
const md5 = require('md5');
const rp = require('request-promise');
const { wxconfig } = require('../conf/wx')
/**
 * 统一下单
 * @param payInfo
 * @returns {Promise}
 */
const createUnifiedOrder = (payInfo) => {
    console.log(payInfo);
    const WeiXinPay = require('weixinpay');
    const weixinpay = new WeiXinPay({
        appid: wxconfig.appid, // 微信小程序appid
        openid: payInfo.openid, // 用户openid
        mch_id: wxconfig.mch_id, // 商户帐号ID
        partner_key: wxconfig.partner_key // 秘钥
    });
    return new Promise((resolve, reject) => {
        weixinpay.createUnifiedOrder({
            body: payInfo.body,
            out_trade_no: payInfo.out_trade_no,
            total_fee: payInfo.total_fee,
            spbill_create_ip: payInfo.spbill_create_ip,
            notify_url: wxconfig.notify_url,
            trade_type: 'JSAPI'
        }, (res) => {
            console.log(res);
            if (res.return_code === 'SUCCESS' && res.result_code === 'SUCCESS') {
                const returnParams = {
                    'appid': res.appid,
                    'timeStamp': parseInt(Date.now() / 1000) + '',
                    'nonceStr': res.nonce_str,
                    'package': 'prepay_id=' + res.prepay_id,
                    'signType': 'MD5'
                };
                const paramStr = `appId=${returnParams.appid}&nonceStr=${returnParams.nonceStr}&package=${returnParams.package}&signType=${returnParams.signType}&timeStamp=${returnParams.timeStamp}&key=` + wxconfig.partner_key;
                returnParams.paySign = md5(paramStr).toUpperCase();
                resolve(returnParams);
            } else {
                reject(res);
            }
        });
    });
}

/**
 * 生成排序后的支付参数 query
 * @param queryObj
 * @returns {Promise.<string>}
 */
const buildQuery = (queryObj) => {
    const sortPayOptions = {};
    for (const key of Object.keys(queryObj).sort()) {
        sortPayOptions[key] = queryObj[key];
    }
    let payOptionQuery = '';
    for (const key of Object.keys(sortPayOptions).sort()) {
        payOptionQuery += key + '=' + sortPayOptions[key] + '&';
    }
    payOptionQuery = payOptionQuery.substring(0, payOptionQuery.length - 1);
    return payOptionQuery;
}

/**
 * 对 query 进行签名
 * @param queryStr
 * @returns {Promise.<string>}
 */
const signQuery = (queryStr) => {
    queryStr = queryStr + '&key=' + wxconfig.partner_key;
    const md5 = require('md5');
    const md5Sign = md5(queryStr);
    return md5Sign.toUpperCase();
}

/**
 * 处理微信支付回调
 * @param notifyData
 * @returns {{}}
 */
const payNotify = (notifyData) => {
    if (empty(notifyData)) {
        return false;
    }

    const notifyObj = {};
    let sign = '';
    for (const key of Object.keys(notifyData)) {
        if (key !== 'sign') {
            notifyObj[key] = notifyData[key][0];
        } else {
            sign = notifyData[key][0];
        }
    }
    if (notifyObj.return_code !== 'SUCCESS' || notifyObj.result_code !== 'SUCCESS') {
        return false;
    }
    const signString = signQuery(buildQuery(notifyObj));
    if (empty(sign) || signString !== sign) {
        return false;
    }
    return notifyObj;
}
module.exports = {
    createUnifiedOrder,
    payNotify
}