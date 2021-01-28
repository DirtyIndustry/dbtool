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
    </div>
    <div class="row">接收设备状态变化接口</div>
    <div class="row">
      <div class="row-title">EquCode</div>
      <div class="row-content">
        <el-input size="small" v-model="equipStatus.EquCode"></el-input>
      </div>
      <div class="row-title">BusinessType</div>
      <div class="row-content">
        <el-select size="small" v-model="equipStatus.BusinessType">
          <el-option
            v-for="(item, index) in BusinessTypes"
            :key="index"
            :value="item.value"
            :label="item.name"
          ></el-option>
        </el-select>
      </div>
      <div class="row-title">PointCode</div>
      <div class="row-content">
        <el-input size="small" v-model="equipStatus.PointCode"></el-input>
      </div>
      <div class="row-title">PointName</div>
      <div class="row-content">
        <el-input size="small" v-model="equipStatus.PointName"></el-input>
      </div>
      <div class="row-title">Value</div>
      <div class="row-content">
        <el-input size="small" v-model="equipStatus.Value"></el-input>
      </div>
    </div>
    <div class="row">
      <el-button
        size="small"
        class="send-button"
        :disabled="
          loading ||
          equipStatus.EquCode == null ||
          equipStatus.BusinessType == null
        "
        @click="sendEquipStatus"
        >发送请求</el-button
      >
    </div>
    <div class="separator"></div>
    <div class="row">创建作业接口</div>
    <div class="row">
      <div class="row-title">materialCode</div>
      <div class="row-content">
        <el-input size="small" v-model="createTask.materialCode"></el-input>
      </div>
      <div class="row-title">batchNo</div>
      <div class="row-content">
        <el-input size="small" v-model="createTask.batchNo"></el-input>
      </div>
      <div class="row-title">type</div>
      <div class="row-content">
        <el-input size="small" v-model="createTask.type"></el-input>
      </div>
      <div class="row-title">startClass</div>
      <div class="row-content">
        <el-input size="small" v-model="createTask.startClass"></el-input>
      </div>
      <div class="row-title">startPoint</div>
      <div class="row-content">
        <el-input size="small" v-model="createTask.startPoint"></el-input>
      </div>
    </div>
    <div class="row">
      <div class="row-title">endClass</div>
      <div class="row-content">
        <el-input size="small" v-model="createTask.endClass"></el-input>
      </div>
      <div class="row-title">endPoint</div>
      <div class="row-content">
        <el-input size="small" v-model="createTask.endPoint"></el-input>
      </div>
      <div class="row-title">path</div>
      <div class="row-content">
        <el-input size="small" v-model="createTask.path"></el-input>
      </div>
      <div class="row-title">jobQuantity</div>
      <div class="row-content">
        <el-input size="small" v-model="createTask.jobQuantity"></el-input>
      </div>
      <el-button
        size="small"
        class="send-button"
        :disabled="loading"
        @click="sendCreateTask"
        >发送请求</el-button
      >
    </div>
    <div class="separator"></div>
    <div class="row">获取大车当前运行数据</div>
    <div class="row">
      <div class="row-title">CartCode</div>
      <div class="row-content">
        <el-input size="small" v-model="cartCode"></el-input>
      </div>
      <el-button
        size="small"
        class="send-button"
        :disabled="loading"
        @click="sendCartData"
        >发送请求</el-button
      >
    </div>
      <el-input class="text-area" type="textarea" :rows="6" resize="none" :value="JSON.stringify(cartData, null, 2)"></el-input>
  </div>
</template>

<script>
export default {
  name: "http-panel",
  data() {
    return {
      loading: false,
      selectedServer: "http://192.168.2.43:80/",
      // 设备状态
      equipStatus: {
        EquCode: null,
        BusinessType: null,
        PointCode: "StartOrStop",
        PointName: "启停",
        Value: 1,
      },
      BusinessTypes: [
        { name: "启停状态", value: "Switch" },
        { name: "故障", value: "Fault" },
        { name: "位置", value: "Location" },
        { name: "方向", value: "Orientation" },
        { name: "重量", value: "Weight" },
      ],
      createTask: {
        materialCode: null,
        batchNo: null,
        type: "1",
        startClass: null,
        startPoint: null,
        endClass: null,
        endPoint: null,
        path: null,
        jobQuantity: 0,
      },
      cartCode: "NO1SR",
      cartData: null,
    };
  },
  computed: {
    servers() {return this.$store.settings.Servers},
    urls() {return this.$store.settings.Urls}
  },
  methods: {
    sendEquipStatus() {
      const url = this.selectedServer + this.urls.equipstatus;
      this.post(url, this.equipStatus);
    },
    sendCreateTask() {
      const url = this.selectedServer + this.urls.createtask;
      this.post(url, this.createTask);
    },
    sendCartData() {
      const url = this.selectedServer + this.urls.cartdata + '?CartCode=' + this.cartCode
      this.loading = true
      fetch(url)
      .then(res => {
        this.loading = false
        return res.json()
      })
      .then(data => {
        this.cartData = data.Data
        this.$alert("服务器返回信息: " + data.Msg, "完成", {
          confirmButtonText: "确定",
        });
      })
    },
    post(url, data) {
      const params = {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json; charset=utf-8",
        },
        body: JSON.stringify(data),
      };
      this.loading = true;
      fetch(url, params)
        .then((res) => {
          this.loading = false;
          return res.json();
        })
        .then((data) => {
          this.$alert("服务器返回信息: " + data.Msg, "完成", {
            confirmButtonText: "确定",
          });
        });
    },
  },
};
</script>

<style scoped>
.server-row {
  height: 40px;
  display: flex;
  align-items: center;
}
.row {
  height: 40px;
  display: flex;
  align-items: center;
}
.row-title {
  width: 80px;
}
.row-content {
  width: 120px;
}
.send-button {
  margin-left: 10px;
}
.text-area {
  margin: 10px 0;
}
.separator {
  width: 100%;
  border-top: 1px solid #efefef;
  margin: 5px;
}
</style>