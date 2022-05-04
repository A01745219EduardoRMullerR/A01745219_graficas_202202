"use strict";

import * as THREE from "../libs/three.js/three.module.js"

let renderer = null, scene = null, camera = null, cube = null;

let duration = 10000; // ms
let currentTime = Date.now();

function main() 
{
    scene_setup();
    create_arm();
    update();
}

function animate() 
{
    if(cube)
    {    
        let now = Date.now();
        let deltat = now - currentTime;
        currentTime = now;
        let fract = deltat / duration;
        let angle = Math.PI * 2 * fract;
        cube.rotation.y += angle;
    }
}

function update() 
{
    requestAnimationFrame(function() { update(); });
    
    // Render the scene
    renderer.render( scene, camera );

    // Spin the cube for next frame
    animate();
            
}

function scene_setup()
{
    const canvas = document.getElementById("webglcanvas");

    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 40);
    scene.add(camera);

    // Add a directional light to show off the object
    const light = new THREE.DirectionalLight( new THREE.Color("rgb(200, 200, 200)"), 1);

    scene.background = new THREE.Color("rgb(0, 16, 50)")

    // Position the light out from the scene, pointing at the origin
    light.position.set(-2, -2, 2);
    light.target.position.set(0,0,0);

    const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
    light2.position.set(0, 5, 2);
    light2.target.position.set(0,0,0);

    scene.add( light );
    scene.add(light2);
}

function create_arm()
{
    const textureUrl = "../images/ash_uvgrid01.jpg";
    const texture = new THREE.TextureLoader().load(textureUrl);
    const geometry = new THREE.BoxGeometry( 0.5, 0.5, 0.54 );
    const material = new THREE.MeshNormalMaterial();
    cube = new THREE.Mesh( geometry, material );
    cube.position.x = 0
    cube.position.y = 0
    cube.position.z = -4
    scene.add( cube );
}

main();