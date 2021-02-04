<!--
 描述: 报警数量
 作者: shixiaolei
 日期: 2021-2-4
-->

<template>
  <div class="wrap-container sn-container leftTop2"> 
    <div class="sn-content"> 
      <div class="sn-title">报警数量</div> 
      <div class="sn-body"> 
        <div class="wrap-container"> 
          <div class="pd-main"> 

          </div>  
        </div> 
      </div> 
    </div>   
  </div>
</template>

<script>
export default {
  name: "alarmNumber",
  data() {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.leftTop2 {
  left: 50px; 
  top: 750px;
  position: absolute;

  width: 500px; 
  height: 300px;
  background:url(../../assets/leftTall.png) no-repeat;
  background-size: 100% 100%;
  overflow: visible;
  .pd-main {
    position: absolute;
    height: 100%;
    width: 100%;
  }
}
</style>
