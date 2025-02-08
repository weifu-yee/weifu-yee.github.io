import * as THREE from 'https://threejs.org/build/three.module.js';
import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
import { MTLLoader } from 'https://threejs.org/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'https://threejs.org/examples/jsm/loaders/OBJLoader.js';

// 创建场景
const scene = new THREE.Scene();

// 创建正投影相机
const camera = new THREE.OrthographicCamera(
  window.innerWidth / -2, 
  window.innerWidth / 2, 
  window.innerHeight / 2, 
  window.innerHeight / -2, 
  0.1, 
  1000
);

camera.position.set(-500, 500, 300); // 设置相机位置
camera.lookAt(0, 0, 0); // 将相机指向场景的中心点

// 创建渲染器
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('c') });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff); // 将背景颜色设置为白色

// 加载材质
const mtlLoader = new MTLLoader();
mtlLoader.load(
  'model/3d.mtl',
  function (materials) {
    materials.preload();
    
    // 加载 OBJ 模型
    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load(
      'model/3d.obj',
      function (object) {
        // 将模型添加到场景
        scene.add(object);
        // 在模型成功加载并添加到场景后，修改模型的位置
        object.position.y -= 200; // 将模型往下平移200mm
      }
    );
  }
);

// 添加环境光
const light = new THREE.AmbientLight(0xFFFFFF, 0.5);
scene.add(light);

// 添加单一光源
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
directionalLight.position.set(0, 100, 50); // 设置光源位置
directionalLight.castShadow = true; // 开启阴影
scene.add(directionalLight);

// 设置阴影参数
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// 添加控制器
const controls = new OrbitControls(camera, renderer.domElement);

// 渲染循环
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
