import Vue from 'vue'

import App from './App'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false

Vue.use(ElementUI)

const store = Vue.observable({settings: {
  version: 1.2,
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
  ],
  Servers: [
    { name: "本地", url: "http://localhost:9600/" },
    { name: "测试服", url: "http://192.168.2.43:80/" },
  ],
  Urls: {
    taskaction: "JobQueues/JobQueue/JobBtns",
    equipstatus: "JobQueues/JobQueue/ResJobStatus",
    createtask: "JobQueues/JobQueue/CreateJob",
    cartdata: "JobQueues/JobQueue/GetCartCurrData?CartCode=NO1SR",
  },
  TaskActions: [
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
    { name: "只停", value: 11 },
  ]
}})

Vue.prototype.$store = store

/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>'
}).$mount('#app')
