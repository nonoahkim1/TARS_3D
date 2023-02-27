const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
let canvasWidth, canvasHeight;
let pxScale = window.devicePixelRatio;

const container = document.getElementById('container');
let camera, scene, renderer, controls;
let water, model;

function setup() {
  // full browser canvas
  width = window.innerWidth;
  height = window.innerHeight;

  // set the CSS display size
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';

  canvas.width = width * pxScale;
  canvas.height = height * pxScale;

  // normalize the coordinate system
  context.scale(pxScale, pxScale);
}


setup();
init();

setTimeout(animate, 1000);

function init() {
  scene = new THREE.Scene();

  let width = window.innerWidth;
  let height = window.innerHeight;

  camera = new THREE.PerspectiveCamera(80, width/height, 1, 25000);
	camera.position.set(30, 30, 100);
  scene.add(camera);

  light = new THREE.DirectionalLight(0xfffffff, 1); // color, intensity
  light.position.set(1, 1, 1); // location x, y, z
  scene.add(light);

  renderer = new THREE.WebGLRenderer({alpha: 1, antialias: true});
  renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize(width, height);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.setClearColor( 0x000000, 0 );

  container.appendChild(renderer.domElement);



  // Water
  const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

  water = new THREE.Water(waterGeometry, {
			textureWidth: 512,
			textureHeight: 512,
			waterNormals: new THREE.TextureLoader().load('textures/waternormals.jpg', function(texture) {

				texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

			} ),
			waterColor: 0x001e0f,
			distortionScale: 3,
		}
	);

  water.rotation.x = - Math.PI / 2;

	scene.add(water);

  let loader = new THREE.GLTFLoader();

  // load a glTF resource
  loader.load("tars.gltf", function (gltf) {
    gltf.scene.scale.multiplyScalar(10);
    model = gltf.scene;
    scene.add(model);

    model.animations; // Array<THREE.AnimationClip>
    model.scene; // THREE.Scene
    model.scenes; // Array<THREE.Scene>
    model.cameras; // Array<THREE.Camera>
    model.asset; // Object
  });

	//

	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.maxPolarAngle = Math.PI * 0.5;
	controls.target.set(0, 20, 0);
	controls.update();

  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

  setup();

}

function animate() {

	requestAnimationFrame( animate );
	render();

}

function render() {

	const time = performance.now() * 0.001;
	model.position.z = Math.sin(time) * 50;
	model.position.x = Math.sin(time) * 10;
	water.material.uniforms['time'].value += 1/ 60;

	renderer.render(scene, camera);

}
