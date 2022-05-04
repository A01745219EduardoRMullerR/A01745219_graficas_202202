// 1. Enable shadow mapping in the renderer. 
// 2. Enable shadows and set shadow parameters for the lights that cast shadows. 
// Both the THREE.DirectionalLight type and the THREE.SpotLight type support shadows. 
// 3. Indicate which geometry objects cast and receive shadows.

"use strict"; 

import * as THREE from '../libs/three.js/three.module.js'
import { OrbitControls } from '../libs/three.js/controls/OrbitControls.js';

let renderer = null, scene = null, camera = null, group = null, objectList = [], orbitControls = null;

let duration = 20000; // ms
let currentTime = Date.now();

let directionalLight = null, spotLight = null, ambientLight = null;


function main()
{
    const canvas = document.getElementById("webglcanvas");

    createScene(canvas);
    
    update();
}

function animate() 
{
    let now = Date.now();
    let deltat = now - currentTime;
    currentTime = now;
    let fract = deltat / duration;
    let angle = Math.PI * 26 * fract;

    for(const object of objectList){ //movimiento
        if(object)
            object.rotation.y += angle / 2;
    }

    for(const object in objectList){
        if(object){
            
        }
    }
}

function update() 
{
    requestAnimationFrame(function() { update(); });
    
    // Render the scene
    renderer.render( scene, camera );

    // Spin the cube for next frame
    animate();

    // Update the camera controller
    orbitControls.update();
}

function createScene(canvas) 
{
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Turn on shadows
    renderer.shadowMap.enabled = true;
    
    // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
    renderer.shadowMap.type = THREE.PCFShadowMap;
    
    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.set(-2, 6, 12);

    orbitControls = new OrbitControls(camera, renderer.domElement);
        
    // Add a directional light to show off the object
    directionalLight = new THREE.DirectionalLight( 0xaaaaaa, 4);

    //Background
    const background_texture = new THREE.TextureLoader().load('Textures/stars_background.jpg')
    scene.background = background_texture

    // Create and add all the lights
    const point_light = new THREE.PointLight(0xFFFFFF, 2, 300)
    scene.add(point_light)

    ambientLight = new THREE.AmbientLight ( 0x444444, 0.8);
    scene.add(ambientLight);
    
    //MERCURY --------------------------------------------------
    let geometry = new THREE.SphereGeometry( 0.2, 64, 32 );
    let texture = new THREE.TextureLoader().load('Textures/mercury.jpg');
    let material = new THREE.MeshStandardMaterial({map:texture})
    let sphere = new THREE.Mesh( geometry, material );
    sphere.position.y = 0
    sphere.position.x = 4
    sphere.castShadow = false
    sphere.receiveShadow = true
    scene.add(sphere)
    objectList.push(sphere)

    //THE SUN ---------------------------------------------------------------------------------
    geometry = new THREE.SphereGeometry( 3.3, 64, 32 );
    texture = new THREE.TextureLoader().load('Textures/sun.jpg');
    material = new THREE.MeshBasicMaterial({map:texture})
    sphere = new THREE.Mesh( geometry, material );
    sphere.castShadow = false
    sphere.receiveShadow = true
    scene.add(sphere)

    //VENUS ---------------------------------------------------------------------------
    geometry = new THREE.SphereGeometry( 0.4, 64, 32 );
    texture = new THREE.TextureLoader().load('Textures/venus.jpg');
    material = new THREE.MeshStandardMaterial({map:texture})
    sphere = new THREE.Mesh( geometry, material );
    sphere.position.y = 0
    sphere.position.x = 5.5
    sphere.castShadow = false
    sphere.receiveShadow = true
    scene.add(sphere)
    objectList.push(sphere)

    //OUR GLORIOUS EARTH --------------------------------------------------------------------
    geometry = new THREE.SphereGeometry( 0.45, 64, 32 );
    texture = new THREE.TextureLoader().load('Textures/earth.jpg');
    material = new THREE.MeshStandardMaterial({map:texture})
    sphere = new THREE.Mesh( geometry, material );
    sphere.position.y = 0
    sphere.position.x = 7
    sphere.castShadow = false
    sphere.receiveShadow = true
    scene.add(sphere)
    objectList.push(sphere)

    //OUR MOON----------------------------------------------------------------------------
    geometry = new THREE.SphereGeometry( 0.065, 64, 32 );
    texture = new THREE.TextureLoader().load('Textures/moon.jpg');
    material = new THREE.MeshStandardMaterial({map:texture})
    sphere = new THREE.Mesh( geometry, material );
    sphere.position.z = 0.86
    sphere.position.x = 7.2
    sphere.castShadow = false
    sphere.receiveShadow = true
    scene.add(sphere)
    objectList.push(sphere)

    //MARS home of the Martian Manhunter---------------------------------------------------------------------------------------
    geometry = new THREE.SphereGeometry( 0.25, 64, 32 );
    texture = new THREE.TextureLoader().load('Textures/mars.jpg');
    material = new THREE.MeshStandardMaterial({map:texture})
    sphere = new THREE.Mesh( geometry, material );
    sphere.position.y = 0
    sphere.position.x = 9
    sphere.castShadow = false
    sphere.receiveShadow = true
    scene.add(sphere)
    objectList.push(sphere)

    //Mars' moons ----------------------------------------------------------------------------------------------------
    for (let i=0;i<=2; i++){
        geometry = new THREE.SphereGeometry( 0.042, 64, 32 );
        texture = new THREE.TextureLoader().load('Textures/moon.jpg');
        material = new THREE.MeshStandardMaterial({map:texture})
        sphere = new THREE.Mesh( geometry, material );
        sphere.position.z = getRndInteger(-1, 1);
        sphere.position.y = getRndInteger(-1, 1)
        sphere.position.x = getRndInteger(8, 10)
        sphere.castShadow = false
        sphere.receiveShadow = true
        scene.add(sphere)
        objectList.push(sphere)
    }

    //JUPITER ----------------------------------------------------------------------------------------------
    geometry = new THREE.SphereGeometry( 1.5, 64, 32 );
    texture = new THREE.TextureLoader().load('Textures/jupiter.jpg');
    material = new THREE.MeshStandardMaterial({map:texture})
    sphere = new THREE.Mesh( geometry, material );
    sphere.position.y = 0
    sphere.position.x = 13
    sphere.castShadow = false
    sphere.receiveShadow = true
    sphere.rotateY(.04)
    scene.add(sphere)
    objectList.push(sphere)

    //Jupiter's moons -----------------------------------------------------------------------------------------------------
    for (let i=0;i<=79; i++){
        let radius = (getRndInteger(40, 80))*.001
        geometry = new THREE.SphereGeometry( radius, 64, 32 );
        texture = new THREE.TextureLoader().load('Textures/moon.jpg');
        material = new THREE.MeshStandardMaterial({map:texture})
        sphere = new THREE.Mesh( geometry, material );
        sphere.position.z = getRndInteger(-3, 3);
        sphere.position.y = getRndInteger(-3, 3)
        sphere.position.x = getRndInteger(11, 15)
        sphere.castShadow = false
        sphere.receiveShadow = true
        scene.add(sphere)
        objectList.push(sphere)
    }

    //SATURN ---------------------------------------------------------------------------------------------------
    geometry = new THREE.SphereGeometry( 1.15, 64, 32 );
    texture = new THREE.TextureLoader().load('Textures/saturn.jpg');
    material = new THREE.MeshStandardMaterial({map:texture})
    sphere = new THREE.Mesh( geometry, material );
    sphere.position.y = 0
    sphere.position.x = 18
    sphere.castShadow = false
    sphere.receiveShadow = true
    sphere.rotateY(.04)
    scene.add(sphere)
    objectList.push(sphere)

    //Saturns moons
    for (let i=0;i<=82; i++){
        let radius = (getRndInteger(35, 60))*.001
        geometry = new THREE.SphereGeometry( radius, 64, 32 );
        texture = new THREE.TextureLoader().load('Textures/moon.jpg');
        material = new THREE.MeshStandardMaterial({map:texture})
        sphere = new THREE.Mesh( geometry, material );
        sphere.position.z = getRndInteger(-3, 3);
        sphere.position.y = getRndInteger(-3, 3)
        sphere.position.x = getRndInteger(17, 20)
        sphere.castShadow = false
        sphere.receiveShadow = true
        scene.add(sphere)
        objectList.push(sphere)
    }

    //SATURN'S RING ----------------------------------------------------------------------------------------------------
    geometry = new THREE.RingGeometry( 1.55, 2.2, 32 );
    texture = new THREE.TextureLoader().load('Textures/saturn ring.png')
    material = new THREE.MeshStandardMaterial( { map: texture, side: THREE.DoubleSide} );
    let ring = new THREE.Mesh( geometry, material );
    ring.position.x = 18;
    ring.rotation.x = Math.PI / 1.77
    scene.add( ring )
    objectList.push(sphere)

    //URANUS ------------------------------------------------------------------------
    geometry = new THREE.SphereGeometry( 0.51, 64, 32 );
    texture = new THREE.TextureLoader().load('Textures/uranus.jpg');
    material = new THREE.MeshStandardMaterial({map:texture})
    sphere = new THREE.Mesh( geometry, material );
    sphere.position.y = 0
    sphere.position.x = 22
    sphere.castShadow = false
    sphere.receiveShadow = true
    scene.add(sphere)
    objectList.push(sphere)

    //Uranus' moons --------------------------------------------------------------------------------
    for (let i=0;i<=27; i++){
        let radius = (getRndInteger(15, 35))*.001
        geometry = new THREE.SphereGeometry( radius, 64, 32 );
        texture = new THREE.TextureLoader().load('Textures/moon.jpg');
        material = new THREE.MeshStandardMaterial({map:texture})
        sphere = new THREE.Mesh( geometry, material );
        sphere.position.z = getRndInteger(-1, 1);
        sphere.position.y = getRndInteger(-1, 1)
        sphere.position.x = getRndInteger(21, 24)
        sphere.castShadow = false
        sphere.receiveShadow = true
        scene.add(sphere)
        objectList.push(sphere)
    }

    //NEPTUNE ------------------------------------------------------------------------
    geometry = new THREE.SphereGeometry( 0.49, 64, 32 );
    texture = new THREE.TextureLoader().load('Textures/neptune.jpg');
    material = new THREE.MeshStandardMaterial({map:texture})
    sphere = new THREE.Mesh( geometry, material );
    sphere.position.y = 0
    sphere.position.x = 25
    sphere.castShadow = false
    sphere.receiveShadow = true
    scene.add(sphere)
    objectList.push(sphere)

    //Neptune's beard... no, moons jsjs -------------------------------------------------------------------------
    for (let i=0;i<=14; i++){
        let radius = (getRndInteger(15, 35))*.001
        geometry = new THREE.SphereGeometry( radius, 64, 32 );
        texture = new THREE.TextureLoader().load('Textures/moon.jpg');
        material = new THREE.MeshStandardMaterial({map:texture})
        sphere = new THREE.Mesh( geometry, material );
        sphere.position.z = getRndInteger(-1, 1);
        sphere.position.y = getRndInteger(-1, 1)
        sphere.position.x = getRndInteger(24, 26)
        sphere.castShadow = false
        sphere.receiveShadow = true
        scene.add(sphere)
        objectList.push(sphere)
    }

    //PLUTO ------------------------------------------------------------------------------------------
    geometry = new THREE.SphereGeometry( 0.1, 64, 32 );
    texture = new THREE.TextureLoader().load('Textures/pluto.jpg');
    material = new THREE.MeshStandardMaterial({map:texture})
    sphere = new THREE.Mesh( geometry, material );
    sphere.position.y = 0
    sphere.position.x = 28
    sphere.castShadow = false
    sphere.receiveShadow = true
    scene.add(sphere)
    objectList.push(sphere)

    //Pluto's moons --------------------------------------------------------------------
    for (let i=0;i<=5; i++){
        let radius = (getRndInteger(15, 35))*.001
        geometry = new THREE.SphereGeometry( radius, 64, 32 );
        texture = new THREE.TextureLoader().load('Textures/moon.jpg');
        material = new THREE.MeshStandardMaterial({map:texture})
        sphere = new THREE.Mesh( geometry, material );
        sphere.position.z = getRndInteger(-1, 1);
        sphere.position.y = getRndInteger(-1, 1)
        sphere.position.x = getRndInteger(27, 29)
        sphere.castShadow = false
        sphere.receiveShadow = true
        scene.add(sphere)
        objectList.push(sphere)
    }
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }


main();