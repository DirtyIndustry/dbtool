<template>
  <div>
    <div class="row">
      <el-select size="small" v-model="selectedIndex" @change="handleSelectChange">
        <el-option v-for="(item, index) in list" :key="index" :value="index" :label="item.name"></el-option>
      </el-select>
    </div>
    <div class="row">
      <template v-if="selectedQuery">
        <div class="row" v-for="(item, index) in selectedQuery.query" :key="'query' + index">
          <div class="row-title">{{item.name}}</div>
          <div class="row-content">
            <el-input size="small" v-model="item.value"></el-input>
          </div>
        </div>
      </template>
      
      <el-button class="submit-button" size="small" @click="executeQuery">执行</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'sql-panel',
  data() {
    return {
      loading: false,
      list: [
        {
          name: '皮带秤数据表',
          sql: `select JOBCODE,EQUNAME,CURRQUANTITY,PUSHTIME from COMJOBQUANTITY t`,
          orderby: 'order by PUSHTIME DESC',
          query: [
            {name: 'JOBCODE', value: null}
          ]
        },
        {
          name: '点表',
          sql: 'select * from COMPOINTINFO t',
          orderby: '',
          query: [
            {name: 'EQUIPMENTTYPE', value: null},
            {name: 'POINTCODE', value: null},
            {name: 'EQUIPMENTCODE', value: null}
          ]
        },
        {
          name: '设备状态表',
          sql: 'select EQUCODE,EQUNAME,RUNSTATUS,ISMATERIAL,ISSTOP,JOBCODE,PATHCODE,WANITEM,WANITEMCODE,SANTONLOCATION,BELTLOCATION,BELTDIRECTION from EQUEPSTATUS t order by EQUCODE',
          orderby: '',
          query: []
        },
        {
          name: '流程路径表',
          sql: 'select PATHCODE,PATHSTART,PATHEND,EQUIPMENTS,BELTS,PATHLENGTH,PATHPOWER,RUNSTATUS,PATHNAME from JOBPATH t',
          orderby: '',
          query: []
        },
        {
          name: '作业表',
          sql: 'select JOBCODE AS 作业号,JOBTYPE AS 作业类型,STATUS AS 作业状态,TIMELENGTH AS 作业时长,PAUSELENGTH AS 暂停时长,JOBQUANTITY AS 计划作业量,BATCHNO AS 批次号,BELTS AS 皮带秤,RUNSTATUS AS 运行状态,POSSTARTSTATUS AS 首设备对位状态,POSENDSTATUS AS 尾设备对位状态,FEEDSTATUS AS 给料状态,FAULTSTATUS AS 故障状态,JOBAMOUNT AS 作业累计量 from JOBQUEUE t',
          orderby: '',
          query: []
        },
        {
          name: '设备日志表',
          sql: 'select JOBCODE,PATHCODE,EQUCODE,EQUNAME,LOGCONTEXT,LOGTIME from LOGEQUACTION t',
          orderby: 'order by LOGTIME',
          query: [
            {name: 'JOBCODE', value: null},
            {name: 'EQUCODE', value: null}
          ]
        },
        {
          name: '作业日志表',
          sql: 'select JOBCODE,PATHCODE,JOBSTATUS,LOGCONTEXT,LOGTIME from LOGJOBACTION t',
          orderby: 'order by LOGTIME',
          query: [
            {name: 'JOBCODE', value: null}
          ]
        }
      ],
      selectedIndex: null,
      selectedQuery: null,
    }
  },
  methods: {
    handleSelectChange() {
      if (this.selectedIndex) {
        this.selectedQuery = this.list[this.selectedIndex]
      }
    },
    executeQuery() {
      const query = this.buildQuery(this.selectedQuery.query)
      console.log(this.selectedQuery.sql + query + ' ' + this.selectedQuery.orderby)
      
    },
    buildQuery(query) {
      let str = " WHERE "
      let count = 0
      for (let i = 0; i < query.length; i++) {
        const item = query[i]
        if (item.value != null && item.value != '') {
          if (count > 0) {
            str += " AND "
          }
          str += item.name + " = '" + item.value + "'"
          count++
        }
      }
      if (count > 0) {
        return str
      } else {
        return ''
      }
    }
  }
}
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
.submit-button {
  margin-left: 10px;
}
</style>