
const { db_batch_add } = require('../db/batch')
const { createAnti, createAct, createRec } = require('../createCode')
/**
 * 创建-批次batch
 * param {anti_jin}
 * param {anti_yin}
 * param {anti_chaye}
 * param {actNum}
 * param {recNum}
 * param {name}
 * param {note}
 */
async function batch_add(param) {
    try {
        let batchId = await db_batch_add(param);
        await createAnti(param.anti_jin, 1, batchId)
        await createAnti(param.anti_yin, 2, batchId)
        await createAnti(param.anti_chaye, 3, batchId)
        await createAct(param.actNum, batchId);
        await createRec(param.recNum, batchId);
        // console.log(insertId);
        return insertId;
    } catch (e) {
        return e;
    }
}

module.exports = {
    batch_add
}