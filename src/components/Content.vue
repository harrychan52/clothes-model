<template>
  <div>
    <Menu
      :color="color"
      @color-change="colorChange"
      :scale="scale"
      @scale-change="scaleChange"
    />
  </div>
</template>

<script setup lang="ts">
// import ModelObj from "../assets/FinalBaseMesh.obj";
import { onMounted, onUnmounted, ref } from "vue";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Reflector } from "three/addons/objects/Reflector.js";
import Menu from "./Menu.vue";

let controls: OrbitControls;

const color = ref();
const scale = ref(5);

const colorChange = (val) => {
  gltfReload(val, scale);
};
const scaleChange = (val) => {
  scale.value = val;
  gltfReload(color, scale);
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
// 设置渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container!.appendChild(renderer.domElement);

controls = new OrbitControls(camera, renderer.domElement);

// 设置前光源
const directionLight = new THREE.DirectionalLight(0xffffff, 4.5);
directionLight.position.set(0, 10, 100);
scene.add(directionLight);
// 辅组件，用于显示光源位置
// scene.add(new THREE.DirectionalLightHelper(directionLight));

// 设置后光源
const directionBackLight = new THREE.DirectionalLight(0xffffff, 4.5);
directionBackLight.position.set(0, 10, -100);
scene.add(directionBackLight);
// 辅组件，用于显示光源位置
// scene.add(new THREE.DirectionalLightHelper(directionBackLight));

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

let currentGltfScene = null; // 用于追踪当前场景中的模型
const gltfReload = (color = undefined, scale) => {
  console.log(scale.value);
  
  // 如果场景中已有模型，先移除
  if (currentGltfScene) {
    scene.remove(currentGltfScene);
  }

  gltfLoader.load(
    "/src/assets/t-shirt.glb",
    (gltf) => {
      const gltfScene = gltf.scene;
      gltfScene.scale.set(scale.value, scale.value, scale.value);
      // 根据缩放调整位置，确保模型居中或处于预期位置
      gltfScene.position.set(0, -7.7 * (scale.value / 5), 0.18);

      if (color) {
        gltfScene.traverse((child) => {
          // 检查子对象是否是Mesh
          if (child instanceof THREE.Mesh) {
            // 获取材质
            const material = child.material;
            // 修改材质的颜色
            material.color.set(new THREE.Color(color));
          }
        });
      }

      scene.add(gltfScene);
      currentGltfScene = gltfScene; // 更新当前模型引用
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );
};
gltfReload(undefined, scale);

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
