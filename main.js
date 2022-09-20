import * as THREE from 'three';
import vertex from './shader/vertex.glsl';
import fragment from './shader/fragment.glsl';


export default class Sketch {
  constructor() {
    this.container = document.getElementById('container')  
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 30);
    this.camera.position.set(0, 1, 3);
    this.camera.rotation.set(0,0,0)

    this.scene = new THREE.Scene();
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.container});
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.setClearColor(0x101010, 1)
    this.renderer.outputEncoding = THREE.sRGBEncoding
    this.addMesh()
    this.time = 0
    this.mouse = new THREE.Vector2(0,0);
    this.moveCamera();
    this.render();
  }

  moveCamera() {
    this.container.addEventListener('mousemove', (event)=>{
      this.mouse.x = (event.clientX / window.innerWidth) * 2 -1;
      this.mouse.y = -(event.clientY / window.innerHeight) *2 +1;
      console.log(this.mouse)
    })
  }

  render() {
    this.time++
    this.material.uniforms.time.value = this.time*0.001
    //this.mesh.rotation.z += (this.mouse.x/5 - this.mesh.rotation.z)*0.01
    //this.mesh.rotation.x += (this.mouse.y/5 - this.mesh.rotation.x)*0.01
    this.camera.rotation.y += (-this.mouse.x/5 - this.camera.rotation.y)*0.01
    this.camera.rotation.x += (this.mouse.y/5 - this.camera.rotation.x)*0.01
    this.renderer.render(this.scene, this.camera)
    window.requestAnimationFrame(this.render.bind(this))
  }
  addMesh() {
    this.geometry = new THREE.BufferGeometry();
    //this.geometry = new THREE.PlaneBufferGeometry(1, 1, 10, 10)

    let count = 500
    let position = new Float32Array(count * count * 3)
    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        position.set([(i / count - 0.5) * 50, (j / count - 0.5) * 50, 0], 3 * (count * i + j))
      }
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
    this.material = new THREE.ShaderMaterial({
      fragmentShader: fragment,
      vertexShader: vertex,
      uniforms: {
        progress: { type: "f", value: 0 },
        time: { type: "f", value: 0 }
      },
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.mesh = new THREE.Points(this.geometry, this.material);
    this.mesh.rotation.set(Math.PI/2,0,0)
    this.scene.add(this.mesh);
  }
}
new Sketch();