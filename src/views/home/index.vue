<!--
 描述: 首页
 作者: shixiaolei
 日期: 2021-02-3
-->
<template>
  <div class="home-container">
    <div class="wrap" ref="editor">
      <div class="top">
        <div class="top-button1">监控地图</div>
        <div class="top-button2">人员地图</div>
      </div>
      <div id="BoxDD" ref="BoxDD">
      </div>
      <!-- 社区报警 -->
      <sinan/>
      <!-- 报警数量 -->
      <alarmNumber/>
      <!-- 视频监控 -->
      <seamless />
      <!-- 智能邀约 -->
      <smartVisite/>
      <!-- 图例 -->
      <lengend/>
      <!-- <pyramid /> -->
    </div>
    
  </div>
</template>
<script>
import { screenSize } from '@/assets/js/utils'
import * as THREE from 'three';
// import Ia from './thinkia'
// import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
// import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
// import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
// import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
    
export default {
  name: 'Home',
  components: {},
  data() {return {
    camera: null,
    scene: null,
    renderer: null,
    mesh: null,
    dirLight:null
  }
  },
  computed: {

  },
  created() {
  },
  mounted() {
    screenSize(this.$refs.editor);
    // const getThreeJs = ()=> import('./threeJS')
    // getThreeJs()
    this.init()
    this.animate()
  },
  methods: {
    init: function () {
      let container = document.getElementById('BoxDD')
      this.camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.01, 10) // 透视相机（投影模式）
      this.camera.position.z = 0.6
      this.scene = new THREE.Scene() //场景允许你在什么地方、摆放什么东西来交给three.js来渲染，这是你放置物体、灯光和摄像机的地方。


      let geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
      let material = new THREE.MeshNormalMaterial()
      this.mesh = new THREE.Mesh(geometry, material) // 网格对象
      // this.scene.add(this.mesh)


      let canvas = document.createElement('canvas');
        // 流光画布
        canvas.id = 'glcanvas';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = 'fixed';
        canvas.style.top = '0px';
        canvas.style.left = '0px';
        canvas.style.pointerEvents = 'none';
      container.appendChild(canvas);


      this.scene.fog = new THREE.FogExp2(0x000000, 0.00000025); // 场景-雾，在相机附近提供清晰的视野，且距离相机越远，雾的浓度随着指数增长越快。
      this.renderer = new THREE.WebGLRenderer({antialias: true}) // 渲染器（antialias - 是否执行抗锯齿。默认为false.）
      this.renderer.setSize(container.clientWidth, container.clientHeight)
      container.appendChild(this.renderer.domElement)
    },
    animate: function () { // 动画
      requestAnimationFrame(this.animate)
      this.mesh.rotation.x += 0.01
      this.mesh.rotation.y += 0.02
      this.renderer.render(this.scene, this.camera)
    }
  }
}
</script>

<style lang="scss" scoped>
.home-container {
	position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
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
      top: 80px;
      display: flex;
      width: 100%; 
      height: 92%;
      overflow: auto;
      // z-index: 10000;
    }
    .top {
      position: absolute;
      left: 0; 
      top: 0; 
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
  }
}	
</style>
