<template>
  <div>
    <div class="row">
      <div class="row-title">VALUE</div>
      <div class="row-content">
        <el-input size="small" v-model="VALUE"></el-input>
      </div>
      <div class="row-title">EQUIPMENTTYPE</div>
      <div class="row-content">
        <el-input size="small" v-model="EQUIPMENTTYPE"></el-input>
      </div>
      <div class="row-title">POINTCODE</div>
      <div class="row-content">
        <el-input size="small" v-model="POINTCODE"></el-input>
      </div>
      <div class="row-title">EQUIPMENTCODE</div>
      <div class="row-content">
        <el-input size="small" v-model="EQUIPMENTCODE"></el-input>
      </div>
    </div>
    <div class="row">
      <el-button size="small" :disabled="loading" @click="handleClick"
        >执行</el-button
      >
    </div>
    <div class="message-box" ref="Message" id="Message">
      <div class="message-line" v-for="(log, index) in logs" :key="index">
        <div class="message-time">{{ log.time }}</div>
        <div class="message-content">{{ log.message }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import oracle from "@/utils/oracle.js";
import moment from "moment";

export default {
  name: "point-table-panel",
  data() {
    return {
      loading: false,
      VALUE: null,
      EQUIPMENTTYPE: null,
      POINTCODE: null,
      EQUIPMENTCODE: null,
      logs: [],
    };
  },
  methods: {
    async executeCommands(commands) {
      if (!commands || commands.length == 0) {
        return;
      }
      this.loading = true;
      const startTime = moment();
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
        conn.commit();
        const endTime = moment();
        this.log("执行完毕, 用时" + (endTime - startTime) + "毫秒.");
      } catch (err) {
        this.log(err.message);
      } finally {
        conn.close();
        this.log("关闭数据库连接.");
        this.loading = false;
      }
    },
    // 重置设备状态表
    async handleClick() {
      if (this.VALUE == null || this.VALUE == "") {
        return;
      }
      let query = " WHERE 1=1";
      if (this.EQUIPMENTTYPE != null && this.EQUIPMENTTYPE != "") {
        query += " AND EQUIPMENTTYPE = '" + this.EQUIPMENTTYPE + "'";
      }
      if (this.POINTCODE != null && this.POINTCODE != "") {
        query += " AND POINTCODE = '" + this.POINTCODE + "'";
      }
      if (this.EQUIPMENTCODE != null && this.EQUIPMENTCODE != "") {
        query += " AND EQUIPMENTCODE = '" + this.EQUIPMENTCODE + "'";
      }
      const commands = [
        "UPDATE COMPOINTINFO SET VALUE = " + this.VALUE + query,
      ];
      this.executeCommands(commands);
    },
    // 添加日志
    log(string) {
      this.logs.push({
        id: moment().millisecond(),
        time: moment().format("HH:mm:ss"),
        message: string,
      });
      this.$nextTick(() => {
        const elem = this.$refs.Message;
        elem.scrollTop = elem.scrollHeight;
      });
    },
  },
};
</script>

<style scoped>
.row {
  height: 40px;
  display: flex;
  align-items: center;
}
.row-title {
  width: 100px;
  font-size: 12px;
}
.row-content {
  width: 120px;
}
.message-box {
  margin: 20px 10px 0 10px;
  background: #000;
  height: 220px;
  overflow-x: hidden;
  overflow-y: auto;
}
.message-line {
  min-height: 20px;
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #0F0;
}
.message-time {
  width: 120px;
}
</style>