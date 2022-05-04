// 1. Enable shadow mapping in the renderer. 
// 2. Enable shadows and set shadow parameters for the lights that cast shadows. 
// Both the THREE.DirectionalLight type and the THREE.SpotLight type support shadows. 
// 3. Indicate which geometry objects cast and receive shadows.

"use strict"; 

import * as THREE from '../libs/three.js/three.module.js'
import { OrbitControls } from '../libs/three.js/controls/OrbitControls.js';
import { OBJLoader } from '../libs/three.js/loaders/OBJLoader.js';
import { MTLLoader } from '../libs/three.js/loaders/MTLLoader.js';

let renderer = null, scene = null, camera = null, group = null, objectList = [], orbitControls = null;

let duration = 20000; // ms
let currentTime = Date.now();

let directionalLight = null, spotLight = null, ambientLight = null;

let mapUrl = "../images/checker_large.gif";

let SHADOW_MAP_WIDTH = 1024, SHADOW_MAP_HEIGHT = 1024;

let objMtlModelUrl = {obj:'../models/obj/Penguin_obj/penguin.obj', mtl:'../models/obj/Penguin_obj/penguin.mtl'};

let objModelUrl = {obj:'../models/obj/cerberus/Cerberus.obj', map:'../models/obj/cerberus/Cerberus_A.jpg', normalMap:'../models/obj/cerberus/Cerberus_N.jpg', specularMap: '../models/obj/cerberus/Cerberus_M.jpg'};

let jsonModelUrl = { url:'../models/json/teapot-claraio.json' };

function main()
{
    const canvas = document.getElementById("webglcanvas");

    createScene(canvas);
    
    update();
}

function onError ( err ){ console.error( err ); };

function onProgress( xhr ) 
{
    if ( xhr.lengthComputable ) {

        const percentComplete = xhr.loaded / xhr.total * 100;
        console.log( xhr.target.responseURL, Math.round( percentComplete, 2 ) + '% downloaded' );
    }
}

async function loadJson(url, objectList)
{
    try 
    {
        const object = await new THREE.ObjectLoader().loadAsync(url, onProgress, onError);

        object.castShadow = true;
        object.receiveShadow = false;

        object.position.y = -1;
        object.position.x = 1.5;

        object.name = "jsonObject";

        objectList.push(object);
        scene.add(object);
    }
    catch (err) 
    {
        return onError(err);
    }
}

async function loadObj(objModelUrl, objectList)
{
    try
    {
        const object = await new OBJLoader().loadAsync(objModelUrl.obj, onProgress, onError);

        let texture = objModelUrl.hasOwnProperty('normalMap') ? new THREE.TextureLoader().load(objModelUrl.map) : null;
        let normalMap = objModelUrl.hasOwnProperty('normalMap') ? new THREE.TextureLoader().load(objModelUrl.normalMap) : null;
        let specularMap = objModelUrl.hasOwnProperty('specularMap') ? new THREE.TextureLoader().load(objModelUrl.specularMap) : null;

        console.log(object);
        
        // object.traverse(function (child) 
        // {
            for(const child of object.children)
            {
                //     if (child.isMesh)
                child.castShadow = true;
                child.receiveShadow = true;
                child.material.map = texture;
                child.material.normalMap = normalMap;
                child.material.specularMap = specularMap;
            }
        // });

        object.scale.set(3, 3, 3);
        object.position.z = -3;
        object.position.x = -4.5;
        object.rotation.y = -3;
        object.name = "objObject";
        
        objectList.push(object);
        scene.add(object);
    }
    catch (err) 
    {
        onError(err);
    }
}

async function loadObjMtl(objModelUrl, objectList)
{
    try
    {
        const mtlLoader = new MTLLoader();

        const materials = await mtlLoader.loadAsync(objModelUrl.mtl, onProgress, onError);

        materials.preload();
        
        const objLoader = new OBJLoader();

        objLoader.setMaterials(materials);

        const object = await objLoader.loadAsync(objModelUrl.obj, onProgress, onError);
    
        object.traverse(function (child) {
            if (child.isMesh)
            {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        
        console.log(object);

        object.position.y += -1;
        object.scale.set(0.15, 0.15, 0.15);

        objectList.push(object);
        scene.add(object);
    }
    catch (err)
    {
        onError(err);
    }
}



function animate() 
{
    let now = Date.now();
    let deltat = now - currentTime;
    currentTime = now;
    let fract = deltat / duration;
    let angle = Math.PI * 2 * fract;

    /*for(const object of objectList) //movimiento
        if(object)
            object.rotation.y += angle / 2;*/
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
    directionalLight.position.set(0,0,0);
    directionalLight.target.position.set(0,0,0);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    spotLight = new THREE.SpotLight (0xaaaaaa);
    spotLight.position.set(2, 8, 15);
    spotLight.target.position.set(-2, 0, -2);
    scene.add(spotLight);

    spotLight.castShadow = true;

    spotLight.shadow.camera.near = 1;
    spotLight.shadow. camera.far = 200;
    spotLight.shadow.camera.fov = 45;
    
    spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    ambientLight = new THREE.AmbientLight ( 0x444444, 0.8);
    scene.add(ambientLight);
    
    //MERCURY --------------------------------------------------
    let geometry = new THREE.SphereGeometry( 0.2, 64, 32 );
    let texture = new THREE.TextureLoader().load('Textures/mercury.jpg');
    let material = new THREE.MeshBasicMaterial({map:texture})
    let sphere = new THREE.Mesh( geometry, material );
    sphere.position.y = 0
    sphere.position.x = 4
    sphere.castShadow = false
    sphere.receiveShadow = true
    scene.add(sphere);

    //THE SUN ---------------------------------------------------------------------------------
    geometry = new THREE.SphereGeometry( 3.3, 64, 32 );
    texture = new THREE.TextureLoader().load('Textures/sun.jpg');
    material = new THREE.MeshBasicMaterial({map:texture})
    sphere = new THREE.Mesh( geometry, material );
    sphere.castShadow = false
    sphere.receiveShadow = true
    scene.add(sphere);

    //VENUS ---------------------------------------------------------------------------
    geometry = new THREE.SphereGeometry( 0.4, 64, 32 );
    texture = new THREE.TextureLoader().load('Textures/venus.jpg');
    material = new THREE.MeshBasicMaterial({map:texture})
    sphere = new THREE.Mesh( geometry, material );
    sphere.position.y = 0
    sphere.position.x = 5.5
    sphere.castShadow = false
    sphere.receiveShadow = true
    scene.add(sphere);

    //OUR GLORIOUS EARTH --------------------------------------------------------------------
    geometry = new THREE.SphereGeometry( 0.45, 64, 32 );
    texture = new THREE.TextureLoader().load('Textures/earth.jpg');
    material = new THREE.MeshBasicMaterial({map:texture})
    sphere = new THREE.Mesh( geometry, material );
    sphere.position.y = 0
    sphere.position.x = 7
    sphere.castShadow = false
    sphere.receiveShadow = true
    scene.add(sphere);

    //OUR MOON----------------------------------------------------------------------------
    geometry = new THREE.SphereGeometry( 0.065, 64, 32 );
    texture = new THREE.TextureLoader().load('Textures/moon.jpg');
    material = new THREE.MeshBasicMaterial({map:texture})
    sphere = new THREE.Mesh( geometry, material );
    sphere.position.z = 0.86
    sphere.position.x = 7.2
    sphere.castShadow = false
    sphere.receiveShadow = true
    scene.add(sphere);

    //MARS home of the Martian Manhunter---------------------------------------------------------------------------------------
    geometry = new THREE.SphereGeometry( 0.25, 64, 32 );
    texture = new THREE.TextureLoader().load('Textures/mars.jpg');
    material = new THREE.MeshBasicMaterial({map:texture})
    sphere = new THREE.Mesh( geometry, material );
    sphere.position.y = 0
    sphere.position.x = 9
    sphere.castShadow = false
    sphere.receiveShadow = true
    scene.add(sphere);

    //Mars' moons ----------------------------------------------------------------------------------------------------
    for (let i=0;i<=2; i++){
        geometry = new THREE.SphereGeometry( 0.042, 64, 32 );
        texture = new THREE.TextureLoader().load('Textures/moon.jpg');
        material = new THREE.MeshBasicMaterial({map:texture})
        sphere = new THREE.Mesh( geometry, material );
        sphere.position.z = getRndInteger(-1, 1);
        sphere.position.y = getRndInteger(-1, 1)
        sphere.position.x = getRndInteger(8, 10)
        sphere.castShadow = false
        sphere.receiveShadow = true
        scene.add(sphere);
    }

    //JUPITER ----------------------------------------------------------------------------------------------
    geometry = new THREE.SphereGeometry( 1.5, 64, 32 );
    texture = new THREE.TextureLoader().load('Textures/jupiter.jpg');
    material = new THREE.MeshBasicMaterial({map:texture})
    sphere = new THREE.Mesh( geometry, material );
    sphere.position.y = 0
    sphere.position.x = 13
    sphere.castShadow = false
    sphere.receiveShadow = true
    scene.add(sphere);

    //Jupiter's moons -----------------------------------------------------------------------------------------------------
    for (let i=0;i<=79; i++){
        let radius = (getRndInteger(40, 80))*.001
        geometry = new THREE.SphereGeometry( radius, 64, 32 );
        texture = new THREE.TextureLoader().load('Textures/moon.jpg');
        material = new THREE.MeshBasicMaterial({map:texture})
        sphere = new THREE.Mesh( geometry, material );
        sphere.position.z = getRndInteger(-3, 3);
        sphere.position.y = getRndInteger(-3, 3)
        sphere.position.x = getRndInteger(11, 15)
        sphere.castShadow = false
        sphere.receiveShadow = true
        scene.add(sphere);
    }

    //SATURN ---------------------------------------------------------------------------------------------------
    geometry = new THREE.SphereGeometry( 1.15, 64, 32 );
    texture = new THREE.TextureLoader().load('Textures/saturn.jpg');
    material = new THREE.MeshBasicMaterial({map:texture})
    sphere = new THREE.Mesh( geometry, material );
    sphere.position.y = 0
    sphere.position.x = 18
    sphere.castShadow = false
    sphere.receiveShadow = true
    scene.add(sphere);

    //Saturns moons
    for (let i=0;i<=82; i++){
        let radius = (getRndInteger(35, 60))*.001
        geometry = new THREE.SphereGeometry( radius, 64, 32 );
        texture = new THREE.TextureLoader().load('Textures/moon.jpg');
        material = new THREE.MeshBasicMaterial({map:texture})
        sphere = new THREE.Mesh( geometry, material );
        sphere.position.z = getRndInteger(-3, 3);
        sphere.position.y = getRndInteger(-3, 3)
        sphere.position.x = getRndInteger(17, 20)
        sphere.castShadow = false
        sphere.receiveShadow = true
        scene.add(sphere);
    }

    //SATURN'S RING ----------------------------------------------------------------------------------------------------
    geometry = new THREE.RingGeometry( 1.55, 2.2, 32 );
    texture = new THREE.TextureLoader().load('Textures/saturn ring.png')
    material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide} );
    let ring = new THREE.Mesh( geometry, material );
    ring.position.x = 18;
    ring.rotation.x = Math.PI / 1.77
    scene.add( ring );

    //URANUS ------------------------------------------------------------------------
    geometry = new THREE.SphereGeometry( 0.51, 64, 32 );
    texture = new THREE.TextureLoader().load('Textures/uranus.jpg');
    material = new THREE.MeshBasicMaterial({map:texture})
    sphere = new THREE.Mesh( geometry, material );
    sphere.position.y = 0
    sphere.position.x = 22
    sphere.castShadow = false
    sphere.receiveShadow = true
    scene.add(sphere);

    //Uranus' moons --------------------------------------------------------------------------------
    for (let i=0;i<=27; i++){
        let radius = (getRndInteger(15, 35))*.001
        geometry = new THREE.SphereGeometry( radius, 64, 32 );
        texture = new THREE.TextureLoader().load('Textures/moon.jpg');
        material = new THREE.MeshBasicMaterial({map:texture})
        sphere = new THREE.Mesh( geometry, material );
        sphere.position.z = getRndInteger(-1, 1);
        sphere.position.y = getRndInteger(-1, 1)
        sphere.position.x = getRndInteger(21, 24)
        sphere.castShadow = false
        sphere.receiveShadow = true
        scene.add(sphere);
    }

    //NEPTUNE ------------------------------------------------------------------------
    geometry = new THREE.SphereGeometry( 0.49, 64, 32 );
    texture = new THREE.TextureLoader().load('Textures/neptune.jpg');
    material = new THREE.MeshBasicMaterial({map:texture})
    sphere = new THREE.Mesh( geometry, material );
    sphere.position.y = 0
    sphere.position.x = 25
    sphere.castShadow = false
    sphere.receiveShadow = true
    scene.add(sphere);

    //Neptune's beard... no, moons jsjs -------------------------------------------------------------------------
    for (let i=0;i<=14; i++){
        let radius = (getRndInteger(15, 35))*.001
        geometry = new THREE.SphereGeometry( radius, 64, 32 );
        texture = new THREE.TextureLoader().load('Textures/moon.jpg');
        material = new THREE.MeshBasicMaterial({map:texture})
        sphere = new THREE.Mesh( geometry, material );
        sphere.position.z = getRndInteger(-1, 1);
        sphere.position.y = getRndInteger(-1, 1)
        sphere.position.x = getRndInteger(24, 26)
        sphere.castShadow = false
        sphere.receiveShadow = true
        scene.add(sphere);
    }

    //PLUTO ------------------------------------------------------------------------------------------
    geometry = new THREE.SphereGeometry( 0.1, 64, 32 );
    texture = new THREE.TextureLoader().load('Textures/pluto.jpg');
    material = new THREE.MeshBasicMaterial({map:texture})
    sphere = new THREE.Mesh( geometry, material );
    sphere.position.y = 0
    sphere.position.x = 28
    sphere.castShadow = false
    sphere.receiveShadow = true
    scene.add(sphere);

    //Pluto's moons --------------------------------------------------------------------
    for (let i=0;i<=5; i++){
        let radius = (getRndInteger(15, 35))*.001
        geometry = new THREE.SphereGeometry( radius, 64, 32 );
        texture = new THREE.TextureLoader().load('Textures/moon.jpg');
        material = new THREE.MeshBasicMaterial({map:texture})
        sphere = new THREE.Mesh( geometry, material );
        sphere.position.z = getRndInteger(-1, 1);
        sphere.position.y = getRndInteger(-1, 1)
        sphere.position.x = getRndInteger(27, 29)
        sphere.castShadow = false
        sphere.receiveShadow = true
        scene.add(sphere);
    }
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }


main();