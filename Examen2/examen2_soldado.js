"use strict"
import * as THREE from './libs/three.module.js'
import { OrbitControls } from './libs/controls/OrbitControls.js';
import { GLTFLoader } from './libs/loaders/GLTFLoader.js';

let renderer = null, scene = null, camera = null, orbitControls = null, soldier = null;

let spotLight = null, ambientLight = null;


let idleAction = null;
let mixer = null;
let currentTime = Date.now();

const mapUrl = "images/checker_large.gif";

const SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;

function onError ( err ){ console.error( err ); };

function onProgress( xhr ) {

    if ( xhr.lengthComputable ) {

        const percentComplete = xhr.loaded / xhr.total * 100;
        console.log( xhr.target.responseURL, Math.round( percentComplete, 2 ) + '% downloaded' );
    }
}

async function loadGLTF(gltfModelUrl)
{
    try
    {
        const gltfLoader = new GLTFLoader();

        const result = await gltfLoader.loadAsync(gltfModelUrl);

        soldier = result.scene.children[0] || result.scenes[0]

        soldier.traverse(model =>{
            if(model.isMesh)
                model.castShadow = true
                model.receiveShadow = true
                soldier.mixer = new THREE.AnimationMixer( scene )
                soldier.action = soldier.mixer.clipAction( result.animations[1], soldier ).setDuration( 0.58 )
                mixer = soldier.mixer
                soldier.action.play();           
        });


        soldier.scale.set(0.1,0.1,0.1)
        soldier.rotation.z = Math.PI
        soldier.position.y = -4
        scene.add(soldier)

        

        
             
    }
    catch(err)
    {
        console.error(err);
    }
}

function animate()
{
    const now = Date.now();
    const deltat = now - currentTime;
    currentTime = now;

    if(mixer)
        mixer.update(deltat*0.001);
}

function update() 
{
    requestAnimationFrame(() =>  update());
    
    renderer.render( scene, camera );

    animate();

    orbitControls.update();
}

function createScene(canvas) 
{
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    renderer.setSize(canvas.width, canvas.height);
    
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.set(-30, 15, 40);


    orbitControls = new OrbitControls(camera, renderer.domElement);
        
    spotLight = new THREE.SpotLight (0xffffff, 1.5);
    spotLight.position.set(0, 40, 50);
    spotLight.castShadow = true
    spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH
    spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT
    scene.add(spotLight)

    //SH4D0W----
    spotLight.shadow.mapSize.width = 512; // default
    spotLight.shadow.mapSize.height = 512; // default
    spotLight.shadow.camera.near = 0.5; // default
    spotLight.shadow.camera.far = 500; // default



    ambientLight = new THREE.AmbientLight ( 0xffffff, 0.3);
    scene.add(ambientLight)

    let map = new THREE.TextureLoader().load(mapUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(8, 8);

    //loadGLTF()

    const geometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    const floor = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({map:map, side:THREE.DoubleSide}));

    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -4.02;
    floor.receiveShadow = true;


    scene.add( floor );
}


function main()
{
    const canvas = document.getElementById("webglcanvas");

    createScene(canvas);

    loadGLTF('models/Soldier.glb');

    update();
}

function resize()
{
    const canvas = document.getElementById("webglcanvas");

    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    camera.aspect = canvas.width / canvas.height;

    camera.updateProjectionMatrix();
    renderer.setSize(canvas.width, canvas.height);
}

window.onload = () => {
    main();
    resize(); 
};

window.addEventListener('resize', resize, false);

main();
