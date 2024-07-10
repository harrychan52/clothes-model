<template>
  <div>
    <Menu :color="color" @color-change="colorChange" />
  </div>
</template>

<script setup lang="ts">
// import ModelObj from "../assets/FinalBaseMesh.obj";
import { onMounted, onUnmounted, reactive, ref } from "vue";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Reflector } from "three/addons/objects/Reflector.js";
import Menu from "./Menu.vue";

let controls: OrbitControls;

const color = reactive({
  red: 0,
  green: 0,
  blue: 0,
});

const colorChange = (val) => {
  console.log(val);
  color.red = val.red;
  color.green = val.green;
  color.blue = val.blue;
  gltfReload(color);
};

onMounted(() => {
  animate();
});

onUnmounted(() => {
  if (renderer) {
    renderer.dispose();
  }
});

const container = document.getElementById("app");
// 创建场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x999999);
// 设置相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  100
);
camera.position.y = -2;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
container!.appendChild(renderer.domElement);

controls = new OrbitControls(camera, renderer.domElement);

// const mainLight = new THREE.PointLight(0xffffff, 2.5, 250, 0);
// mainLight.position.y = 60;
// scene.add(mainLight);

const greenLight = new THREE.PointLight(0xffffff, 0.5, 1000, 0);
greenLight.position.set(550, 50, 0);
scene.add(greenLight);

const redLight = new THREE.PointLight(0xffffff, 0.5, 1000, 0);
redLight.position.set(-550, 50, 0);
scene.add(redLight);

const blueLight = new THREE.PointLight(0xbbbbfe, 0.5, 1000, 0);
blueLight.position.set(0, 50, 550);
scene.add(blueLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// 地面镜子
// const circleGeometry = new THREE.PlaneGeometry(12, 12);
// const groundMirror = new Reflector(circleGeometry, {
//   clipBias: 0.003,
//   textureWidth: window.innerWidth * window.devicePixelRatio,
//   textureHeight: window.innerHeight * window.devicePixelRatio,
//   color: 0xb5b5b5,
// });
// groundMirror.position.y = -6;
// groundMirror.rotateX(-Math.PI / 2);
// groundMirror.rotateZ(-Math.PI / 4);
// scene.add(groundMirror);

// 创建左边镜子
const geometry = new THREE.PlaneGeometry(20, 20);
const verticalLeftMirror = new Reflector(geometry, {
  clipBias: 0.003,
  textureWidth: window.innerWidth * window.devicePixelRatio,
  textureHeight: window.innerHeight * window.devicePixelRatio,
  color: 0xc1cbcb,
});
verticalLeftMirror.position.y = 2;
verticalLeftMirror.position.z = -8;
verticalLeftMirror.position.x = 6;
verticalLeftMirror.rotation.y = -Math.PI / 4;
scene.add(verticalLeftMirror);

// 创建右边镜子
const verticalRightMirror = new Reflector(geometry, {
  clipBias: 0.003,
  textureWidth: window.innerWidth * window.devicePixelRatio,
  textureHeight: window.innerHeight * window.devicePixelRatio,
  color: 0xc1cbcb,
});
verticalRightMirror.position.y = 2;
verticalRightMirror.position.z = -8;
verticalRightMirror.position.x = -6;
verticalRightMirror.rotation.y = Math.PI / 4;
scene.add(verticalRightMirror);

// 加载人物模型
const loader = new OBJLoader();
loader.load(
  "/src/assets/male.obj",
  (object) => {
    adjustCameraToObject(object);
    scene.add(object);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);
// 加载衣物模型
const gltfLoader = new GLTFLoader();
// const clothesModels = ["/src/assets/t-shirt.glb"];
// clothesModels.forEach((modelPath) => {
// });

const gltfReload = (color = undefined) => {
  gltfLoader.load(
    "/src/assets/t-shirt.glb",
    (gltf) => {
      const gltfScene = gltf.scene;
      gltfScene.scale.set(5, 5, 5);
      gltfScene.position.set(0, -7.7, 0.18);
      if (color) {
        gltfScene.traverse((child) => {
          // 检查子对象是否是Mesh
          if (child instanceof THREE.Mesh) {
            // 获取材质
            const material = child.material;
            // 修改材质的颜色
            material.color.set(
              new THREE.Color(color.red, color.green, color.blue)
            ); // 红色
          }
        });
      }
      scene.add(gltfScene);
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );
};
gltfReload();

// 设置控制器
function adjustCameraToObject(object) {
  // 计算模型的边界框
  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());

  // 计算边界框的最大维度
  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180);
  let cameraZ = Math.abs((maxDim / 4) * Math.tan(fov * 2));
  // 调整相机位置
  cameraZ *= 12; // 为了确保模型完全可见，可以适当增加这个值
  camera.position.z = cameraZ;

  const minZ = box.min.z;
  const cameraToFarEdge = minZ < 0 ? -minZ + cameraZ : cameraZ - minZ;
  camera.far = cameraToFarEdge * 3;
  camera.updateProjectionMatrix();
  // 设置相机以查看模型的中心
  camera.lookAt(center);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  // 只有在使用OrbitControls时才需要
  renderer.render(scene, camera);
}
</script>

<style lang="scss" scoped></style>
