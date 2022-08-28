import * as THREE from 'three';
import vertex from './shader/vertex.glsl';
import fragment from './shader/fragment.glsl';


export default class Sketch {
  constructor() {

    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
    this.camera.position.set(0,0.5,1);
    this.camera.view.set()

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.physicallyCorrectLights=true;
    this.renderer.setClearColor(0x000000,1)
    this.renderer.outputEncoding = THREE.sRGBEncoding
    document.getElementById('container').appendChild(this.renderer.domElement)
    this.addMesh()
    this.time = 0
    this.render();
  }

  render() {
    this.time++
    this.mesh.rotation.x = 0.00001*this.time
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
        position.set([(i/count-0.5)*50, (j/count-0.5)*50,0 ], 3*(count * i + j))
      }
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
    this.material = new THREE.ShaderMaterial({
      fragmentShader: fragment,
      vertexShader: vertex,
      uniforms: {
        progress: { type: "f", value: 0 }
      },
      transparent: true,
      //side: THREE.DoubleSide
    });
    this.mesh = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.mesh);
  }
}
new Sketch();