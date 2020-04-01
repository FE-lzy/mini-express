const wxconfig = {
    appid: 'wxdc8cbcd07f89cd7d',
    appscret: '650db6ea9798d6c4873a7f7dfaa39df3',
    mch_id: '1549205771', //商户号
    partner_key: 'buotao123buotao123buotao123buota', // 微信支付密钥
    notify_url: 'https://www.tendency.vip/api/pay/notify' // 微信异步通知，例：https://www.nideshop.com/api/pay/notify
}

const getAccessTokenUrl = 'https://api.weixin.qq.com/cgi-bin/token'

const getUniCodeUrl = "https://api.weixin.qq.com/wxa/getwxacodeunlimit"

const getOpenIdUrl = "https://api.weixin.qq.com/sns/jscode2session";

const baseUrl = 'http://localhost:3000'

module.exports = {
    wxconfig,
    getAccessTokenUrl,
    getUniCodeUrl,
    getOpenIdUrl,
    baseUrl
}