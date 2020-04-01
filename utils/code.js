const _ = require('lodash');
/**
 * 生成订单的编号order_sn
 * @returns {string}
 */
module.exports = {
    generateOrderNumber() {
        const date = new Date();
        return date.getFullYear() + _.padStart(date.getMonth(), 2, '0') + _.padStart(date.getDay(), 2, '0') + _.padStart(date.getHours(), 2, '0') + _.padStart(date.getMinutes(), 2, '0') + _.padStart(date.getSeconds(), 2, '0') + _.random(100000, 999999);
    }
}