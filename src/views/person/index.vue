<!--
 描述: 首页
 作者: shixiaolei
 日期: 2021-02-3
-->
<template>
  <div class="home-container">
    <!-- <div class="operation">
      <span>隐藏图表</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <span>复位</span>
    </div> -->
    <div class="wrap" ref="editor">
      <div class="top">
        <div class="top-button1" @click="goMap">监控地图</div>
        <div class="top-button2">人员地图</div>
      </div>
      <div class="personLeft" >

      </div>
    </div>
  </div>
</template>
<script>
import { screenSize } from '@/assets/js/utils'
// import * as d3 from 'd3';
export default {
  name: 'Home',
  components: {},
  data() {return {
    threeVisiable:true,
  }
  },
  created() {
  },
  mounted() {
    screenSize(this.$refs.editor);
  },
  methods: {
    goMap(){
      this.$router.push('/home')
    }
  },
}
</script>

<style lang="scss" scoped>
.home-container {
	position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  .operation{
    position: fixed;
    top: 50px;
    left: 100px;
    font-size: 15px;
    color: white;
    z-index: 200000;
  }
  .wrap {
    transform-origin: 0px 0px 0px;
    background: url(../../assets/img/bj.jpg) no-repeat;
    background-size: contain;
    background-position: 50% 0;
    background-color: rgb(0, 0, 0);
    min-width: auto;
    width: 1920px;
    min-height: auto;
    height: 1080px;
    overflow: auto;
    #BoxDD{
      position:absolute;
      // top: 80px;
      display: flex;
      width: 100%; 
      height: 100%;
      overflow: auto;
    }
    .top {
      position: absolute;
      left: 0; 
      top: 0; 
      z-index: 1000;
      width: 100%; 
      height: 80px; 
      background-color: transparent; 
      background: url(../../assets/navBar.png) no-repeat center; 
      background-size:60% 70%;
      // background-position: 65% 0;
      border: none; 
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      font-size: 20px;
      &-button1{
        margin-right: 30px;
      }
      &-button2{
        margin-left: 30px;
      }
    }
    .personLeft{
      left: 50px;
      top: 110px;
      position: absolute;
      width: 500px;
      height: 970px;
      background: seagreen;
    }
  }
}	
</style>
