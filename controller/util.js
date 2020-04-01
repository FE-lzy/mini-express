
const getLastSn = (dbname) => {
    let sql = "select sn from " + dbname + " ORDER BY sn DESC LIMIT 1"

    return exec(sql).then(rows => {
        return rows[0].sn || {}
    })
}