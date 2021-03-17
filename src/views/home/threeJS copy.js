    import * as THREE from 'three';
    import Ia from './thinkia'

    import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
    import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
    import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
    import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
    import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
    import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
    
    // var tt = null;
    var selectedObjects = [];
    var camera, controls, scene, render, composer, effectFXAA, mouse, raycaster, vector3,
      dirLight, outlinePass, renderPass, container, buffers, canvas;
    var flag = true;
    var selectFlag = false;

    var ia = Ia();
    var iaWorld = ia.world;
    ia.colorful.useSimplePoint(3);
    var lineInfo = [], colors = [], positions = [];
    var drawPoint = function () {};

      
    /* eslint-disable */
    export function init(){
        console.log('323232')
        // 包裹楼房和流光div
        container = document.createElement('div');
        container.setAttribute('class','threeDiv')
        container.style.width = '100%';
        container.style.height = '100%';
        let boxThree = document.getElementById('BoxDD');
        boxThree.appendChild(container);
        // document.body.appendChild(container);

        // tt = setTimeout(time,1000);//开始执行
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();

        var width = window.innerWidth, height = window.innerHeight;
        // console.log(width,height)
        var k = width/height;
        camera = new THREE.PerspectiveCamera(30, k, 1, 5000000); // 透视相机
        var cameraPostionStart = new THREE.Vector3(1000, 500, 1000);
        camera.position.set(cameraPostionStart.x, cameraPostionStart.y, cameraPostionStart.z);

        scene = new THREE.Scene(); // 场景
        scene.fog = new THREE.FogExp2(0x000000, 0.00000025); // 场景-雾

        dirLight = new THREE.DirectionalLight('white'); // 平行光
        dirLight.position.set( 500, 500, 500).normalize();
        dirLight.castShadow = true;
        dirLight.shadow.camera.top = 180;
        dirLight.shadow.camera.bottom = -100;
        dirLight.shadow.camera.left = -120;
        dirLight.shadow.camera.right = 120;
        scene.add(dirLight);
        var point = new THREE.PointLight(0x444444);
        point.position.set(2000, 2000, 2000);
        scene.add(point)
        var point2 = new THREE.PointLight(0xffffff);
        point2.position.set(-2000, -2000, -2000);
        scene.add(point2)
        var point3 = new THREE.PointLight(0xffffff);
        point3.position.set(-2000, 2000, -2000);
        scene.add(point3)
        var point4 = new THREE.PointLight(0x444444);
        point4.position.set(-2000, 2000, 2000);
        scene.add(point4);

        const r = 6371, starsGeometry = [new THREE.BufferGeometry(), new THREE.BufferGeometry()];
        const vertices1 = [];
        const vertices2 = [];
        const vertex = new THREE.Vector3();
        for (let i = 0; i < 500; i++) {
            vertex.x = Math.random() * 2 - 1;
            vertex.y = Math.random() * 2 - 1;
            vertex.z = Math.random() * 2 - 1;
            vertex.multiplyScalar(r);
            vertices1.push(vertex.x, vertex.y, vertex.z);
        }
        for (let i = 0; i < 1500; i++) {
            vertex.x = Math.random() * 2 - 1;
            vertex.y = Math.random() * 2 - 1;
            vertex.z = Math.random() * 2 - 1;
            vertex.multiplyScalar(r);
            vertices2.push( vertex.x, vertex.y, vertex.z );
        }
        starsGeometry[ 0 ].setAttribute('position', new THREE.Float32BufferAttribute(vertices1, 3));
        starsGeometry[ 1 ].setAttribute('position', new THREE.Float32BufferAttribute(vertices2, 3));
        const starsMaterials = [
            new THREE.PointsMaterial( { color: 0x555555, size: 3, sizeAttenuation: false } ),
            new THREE.PointsMaterial( { color: 0x555555, size: 2, sizeAttenuation: false } ),
            new THREE.PointsMaterial( { color: 0x333333, size: 2, sizeAttenuation: false } ),
            new THREE.PointsMaterial( { color: 0x3a3a3a, size: 3, sizeAttenuation: false } ),
            new THREE.PointsMaterial( { color: 0x1a1a1a, size: 2, sizeAttenuation: false } ),
            new THREE.PointsMaterial( { color: 0x1a1a1a, size: 1, sizeAttenuation: false } )
        ];
        for ( let i = 10; i < 300; i ++ ) {
            const stars = new THREE.Points( starsGeometry[ i % 2 ], starsMaterials[ i % 6 ] );
            stars.rotation.x = Math.random() * 6;
            stars.rotation.y = Math.random() * 6;
            stars.rotation.z = Math.random() * 6;
            stars.scale.setScalar( i * 10 );
            stars.matrixAutoUpdate = false;
            stars.updateMatrix();
            scene.add(stars);
        }

        render = new THREE.WebGL1Renderer({
            antialias: true//抗锯齿
        });
        render.setPixelRatio(window.devicePixelRatio);
        render.setSize(window.innerWidth, window.innerHeight); // 设置画布大小
        render.shadowMap.enabled = true;
        document.body.appendChild(render.domElement);// body中插入canvas对象
        container.appendChild(render.domElement);

        canvas = document.createElement('canvas');
        // 流光画布
        canvas.id = 'glcanvas';
        canvas.width = width;
        canvas.height = height;
        // canvas.style.height = '100%';
        // canvas.style.width = '100%';
        canvas.style.position = 'fixed';
        canvas.style.top = '0px';
        canvas.style.left = '0px';
        canvas.style.pointerEvents = 'none';

        container.appendChild(canvas);

        var axesHelper = new THREE.AxesHelper(555);
        scene.add(axesHelper);

        controls = new OrbitControls(camera, render.domElement);
        controls.rotateSpeed = 0.2; //旋转速度
        controls.zoomSpeed = 2.5; //缩放速度
        controls.autoRotateSpeed = 0.8;
        controls.maxDistance = 80000;
        controls.minDistance = 0;


        $(".threeDiv").children().css({"width":"100%","height":"100%"});

        composer = new EffectComposer(render);
        renderPass = new RenderPass(scene, camera);
        outlinePass = new OutlinePass(new THREE.Vector2(width, height), scene, camera);
        effectFXAA = new ShaderPass(FXAAShader);

        composer.addPass(renderPass);
        composer.addPass(outlinePass);
        effectFXAA.uniforms['resolution'].value.set(1 / width, 1 / height);
        composer.addPass(effectFXAA);

        render.domElement.addEventListener('pointermove', onPointerMove, false);
        window.addEventListener('click', onPointerClick, false);

        window.addEventListener('dblclick', function () {
            flag = true;
            Fadeout();
            // pauseVid();
            outlinePass.selectedObjects = [];
        });
        window.addEventListener('contextmenu', function () {
            // Fadein();
        });
        window.addEventListener('resize', onWindowResize, false);


        var loaderObj = new OBJLoader();
             var mat4 = new THREE.MeshPhysicalMaterial({
                 color: 'green'
             });
             loaderObj.load('/static/modelVanKe/fxt/fxt.obj', function (object) {
                 object.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                        // if(child.name == 'Shape003'){
                             child.material = mat4;
                             child.castShadow = true;
                             child.receiveShadow = true;
                         // }
                     }
                });
                 object.position.y = -150;
                 object.scale.set(3.5, 3.5, 3.5);
               scene.add(object);
             }, function (xhr) {
                 if (xhr.lengthComputable) {
                     var percentComplete = xhr.loaded / xhr.total * 100;
                     console.log(Math.round(percentComplete, 2) + '% downloaded');
                 }
            });
        
        loaderObj.load('/static/modelVanKe/light/line3.obj', function (object) {
            object.scale.set(10, 10, 10); // 调整模型比例大小
            for (let i = 0; i < object.children.length; i++) {
                lineInfo[i] = {}

                lineInfo[i].times = 0
                lineInfo[i].colors = []
                lineInfo[i].positions = []

                lineInfo[i].pointsMod = []
                if (object.children[i].name.includes('xi')) {
                    lineInfo[i].name = 'xi'
                    lineInfo[i].size = 2
                    lineInfo[i].color = [1.0, 0.549, 0.188, 1]

                } else if (object.children[i].name.includes('zhong')) {
                    lineInfo[i].name = 'zhong'
                    lineInfo[i].size = 4
                    lineInfo[i].color = [0.266, 0.764, 1.0, 1]
                } else if (object.children[i].name.includes('cu')) {
                    lineInfo[i].name = 'cu'
                    lineInfo[i].size = 8
                    lineInfo[i].color = [0.392, 1.0, 0.96, 1]
                }

                let vec3 = [];
                let array = object.children[i].geometry.attributes.position.array;
                let length = object.children[i].geometry.attributes.position.array.length / 3;

                for (let j = 0; j < length; j++) {
                    //改流光粒子位置 (流光盘大小)
                    vec3.push(new THREE.Vector3(array[3 * j]*10, array[3 * j + 1]*10, array[3 * j + 2]*10))
                }
                let curve = new THREE.CatmullRomCurve3(vec3);
                let points = curve.getPoints(100);

                for (let k = 0; k < points.length - 1; k++) {
                    lineInfo[i].pointsMod.push(points[k])
                    let n;
                    let disTance = points[k].distanceTo(points[k + 1]);
                    if (disTance > 0.1) {
                        n = Math.floor(disTance)  //调长短
                        for (let m = 0; m < n; m++) {
                            let x = (points[k + 1].x - points[k].x) * m / n + points[k].x
                            let y = (points[k + 1].y - points[k].y) * m / n + points[k].y
                            let z = (points[k + 1].z - points[k].z) * m / n + points[k].z
                            lineInfo[i].pointsMod.push(new THREE.Vector3(x, y, z))
                        }
                    }
                }
                lineInfo[i].maxTimes = lineInfo[i].pointsMod.length
            }
            iaWorld.initIaWorld(false);
            // 开启混合，透明模式
            iaWorld.blend2opacity()

            drawPoint = function () {
                for (let i = 0; i < lineInfo.length; i++) {
                    lineInfo[i].times += 3
                    lineInfo[i].colors.push(lineInfo[i].color[0], lineInfo[i].color[1], lineInfo[i].color[2], lineInfo[i].color[3])
                    lineInfo[i].colors.push(lineInfo[i].color[0], lineInfo[i].color[1], lineInfo[i].color[2], lineInfo[i].color[3])
                    lineInfo[i].colors.push(lineInfo[i].color[0], lineInfo[i].color[1], lineInfo[i].color[2], lineInfo[i].color[3])

                    lineInfo[i].positions.push(lineInfo[i].pointsMod[lineInfo[i].times].x, lineInfo[i].pointsMod[lineInfo[i].times].y, lineInfo[i].pointsMod[lineInfo[i].times].z)
                    lineInfo[i].positions.push(lineInfo[i].pointsMod[lineInfo[i].times + 1].x, lineInfo[i].pointsMod[lineInfo[i].times + 1].y, lineInfo[i].pointsMod[lineInfo[i].times + 1].z)
                    lineInfo[i].positions.push(lineInfo[i].pointsMod[lineInfo[i].times + 2].x, lineInfo[i].pointsMod[lineInfo[i].times + 2].y, lineInfo[i].pointsMod[lineInfo[i].times + 2].z)
                  // 衰减效果
                    for (let j = 1; j < lineInfo[i].times; j++) {
                        lineInfo[i].colors[j * 4 - 1] -= 0.02
                    }

                    // 提高性能
                for (let ip = 0; ip < lineInfo[i].positions.length / 3; ip++) {
                    if (lineInfo[i].colors[ip * 4 + 3] > 0) {
                        positions[positions.length] = lineInfo[i].positions[ip * 3]
                        positions[positions.length] = lineInfo[i].positions[ip * 3 + 1]
                        positions[positions.length] = lineInfo[i].positions[ip * 3 + 2]

                        colors[colors.length] = lineInfo[i].colors[ip * 4]
                        colors[colors.length] = lineInfo[i].colors[ip * 4 + 1]
                        colors[colors.length] = lineInfo[i].colors[ip * 4 + 2]
                        colors[colors.length] = lineInfo[i].colors[ip * 4 + 3]
                    }
                }
                if (lineInfo[i].times > lineInfo[i].maxTimes - 10) {
                    lineInfo[i].times = 0
                    lineInfo[i].colors = []
                    lineInfo[i].positions = []
                }
                }
                if (buffers) {
                    iaWorld.gl.deleteBuffer(buffers.position)
                    iaWorld.gl.deleteBuffer(buffers.color)
                    buffers.position = null
                    buffers.color = null
                }
                buffers = iaWorld.buffer.positionBuffer.initBuffer(positions, colors);
                iaWorld.helloIaWorld(buffers, false);
                iaWorld.drawPoints(2)

                positions = []
                colors = []
            }
            scene.add(object);
        })
    }

    function tweenAnimate(positionA, positionB) {
        new TWEEN.Tween(positionA).to(positionB, 1800).onUpdate(function (pos){
            controls.enabled = false;
        }).onComplete(function() {
            controls.enabled = true;
            camera.lookAt(vector3)
        }).easing(TWEEN.Easing.Cubic.InOut).start();
    }
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        render.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
        effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
    }
    function onPointerMove(event) {
        // flag = false;
        if (event.isPrimary === false) return;
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        checkIntersection();
    }
    function checkIntersection() {
        var intersects = raycaster.intersectObject(scene,true);
        if (intersects.length > 0) {
            var selectedObject = intersects[0].object;
            addSelectedObject(selectedObject);
            outlinePass.selectedObjects = selectedObjects;
        } else {
            // outlinePass.selectedObjects = [];
        }
    }
    function addSelectedObject(object) {
        selectedObjects = [];
        selectedObjects.push(object);
    }
    // function time() {
    //     clearTimeout(t);//清除定时器
    //     var dt = new Date();
    //     var y=dt.getYear()+1900;
    //     var mm=dt.getMonth()+1;
    //     var d=dt.getDate();
    //     var weekday=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
    //     var day=dt.getDay();
    //     var h=dt.getHours();
    //     var m=dt.getMinutes();
    //     var s=dt.getSeconds();
    //     if(h<10){h="0"+h;}
    //     if(m<10){m="0"+m;}
    //     if(s<10){s="0"+s;}
    //     // document.getElementById("time").innerHTML = y+"年"+mm+"月"+d+"日"+weekday[day]+" "+h+":"+m+":"+s+"";
    //     t = setTimeout(time,1000); //设定定时器，循环执行
    // }
    // function Fadein(){
    //     $("#div1").slideDown("slow"); //滑入
    //     $("#charImg").slideDown("slow");
    // }
    // function Fadeout(){
    //     $("#div1").slideUp("slow"); //滑出
    //     $("#charImg").slideUp("slow");
    // }
    function onPointerClick(event){
        flag = false;
        if (event.isPrimary === false) return;
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        // checkIntersectionClick();
    }
    function checkIntersectionClick(){
        if(!selectFlag){
            var notSelected = [];
            var intersects = raycaster.intersectObject(scene,true);
            if (intersects.length > 0) {
                var selectedObject = intersects[0].object;
                var objs = scene.children;
                $("#btnSelect").show();
                for (var l = 0; l < objs.length; l++) {
                    if(objs[l].type == 'Group'){
                        for (var i = 0; i < objs[l].children.length; i++) {
                            if(selectedObject.name != objs[l].children[i].name){
                                notSelected.push(objs[l].children[i]);
                                objs[l].children[i].visible = false;
                            }else {
                                objs[l].children[i].geometry.computeBoundingBox();
                                vector3 = objs[l].children[i].geometry.boundingBox.getCenter(new THREE.Vector3());
                                // console.log(objs[l].children[i].geometry.boundingBox.getCenter(new THREE.Vector3()))
                                if(vector3.y>0){
                                    if(vector3.z<0){
                                        if(vector3.x>0){
                                            tweenAnimate(camera.position, new THREE.Vector3(vector3.x*2, vector3.y*6,
                                                -vector3.z*70))
                                        }else if(vector3.x<0){
                                            tweenAnimate(camera.position, new THREE.Vector3(-vector3.x*2, -vector3.y*3,
                                                -vector3.z*90));
                                        }
                                    }else if(vector3.z>0){
                                        if(vector3.x>0){
                                            if(vector3.x>10){
                                                tweenAnimate(camera.position, new THREE.Vector3(vector3.x*30, vector3.y*5,
                                                    vector3.z+1200));
                                            }else {
                                                tweenAnimate(camera.position, new THREE.Vector3(vector3.x*5, vector3.y*5,
                                                    vector3.z+1200));
                                            }
                                        }else if(vector3.x<0){
                                            tweenAnimate(camera.position, new THREE.Vector3(-vector3.x*30, vector3.y*5,
                                                vector3.z+1200));
                                        }
                                    }
                                }else if(vector3.x=vector3.y=vector3.z == 0){
                                    tweenAnimate(camera.position, new THREE.Vector3(1500, 800,
                                        1800));
                                }
                                camera.updateProjectionMatrix();
                            }
                        }
                    }
                }
                selectFlag = true;
            } else {

            }
        }

    }
    export function animate() {
      // console.log('旋转了')
        controls.autoRotate = true;
        if(!flag) {controls.autoRotate = false}
        TWEEN.update();
        raycaster.setFromCamera(mouse, camera);
        requestAnimationFrame(animate);
        rendering();
    }
    function rendering() {
        const delta = new THREE.Clock().getDelta();
        controls.update(delta);
        composer.render(delta);
        for (let i = 0; i < ia.view.mat4.length; i++) {
            ia.view.mat4[i] = camera.matrixWorldInverse.elements[i];
            ia.eyes.mat4[i] = camera.projectionMatrix.elements[i];
        }
        drawPoint();
    }

    // init()
    // animate()