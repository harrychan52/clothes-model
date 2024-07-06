<template>
  <div id="container"></div>
</template>

<script setup lang="ts">
// import ModelObj from "../assets/FinalBaseMesh.obj";
import { onMounted, onUnmounted } from "vue";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

let camera: THREE.PerspectiveCamera,
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer;
let controls: OrbitControls;

onMounted(() => {
  init();
  animate();
});

onUnmounted(() => {
  if (renderer) {
    renderer.dispose();
  }
});

function init() {
  const container = document.getElementById("container")!;

  // 创建场景
  scene = new THREE.Scene();

  // 设置相机
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  //调整相机高度 45°俯视角
  camera.position.y = 10;

  // 设置渲染器
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  scene.background = new THREE.Color(0xffc0cb);

  // 添加光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  // 添加点光源
  const pointLight = new THREE.PointLight(0xffffff, 1, 100); // 颜色，强度，距离
  pointLight.position.set(10, 10, 10); // 设置光源位置
  scene.add(pointLight);

  // 添加平行光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(0, 1, 0); // 设置光源方向
  scene.add(directionalLight);

  // 加载.obj模型
  const loader = new OBJLoader();

  // 加载人物模型
  // loader.load("/src/assets/FinalBaseMesh.obj", (object) => {
  loader.load("/src/assets/male.obj", (object) => {
    // scene.add(object);
    adjustColorToObject(object);
    adjustCameraToObject(object);
  });

  // 加载衣物模型
  const clothesModels = [
    "/src/assets/shirt.blend",
    "/src/assets/pant.obj",
    "/src/assets/suit.obj",
  ];
  clothesModels.forEach((modelPath) => {
    loader.load(modelPath, (object) => {
      // scene.add(object);
      adjustCameraToObject(object, true);
      adjustColorToObject(object, true);
    });
  });

  // 设置控制器
  controls = new OrbitControls(camera, renderer.domElement);
}
const adjustColorToObject = (object, isClothe = false) => {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      // Check if the material has vertex colors
      if (child.material.vertexColors !== undefined) {
        child.material.color.setRGB(1, 1, 1); // 设置为白色，保持原本的颜色
        child.material.vertexColors = THREE.NoColors; // 禁用顶点颜色
      }
    }
  });
  scene.add(object);
};

function adjustCameraToObject(object, isClothe = false) {
  if (isClothe) {
    const targetPoint = new THREE.Vector3(0, 1, 0);
    // 设置衣服的朝向
    object.lookAt(targetPoint);
    // 衣服旋转
    object.rotation.z = Math.PI;
    object.scale.set(0.08, 0.08, 0.08);
    object.position.z = -0.5;
  } else {
    // object.scale.set(0.9999, 0.9999, 0.9999);
  }
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
  controls.update(); // 只有在使用OrbitControls时才需要
  renderer.render(scene, camera);
}
</script>

<style lang="scss" scoped>
#container {
  width: 100%;
  height: 100vh;
  display: block;
}
</style>
