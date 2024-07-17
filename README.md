# clothes-model

## 项目主体使用语言以及项目大体框架说明

项目为纯前端 3D 可视化项目，项目使用 vue3 作为前端框架，使用 vite 作为构建工具，使用 three.js 作为 3D 渲染引擎。大体框架为 vite + vue3 + three.js，文件结构为 vite 项目结构，包含 src、public、node_modules 等文件夹。

## 项目主要功能、AI 点以及实现过程

项目主要功能为 3D 服装模拟试穿，用户可以预览预设的模特和衣服模型，环境中包含两面垂直的镜子可以使得模型正面、侧面、背面全面展示，右上角菜单包含颜色选择器和放大缩小按钮，可以改变衣服颜色和衣服的大小，鼠标拖动模型可以改变相机的角度预览不同角度下的模型。  
AI 点为编程开发过程借助 AI 大模型问答以及编辑器中使用 AI 代码补全的方式开发。  
实现过程为使用 vite + vue3 + three.js 搭建项目框架，通过 TurboSquid 或 Sketchfab 下载 3D 模型，人物模型为 obj 文件，衣服模型为 gltf 文件，文件在/src/assets 目录下，使用 three.js 加载模型，通过 three.js 的材质和贴图实现衣服颜色的改变，通过 three.js 的缩放实现衣服大小的改变，通过 three.js 的相机控制实现模型的旋转，菜单代码在/src/components/Menu.vue，3d 渲染的代码在/src/components/Content.vue。

## 项目构建方案，运行环境

环境要求：node.js 16+

git clone https://gitlab-compition.valsun.cn/chendehua/clothes-model.git  
cd clothes-model  
npm install  
npm run dev
