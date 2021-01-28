<template>
  <div>
    <el-row v-for="(item, index) in appsettings.DatabaseCommands" :key="index"
      class="list-row" :class="{'zebra': index % 2 == 0}">
      <el-col class="list-col" :span="16">{{item.name}}</el-col>
      <el-col class="list-col center" :span="4"
        ><el-button @click="handleClick(item)" :disabled="loading"
          >执行</el-button
        ></el-col
      >
      <el-col class="list-col center" :span="4"></el-col>
    </el-row>
    <div class="message-box" ref="Message" id="Message">
      <div class="message-line" v-for="(log, index) in logs" :key="index">
        <div class="message-time">{{log.time}}</div>
        <div class="message-content">{{log.message}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import oracle from "@/utils/oracle.js";
import moment from "moment";
import path from 'path'

let appsettings = {
  DatabaseCommands: [
    {
      name: '重置设备状态表',
      commands: [
        'UPDATE "EQUEPSTATUS" SET JOBCODE = NULL',
        'UPDATE "EQUEPSTATUS" SET PATHCODE = NULL',
        'UPDATE "EQUEPSTATUS" SET RUNSTATUS = 0',
        'UPDATE "EQUEPSTATUS" SET ISMATERIAL = 0',
        'UPDATE "EQUEPSTATUS" SET ISSTOP = 0',
        'UPDATE "EQUEPSTATUS" SET WANITEM = NULL',
        'UPDATE "EQUEPSTATUS" SET WANITEMCODE = NULL',
      ]
    },
    {
      name: '重置作业表',
      commands: [
        'UPDATE "JOBQUEUE" SET RUNSTATUS = \'可启动\'',
        'UPDATE "JOBQUEUE" SET POSENDSTATUS = \'可对位\'',
        'UPDATE "JOBQUEUE" SET POSSTARTSTATUS = \'可对位\'',
        'UPDATE "JOBQUEUE" SET FEEDSTATUS = \'不可给料\'',
        'UPDATE "JOBQUEUE" SET FAULTSTATUS = \'无故障\'',
        'UPDATE "JOBQUEUE" SET STATUS = 0',
      ]
    },
    {
      name: '删除作业表',
      commands: [
        'DELETE FROM "JOBQUEUE"'
      ]
    },
    {
      name: '删除作业日志表',
      commands: [
        'DELETE FROM LOGJOBACTION'
      ]
    },
    {
      name: '删除设备日志表',
      commands: ['DELETE FROM LOGEQUACTION']
    },
    {
      name: '删除皮带秤数据表',
      commands: ['DELETE FROM COMJOBQUANTITY']
    }
  ]
}
export default {
  name: "panel-reset",
  data() {
    return {
      loading: false,
      appsettings,
      logs: [],
    };
  },
  methods: {
    getAppSettings() {
      try {
        const remote = require('electron').remote
        const fs = require('fs')
        let filepath
        if (remote.process.env.WEBPACK_DEV_SERVER) {
          filepath = '/static/appsettings.json'
        } else {
          filepath = path.join(remote.app.getAppPath(), '../../static/appsettings.json')
        }
        if (!fs.existsSync(filepath)) {
          alert('Appsettings file not exist!')
          fs.mkdirSync(path.dirname(filepath))
          fs.writeFileSync(filepath, JSON.stringify(appsettings, null, 1))
        } else {
          fetch(filepath)
          .then(res => res.json())
          .then(data => {
            appsettings = data
            this.$forceUpdate()
          })
        }
      } catch (err) {
        alert(err.message)
      }
    },
    handleClick(item) {
      this.executeCommands(item.commands)
    },
    async executeCommands(commands) {
      if (!commands || commands.length == 0) {
        return;
      }
      this.loading = true;
      const startTime = moment()
      this.logs = [];
      let conn;
      try {
        conn = await oracle.connect();
        this.log("建立数据库连接");
        let result;
        for (let i = 0; i < commands.length; i++) {
          result = await conn.execute(commands[i]);
          this.log("执行" + commands[i] + " 作用行数: " + result.rowsAffected);
        }
        conn.commit()
        const endTime = moment()
        this.log("执行完毕, 用时" + (endTime - startTime) + '毫秒.');
      } catch (err) {
        this.log(err.message);
      } finally {
        conn.close();
        this.log("关闭数据库连接.");
        this.loading = false;
      }
    },
    // 添加日志
    log(string) {
      this.logs.push({
        id: moment().millisecond(),
        time: moment().format("HH:mm:ss"),
        message: string,
      });
      this.$nextTick(() => {
        const elem = this.$refs.Message
        elem.scrollTop = elem.scrollHeight
      })
    },
  },
  mounted() {
    this.getAppSettings()
  },
};
</script>

<style scoped>
.list-row {
  padding-left: 20px;
  padding-right: 20px;
}
.list-col {
  height: 60px;
  display: flex;
  align-items: center;
  display: flex;
  justify-content: left;
}
.center {
  justify-content: center;
}
.zebra {
  background: #efefef;
}
.message-box {
  margin: 20px 10px 0 10px;
  background: #000;
  height: 220px;
  overflow-x: hidden;
  overflow-y: auto;
}
.message-line {
  height: 20px;
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #0F0;
}
.message-time {
  width: 120px;
}
</style>