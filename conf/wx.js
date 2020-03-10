const wxconfig = {
    appid: 'wx1a514254b52da212',
    appscret: '120e9078f35f620034d9cffca78973b0'
}

const getAccessTokenUrl = 'https://api.weixin.qq.com/cgi-bin/token'

const getUniCodeUrl = "https://api.weixin.qq.com/wxa/getwxacodeunlimit"

const getOpenIdUrl = "https://api.weixin.qq.com/sns/jscode2session";

module.exports = {
    wxconfig,
    getAccessTokenUrl,
    getUniCodeUrl,
    getOpenIdUrl
}