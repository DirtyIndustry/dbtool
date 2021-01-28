<template>
  <div id="app">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="数据复位" name="数据复位">
        <panel-reset v-if="activeTab == '数据复位'"></panel-reset>
      </el-tab-pane>
      <el-tab-pane label="作业按钮" name="作业按钮">
        <task-action-panel v-if="activeTab == '作业按钮'"></task-action-panel>
      </el-tab-pane>
      <el-tab-pane label="HTTP请求" name="HTTP请求">
        <http-panel></http-panel>
      </el-tab-pane>
      <el-tab-pane label="SQL" name="SQL">
        <sql-panel></sql-panel>
      </el-tab-pane>
      <el-tab-pane label="点表修改" name="点表修改">
        <point-table-panel></point-table-panel>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import PanelReset from "@/components/PanelReset";
import TaskActionPanel from "@/components/TaskActionPanel";
import HttpPanel from "@/components/HttpPanel";
import SqlPanel from "@/components/SqlPanel";
import PointTablePanel from "@/components/PointTablePanel";

export default {
  name: "db-tool",
  components: {
    PanelReset,
    TaskActionPanel,
    HttpPanel,
    SqlPanel,
    PointTablePanel,
  },
  data() {
    return {
      loading: false,
      activeTab: "数据复位",
    };
  },
  methods: {
    // 读取设置文件
    getAppSettings() {
      try {
        const remote = require("electron").remote;
        const fs = require("fs");
        let filepath;
        if (remote.process.env.WEBPACK_DEV_SERVER) {
          filepath = "./static/appsettings.json";
        } else {
          filepath = path.join(
            remote.app.getAppPath(),
            "../../static/appsettings.json"
          );
        }
        if (!fs.existsSync(filepath)) {
          alert("Appsettings file not exist!");
          if (!fs.existsSync(path.dirname(filepath))) {
            fs.mkdirSync(path.dirname(filepath));
          }
          fs.writeFileSync(filepath, JSON.stringify(appsettings, null, 1));
        } else {
          fetch(filepath)
            .then((res) => res.json())
            .then((data) => {
              if (data.version < this.$store.settings.version || data.version == null) {
                alert('当前配置文件版本过低, 升级配置文件')
                fs.writeFileSync(filepath, JSON.stringify(this.$store.settings, null, 1))
              } else {
                this.$store.settings = data;
                this.$forceUpdate();
              }
            });
        }
      } catch (err) {
        alert(err.message);
      }
    },
    // 连接
    async initOracle() {
      const oracledb = require("oracledb");
      const DB_CONFIG = {
        user: "IMMSDBA",
        password: "Immspsw",
        connectString: "192.168.2.44:1521/orcl",
      };

      const connection = await oracledb.getConnection(DB_CONFIG);
      console.log("数据库连接成功!", connection);
      return connection;
    },
    // 查询
    async query(SQL) {
      let connection;
      try {
        this.loading = true;
        connection = await this.initOracle();
        const result = await connection.execute(SQL);
        const list = this.convertToObject(result);
        console.log("数据库返回结果:", list);
      } catch (err) {
        console.error(err);
      } finally {
        this.disposeConnection(connection);
        this.loading = false;
      }
    },
    // 关闭
    async disposeConnection(connection) {
      if (connection) {
        await connection.close();
        console.log("数据库连接断开.");
      }
    },
    // 将数据库返回数据转换为object列表
    convertToObject(result) {
      const list = [];
      for (let i = 0; i < result.rows.length; i++) {
        const row = result.rows[i];
        const item = {};
        for (let j = 0; j < result.metaData.length; j++) {
          const name = result.metaData[j].name;
          if (row[j] != null && row[j] instanceof Uint8Array) {
            item[name] = this.uint8arrayToUuid(row[j]);
          } else {
            item[name] = row[j];
          }
        }
        list.push(item);
      }
      return list;
    },
    // 将字节数组转换为UUID
    uint8arrayToUuid(byteArray) {
      return Array.from(byteArray, function (byte) {
        return ("0" + (byte & 0xff).toString(16)).slice(-2);
      })
        .join("")
        .replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5");
    },
    handleClick() {
      const SQL = "SELECT * FROM JOBQUEUE";
      this.query(SQL);
    },
  },
  mounted() {
    console.log("App mounted.")
    this.getAppSettings()
  },
};
</script>

<style>
/* CSS */
</style>
