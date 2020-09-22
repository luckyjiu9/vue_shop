<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 2.为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width:100% ;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
// 1.导入 echarts
import echarts from 'echarts'
import _ from 'lodash'
export default {
  data () {
    return {
      //这是需要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E923F3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },


  created () {

  },
  //3.此时页面上的元素已经被渲染完毕了
  async mounted () {
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
    var myChart = echarts.init(document.getElementById('main'));
    //4.准备数据和配置项
    const result = _.merge(res.data, this.options)
    // 5.展示数据
    myChart.setOption(result);
  },


}
</script>

<style>
</style>