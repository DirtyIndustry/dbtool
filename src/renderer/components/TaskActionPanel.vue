<template>
  <div>
    <div class="server-row">
      <el-radio-group v-model="selectedServer">
        <el-radio
          v-for="server in servers"
          :key="server.name"
          :label="server.url"
          >{{ server.name }}</el-radio
        >
      </el-radio-group>
      <el-button size="small" :disabled="loading" @click="handleRefresh">刷新</el-button>
    </div>
    <el-select v-model="selectedJobId" placeholder="请选择" @change="handleJobChange">
      <el-option
        v-for="job in jobList"
        :key="job.ID"
        :label="job.JOBCODE"
        :value="job.ID"
      ></el-option>
    </el-select>
    <div class="job-info">
      <div class="job-info-row">
        <div class="job-info-title">作业ID:</div>
        <div v-if="selectedJob">{{ selectedJob.ID }}</div>
      </div>
      <div class="job-info-row">
        <div class="job-info-title">作业编码:</div>
        <div class="job-info-content" v-if="selectedJob">
          {{ selectedJob.JOBCODE }}
        </div>
        <div class="job-info-title">创建时间:</div>
        <div v-if="selectedJob && selectedJob.CreateTime">
          {{ moment(selectedJob.CreateTime).format("YYYY-MM-DD HH:mm:ss") }}
        </div>
      </div>
      <div class="job-info-row"></div>
      <div class="job-info-row">
        <div class="job-info-title">状态:</div>
        <div class="job-info-content" v-if="selectedJob">
          {{ selectedJob.STATUS }}
        </div>
        <div class="job-info-title">运行:</div>
        <div class="job-info-content" v-if="selectedJob">
          {{ selectedJob.RUNSTATUS }}
        </div>
        <div class="job-info-title">给料:</div>
        <div class="job-info-content" v-if="selectedJob">
          {{ selectedJob.FEEDSTATUS }}
        </div>
      </div>
      <div class="job-info-row">
        <div class="job-info-title">首对位:</div>
        <div class="job-info-content" v-if="selectedJob">
          {{ selectedJob.POSSTARTSTATUS }}
        </div>
        <div class="job-info-title">尾对位:</div>
        <div class="job-info-content" v-if="selectedJob">
          {{ selectedJob.POSENDSTATUS }}
        </div>
        <div class="job-info-title">故障:</div>
        <div class="job-info-content" v-if="selectedJob">
          {{ selectedJob.FAULTSTATUS }}
        </div>
      </div>
    </div>
    <div class="button-container">
      <el-button
        class="action-button"
        size="small"
        v-for="(action, index) in actions"
        :key="index"
        :disabled="loading || !selectedJob"
        @click="handleActionClick(action.value)"
        >{{ action.name }}</el-button
      >
    </div>
  </div>
</template>

<script>
import oracle from "@/utils/oracle.js";
import moment from "moment";

export default {
  name: "task-action-panel",
  data() {
    return {
      loading: false,
      // 作业列表
      jobList: [],
      // 选择的作业
      selectedJobId: null,
      selectedJob: null,
      servers: [
        { name: "本地", url: "http://localhost:9600/" },
        { name: "测试服", url: "http://192.168.2.43:80/" },
      ],
      selectedServer: "http://192.168.2.43:80/",
      actions: [
        { name: "启动", value: 0 },
        { name: "对位", value: 1 },
        { name: "合流", value: 2 },
        { name: "停止启动", value: 3 },
        { name: "急停", value: 4 },
        { name: "给料", value: 5 },
        { name: "停料", value: 6 },
        { name: "顺停", value: 7 },
        { name: "继续", value: 8 },
        { name: "删除", value: 9 },
        { name: "结束", value: 10 },
      ],
      urls: {
        action: "JobQueues/JobQueue/JobBtns",
      },
    };
  },
  methods: {
    moment,
    // 查询数据库 获取作业信息
    async getJobQueues() {
      this.loading = true;
      const list = await oracle.query("SELECT * FROM JOBQUEUE");
      this.jobList = list;
      this.loading = false;
      this.handleJobChange()
    },
    handleRefresh() {
      this.getJobQueues()
    },
    handleJobChange() {
      this.selectedJob = this.jobList.find(x => x.ID === this.selectedJobId)
    },
    handleActionClick(action) {
      const url = this.selectedServer + this.urls.action;
      const params = {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          JobId: this.selectedJob.ID,
          BtnType: action,
        }),
      };
      this.loading = true
      fetch(url, params)
        .then((res) => {
          this.loading = false
          return res.json()
        })
        .then((data) => {
          this.$alert("服务器返回信息: " + data.Msg, "完成", {
            confirmButtonText: "确定",
          });
          this.getJobQueues()
        })
    },
  },
  mounted() {
    this.getJobQueues();
  },
};
</script>

<style scoped>
.server-row {
  height: 40px;
}
.job-info {
  font-size: 14px;
}
.job-info-row {
  height: 24px;
  display: flex;
  align-items: center;
}
.job-info-title {
  width: 80px;
}
.job-info-content {
  margin-right: 20px;
}
.button-container {
  display: flex;
  flex-wrap: wrap;
}
.action-button {
  margin: 5px 0;
}
</style>