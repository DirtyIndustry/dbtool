const oracledb = require('oracledb')

const oracle = {
  // 连接数据库
  connect() {
    const DB_CONFIG = {
      user: "IMMSDBA",
      password: "Immspsw",
      connectString: "192.168.2.44:1521/orcl",
    }
    return new Promise((resolve, reject) => {
      oracledb.getConnection(DB_CONFIG, (err, conn) => {
        if (err)
          reject(err)
        console.log('数据库连接成功.')
        resolve(conn)
      })
    })
  },
}

export default oracle