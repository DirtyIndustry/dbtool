import Vue from 'vue'

import App from './App'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.prototype.$settings = {
  version: 1.0,
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

/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>'
}).$mount('#app')
