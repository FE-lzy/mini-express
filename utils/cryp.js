const crypto = require('crypto')

// 秘钥
const SECRET_KEY = 'WJiol_8776#'

// md5 加密
function md5(content) {
    let md5 = crypto.createHash('md5')
    return md5.update(content).digest('hex')
}

// 加密函数
function genPassword(password) {
    const str = `password=${password}&key=${SECRET_KEY}`
    return md5(str)
}

// 得到当前年份+月份
function getYearMonth() {
    var date = new Date();
    var y = date.getFullYear()
    var m = date.getMonth() + 1
    m = m < 10 ? '0' + m : m
    return (y+m).slice(2);
}

// 解析字母和字符串，转换为数字格式
function transformStrNumber(s){
    return s.split("").map(function(o){
        return isNaN(o) ?  o.toUpperCase().charCodeAt()-64 : o ;
     }).join("");
}
/**
 *  随机生成N位字母和数字的值
 * 
 *  */
function createRandom(randomFlag,min,max){
    var str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
 
    // 随机产生
    if(randomFlag){
        range = Math.round(Math.random() * (max-min)) + min;
    }
    for(var i=0; i<range; i++){
        pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
    }
    return str;
}
/**
 *  随机生成数字
 * 
 *  */
function createRandomNumber(randomFlag,min,max){
    var str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
 
    // 随机产生
    if(randomFlag){
        range = Math.round(Math.random() * (max-min)) + min;
    }
    for(var i=0; i<range; i++){
        pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
    }
    return str;
}


// 传入随机数 生成有效校验码,三位密文
function getCodeCheckNum(number){
    let total = 0;
     number.split("").forEach(n => {
        total += parseInt(n) 
    })
    return total;
}

module.exports = {
    genPassword,
    getYearMonth,
    transformStrNumber,
    createRandom,
    getCodeCheckNum,
    createRandomNumber
}