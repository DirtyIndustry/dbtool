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
  async query(SQL) {
    let conn
    try {
      conn = await this.connect()
      const res = await conn.execute(SQL)
      const list = this.convertToObject(res)
      return list
    } catch (err) {
      alert('数据库错误! ' + err.message)
      console.error(err.message)
    } finally {
      if (conn)
        await conn.close()
        console.log('数据库连接断开.')
    }
  },
  // 将数据库返回数据转换为object列表
  convertToObject(result) {
    const list = []
    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows[i]
      const item = {}
      for (let j = 0; j < result.metaData.length; j++) {
        const name = result.metaData[j].name
        if (row[j] != null && row[j] instanceof Uint8Array) {
          item[name] = this.uint8arrayToUuid(row[j])
        } else {
          item[name] = row[j]
        }
      }
      list.push(item)
    }
    return list
  },
  // 将字节数组转换为UUID
  uint8arrayToUuid(byteArray) {
    return Array.from(byteArray, function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('').replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5");
  },
}

export default oracle