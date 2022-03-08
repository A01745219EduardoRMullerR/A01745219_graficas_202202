import * as shaderUtils from '../common/shaderUtils.js'
const mat4 = glMatrix.mat4;

let projectionMatrix;

let shaderVertexPositionAttribute, shaderVertexColorAttribute, shaderProjectionMatrixUniform, shaderModelViewMatrixUniform;

const duration = 10000; // ms

// in: Input variables used in the vertex shader. Since the vertex shader is called on each vertex, these will be different every time the vertex shader is invoked.
// Uniforms: Input variables for both the vertex and fragment shaders. These do not change values from vertex to vertex.

const vertexShaderSource = `#version 300 es

        in vec3 vertexPos; // Vertex from the buffer
        in vec4 vertexColor;

        out vec4 color;

        uniform mat4 modelViewMatrix; // Object's position
        uniform mat4 projectionMatrix; // Camera's position

        void main(void) {
    		// Return the transformed and projected vertex value
            gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPos, 1.0);
            color = vertexColor * 0.8;
        }`;

const fragmentShaderSource = `#version 300 es

        precision mediump float;
        in vec4 color;
        out vec4 fragColor;

        void main(void) {
        fragColor = color;
    }`;

function main() {
    const canvas = document.getElementById("webglcanvas");
    const gl = initWebGL(canvas);
    initViewport(gl, canvas);
    initGL(canvas);
    let y = -2
    let upOrDown = true

    let dodecahedron = createDodecahedron(gl, [0.5, 0, -4], [-0.4, 1.0, 0.1])
    let octahedron = createOctahedron(gl, [3.2, y, -2], [0, 1, 0])
    let scutoid = createScutoid(gl, [-3, -1, -2.5],[1.0, 1.0, 0.2])

    const shaderProgram = shaderUtils.initShader(gl, vertexShaderSource, fragmentShaderSource);
    bindShaderAttributes(gl, shaderProgram);

    update(gl, shaderProgram, [dodecahedron, octahedron, scutoid]);
}

function initWebGL(canvas) {
    let gl = null;
    let msg = "Your browser does not support WebGL, or it is not enabled by default.";
    try {
        gl = canvas.getContext("webgl2");
    }
    catch (e) {
        msg = "Error creating WebGL Context!: " + e.toString();
    }

    if (!gl) {
        throw new Error(msg);
    }

    return gl;
}

function initViewport(gl, canvas) {
    gl.viewport(0, 0, canvas.width, canvas.height);
}

function initGL(canvas) {
    // Create a project matrix with 45 degree field of view
    projectionMatrix = mat4.create();

    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 100);
    // mat4.orthoNO(projectionMatrix, -4, 4, -3.5, 3.5, 1, 100)
    mat4.translate(projectionMatrix, projectionMatrix, [0, 0, -5]);
}

// Create the vertex, color and index data for a multi-colored cube
//------- Cube from the example 3dCube
function createCube(gl, translation, rotationAxis)
{    
    // Vertex Data
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let verts = [
       // Front face verts
       -1.0, -1.0,  1.0, //1
        1.0, -1.0,  1.0, //2
        1.0,  1.0,  1.0, //3
       -1.0,  1.0,  1.0, //4

       // Back face
       -1.0, -1.0, -1.0,
       -1.0,  1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0, -1.0, -1.0,

       // Top face
       -1.0,  1.0, -1.0,
       -1.0,  1.0,  1.0,
        1.0,  1.0,  1.0,
        1.0,  1.0, -1.0,

       // Bottom face
       -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0,  1.0,
       -1.0, -1.0,  1.0,

       // Right face
        1.0, -1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0,  1.0,  1.0,
        1.0, -1.0,  1.0,

       // Left face
       -1.0, -1.0, -1.0,
       -1.0, -1.0,  1.0,
       -1.0,  1.0,  1.0,
       -1.0,  1.0, -1.0
       ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    let faceColors = [
        [1.0, 0.0, 0.0, 1.0], // Front face
        [0.0, 1.0, 0.0, 1.0], // Back face
        [0.0, 0.0, 1.0, 1.0], // Top face
        [1.0, 1.0, 0.0, 1.0], // Bottom face
        [1.0, 0.0, 1.0, 1.0], // Right face
        [0.0, 1.0, 1.0, 1.0]  // Left face
    ];

    // Each vertex must have the color information, that is why the same color is concatenated 4 times, one for each vertex of the cube's face.
    let vertexColors = [];
    // for (const color of faceColors) 
    // {
    //     for (let j=0; j < 4; j++)
    //         vertexColors.push(...color);
    // }
    faceColors.forEach(color =>{
        for (let j=0; j < 4; j++)
            vertexColors.push(...color);
    });

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    let cubeIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);

    let cubeIndices = [
        0, 1, 2,      0, 2, 3,    // Front face
        4, 5, 6,      4, 6, 7,    // Back face
        8, 9, 10,     8, 10, 11,  // Top face
        12, 13, 14,   12, 14, 15, // Bottom face
        16, 17, 18,   16, 18, 19, // Right face
        20, 21, 22,   20, 22, 23  // Left face
    ];

    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);
    
    let cube = {
            buffer: vertexBuffer, colorBuffer:colorBuffer, indices:cubeIndexBuffer,
            vertSize:3, nVerts:24, colorSize:4, nColors: 24, nIndices:36,
            primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()
        };

    mat4.translate(cube.modelViewMatrix, cube.modelViewMatrix, translation);

    cube.update = function()
    {
        let now = Date.now();
        let deltat = now - this.currentTime;
        this.currentTime = now;
        let fract = deltat / duration;
        let angle = Math.PI * 2 * fract;
    
        // Rotates a mat4 by the given angle
        // mat4 out the receiving matrix
        // mat4 a the matrix to rotate
        // Number rad the angle to rotate the matrix by
        // vec3 axis the axis to rotate around
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
    };
    
    return cube;
}

//----------------Funciones de tarea

function createDodecahedron(gl, translation, rotationAxis) {
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let verts = [
        -1, 1, 1,
        0, 0.5, 1.5,
        1, 1, 1,
        -1, 1, 1,
        1, 1, 1,
        0.5, 1.5, 0,
        -1, 1, 1,
        0.5, 1.5, 0,
        -0.5, 1.5, 0,
        1, 1, 1,
        1.5, 0, 0.5,
        1.5, 0, -0.5,
        1, 1, 1,
        1.5, 0, -0.5,
        1, 1, -1,
        1, 1, 1,
        1, 1, -1,
        0.5, 1.5, 0,
        1.5, 0, -0.5,
        1, -1, -1,
        0, -0.5, -1.5,
        1.5, 0, -0.5,
        0, -0.5, -1.5,
        0, 0.5, -1.5,
        1.5, 0, -0.5,
        0, 0.5, -1.5,
        1, 1, -1,
        0, -0.5, -1.5,
        -1, -1, -1,
        -1.5, 0, -0.5,
        0, -0.5, -1.5,
        -1.5, 0, -0.5,
        -1, 1, -1,
        0, -0.5, -1.5,
        -1, 1, -1,
        0, 0.5, -1.5,
        -1, -1, -1,
        -0.5, -1.5, 0,
        -1, -1, 1,
        -1, -1, -1,
        -1, -1, 1,
        -1.5, 0, 0.5,
        -1, -1, -1,
        -1.5, 0, 0.5,
        -1.5, 0, -0.5,
        -1, 1, -1,
        -1.5, 0, -0.5,
        -1.5, 0, 0.5,
        -1, 1, -1,
        -1.5, 0, 0.5,
        -1, 1, 1,
        -1, 1, -1,
        -1, 1, 1,
        -0.5, 1.5, 0,
        -1.5, 0, 0.5,
        -1, -1, 1,
        0, -0.5, 1.5,
        -1.5, 0, 0.5,
        0, -0.5, 1.5,
        0, 0.5, 1.5,
        -1.5, 0, 0.5,
        0, 0.5, 1.5,
        -1, 1, 1,
        1, -1, -1,
        0.5, -1.5, 0,
        -0.5, -1.5, 0,
        1, -1, -1,
        -0.5, -1.5, 0,
        -1, -1, -1,
        1, -1, -1,
        -1, -1, -1,
        0, -0.5, -1.5,
        0, 0.5, 1.5,
        0, -0.5, 1.5,
        1, -1, 1,
        0, 0.5, 1.5,
        1, -1, 1,
        1.5, 0, 0.5,
        0, 0.5, 1.5,
        1.5, 0, 0.5,
        1, 1, 1,
        1.5, 0, 0.5,
        1, -1, 1,
        0.5, -1.5, 0,
        1.5, 0, 0.5,
        0.5, -1.5, 0,
        1, -1, -1,
        1.5, 0, 0.5,
        1, -1, -1,
        1.5, 0, -0.5,
        1, 1, -1,
        0, 0.5, -1.5,
        -1, 1, -1,
        1, 1, -1,
        -1, 1, -1,
        -0.5, 1.5, 0,
        1, 1, -1,
        -0.5, 1.5, 0,
        0.5, 1.5, 0,
        -1, -1, 1,
        -0.5, -1.5, 0,
        0.5, -1.5, 0,
        -1, -1, 1,
        0.5, -1.5, 0,
        1, -1, 1,
        -1, -1, 1,
        1, -1, 1,
        0, -0.5, 1.5
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW)

    // Color data
    let colorBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)

    let faceColors = [
        [0.5, 1.0, 0.0, 1.0],
        [0.0, 1.0, 0.0, 1.0],
        [0.0, 1.0, 0, 1.0],
        [0.5, 1.0, 0.3, 1.0],
        [0.5, 0.8, 0.3, 1.0],
        [0.0, 1.0, 0.5, 1.0],
        [0.5, 1.0, 0.0, 1.0],
        [0.5, 1.0, 0.0, 1.0],
        [0.0, .7, 1.0, 1.0],
        [.4, 1.0, 0.0, 1.0],
        [1.0, 2.0, 0, 1.0],
        [0.0, 1.0, 1.0, 1.0],
        [0, 1.0, 0, 1.0],
        [0.0, 1.0, 0.4, 1.0]
    ];

    // Each vertex must have the color information, that is why the same color is concatenated 4 times, one for each vertex of the cube's face.
    let vertexColors = []
    faceColors.forEach(color => {
        for (let j = 0; j < 9; j++)
            vertexColors.push(...color);
    })

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    let cubeIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);

    let dodecahedronIndexes = [
        0, 1, 2, 3, 4, 5, 6, 7, 8,
        9, 10, 11, 12, 13, 14, 15, 16, 17,
        18, 19, 20, 21, 22, 23, 24, 25, 26,
        27, 28, 29, 30, 31, 32, 33, 34, 35,
        36, 37, 38, 39, 40, 41, 42, 43, 44,
        45, 46, 47, 48, 49, 50, 51, 52, 53,
        54, 55, 56, 57, 58, 59, 60, 61, 62,
        63, 64, 65, 66, 67, 68, 69, 70, 71,
        72, 73, 74, 75, 76, 77, 78, 79, 80,
        81, 82, 83, 84, 85, 86, 87, 88, 89,
        90, 91, 92, 93, 94, 95, 96, 97, 98,
        99, 100, 101, 102, 103, 104, 105, 106, 107
    ];

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(dodecahedronIndexes), gl.STATIC_DRAW);

    let dodecahedron = {
        buffer: vertexBuffer, colorBuffer: colorBuffer, indices: cubeIndexBuffer,
        vertSize: 3, nVerts: 128, colorSize: 4, nColors: 24, nIndices: 108,
        primtype: gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime: Date.now()
    };

    mat4.translate(dodecahedron.modelViewMatrix, dodecahedron.modelViewMatrix, translation);

    dodecahedron.update = function () {
        let now = Date.now()
        let deltat = now - this.currentTime
        this.currentTime = now
        let fract = deltat / duration
        let angle = Math.PI * 2 * fract
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
    };

    return dodecahedron
}

function createOctahedron(gl, translation, rotationAxis) {
    // Vertex Data
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let verts = [
        -0.5, 0, -.5,
        0, 0.5, 0,
        0.5, 0, -0.5,
        -.5, 0, -0.5,
        0, -0.5, 0,
        0.5, 0, -0.5,
        0.5, 0, -0.5,
        0, 0.5, 0,
        0.5, 0, 0.5,
        0.5, 0, -0.5,
        0, -0.5, 0,
        0.5, 0, 0.5,
        -0.5, 0, 0.5,
        0, 0.5, 0,
        0.5, 0, 0.5,
        -0.5, 0, 0.5,
        0, -0.5, 0,
        0.5, 0, 0.5,
        -0.5, 0, -0.5,
        0, 0.5, 0,
        -0.5, 0, 0.5,
        -0.5, 0, -0.5,
        0, -0.5, 0,
        -0.5, 0, 0.5
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    let faceColors = [
        [1.0, 0.0, 1.0, 1.0],
        [0.0, 1.0, 0.2, 1.0],
        [1.0, 0.0, 0.5, 1.0],
        [1.0, 0.5, 0.4, 1.0],
        [0.5, 0.8, 0.3, 1.0],
        [1.0, 0.6, 0.2, 1.0],
        [1.0, 0.6, 1.0, 1.0],
        [0.8, 0.1, 0.4, 1.0]
    ];

    // Each vertex must have the color information, that is why the same color is concatenated 4 times, one for each vertex of the cube's face.
    let vertexColors = []

    faceColors.forEach(color => {
        for (let j = 0; j < 3; j++)
            vertexColors.push(...color)
    })

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    let cubeIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);

    let octahedronIndexes = [
        0, 1, 2,
        3, 4, 5,
        6, 7, 8,
        9, 10, 11,
        12, 13, 14,
        15, 16, 17,
        18, 19, 20,
        21, 22, 23

    ]

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(octahedronIndexes), gl.STATIC_DRAW);

    let octahedron = {
        buffer: vertexBuffer, colorBuffer: colorBuffer, indices: cubeIndexBuffer,
        vertSize: 3, nVerts: 24, colorSize: 4, nColors: 24, nIndices: octahedronIndexes.length,
        primtype: gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime: Date.now()
    };

    mat4.translate(octahedron.modelViewMatrix, octahedron.modelViewMatrix, translation);

    var counter = 0
    var upOrDown = true
    var y = 0

    octahedron.update = function () {
        let now = Date.now()
        let deltat = now - this.currentTime
        this.currentTime = now
        let fract = deltat / duration
        let angle = Math.PI * 2 * fract
        let counterMAX = 400

        if (counter <= counterMAX && upOrDown) {
            counter += 1
            y = .01
            if (counter >= counterMAX) {
                counter = 0
                upOrDown = false
            }
        } 
        else if (counter <= counterMAX * 2 && !upOrDown) {
            counter += 1
            y = -0.01
            if (counter >= counterMAX) {
                counter = 0
                upOrDown = true
            }
        }

        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
        mat4.translate(octahedron.modelViewMatrix, octahedron.modelViewMatrix, [0, y, 0]);
    };

    return octahedron
}

function bindShaderAttributes(gl, shaderProgram) {
    // get pointers to the shader params
    shaderVertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPos");
    gl.enableVertexAttribArray(shaderVertexPositionAttribute);

    shaderVertexColorAttribute = gl.getAttribLocation(shaderProgram, "vertexColor");
    gl.enableVertexAttribArray(shaderVertexColorAttribute);

    shaderProjectionMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    shaderModelViewMatrixUniform = gl.getUniformLocation(shaderProgram, "modelViewMatrix");
}

function draw(gl, shaderProgram, objs) {
    // clear the background (with black)
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // set the shader to use
    gl.useProgram(shaderProgram);

    for (let i = 0; i < objs.length; i++) {
        let obj = objs[i];
        // connect up the shader parameters: vertex position, color and projection/model matrices
        // set up the buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
        gl.vertexAttribPointer(shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, obj.colorBuffer);
        gl.vertexAttribPointer(shaderVertexColorAttribute, obj.colorSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indices);

        gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
        gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, obj.modelViewMatrix);

        // Draw the object's primitives using indexed buffer information.
        // void gl.drawElements(mode, count, type, offset);
        // mode: A GLenum specifying the type primitive to render.
        // count: A GLsizei specifying the number of elements to be rendered.
        // type: A GLenum specifying the type of the values in the element array buffer.
        // offset: A GLintptr specifying an offset in the element array buffer.
        gl.drawElements(obj.primtype, obj.nIndices, gl.UNSIGNED_SHORT, 0);
    }
}

function update(gl, shaderProgram, objs) {
    // The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint. The method takes a callback as an argument to be invoked before the repaint.
    requestAnimationFrame(() => update(gl, shaderProgram, objs));

    draw(gl, shaderProgram, objs);

    objs.forEach(obj => {
        obj.update();
    })
    // for(const obj of objs)
    //     obj.update();
    // for(let i = 0; i<objs.length; i++)
    //     objs[i].update();
}

function createScutoid(gl, translation, rotationAxis) {
    // Vertex Data
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let verts = [
        1, 1, 0,
        1, 0.6, 0.7,
        1, 0, 0.5,
        1, 0, -0.5,
        1, 0.6, -0.7,
        1, 0, 0.5,
        -1, 0, 0.5,
        1, 0, -0.5,
        -1, 0, -0.5,
        1, 0.6, -0.7,
        1, 0, -0.5,
        -1, 0.62, -0.7,
        -1, 0, -0.5,
        1, 0.62, 0.7,
        1, 0, 0.5,
        -1, 0.6, 0.7,
        -1, 0, 0.5,
        1, 1, 0,
        1, 0.6, 0.7,
        -1, 0.6, 0.7,
        -0.4, 1.40, 0,
        1, 1, 0,
        1, 0.6, -0.7,
        -1, 0.6, -0.7,
        -0.4, 1.4, 0,
        -1, 0.5, 0,
        -1, 1, 0.5,
        -1, 0.62, 0.7,
        -1, 0, 0.5,
        -1, 0, -0.5,
        -1, 0.6, -0.7,
        -1, 1, -0.5,
        -0.4, 1.4, 0, 
        -1, 1, 0.5,    
        -1, 1, -0.5,   
        -0.4, 1.4, 0,  
        -1, 1, 0.5,     
        -1, 0.6, 0.7,  
        -0.4, 1.4, 0,   
        -1, 1, -0.5,     
        -1, 0.6, -0.7,  
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    let faceColors = [
        [0, 1.0, 0, 1.0], //base pentagonal
        [1.0, 0, 0, 1.0], 
        [1.0, 0, 0, 1.0], 
        [1.0, 0, 0, 1.0], 
        [1.0, 0, 0, 1.0],  
        [1.0, 0, 0, 1.0], 
        [0, 0, 1.0, 1.0], //base hexagonal 
        [1.0, 1.0, .5, 1.0], //triangulo que une el lado extra de la base hexagonal 
        [1.0, 0, 0, 1.0], 
        [1.0, 0, 0, 1.0],              
        [1.0, 0, 0, 1.0]  
    ];

    const faceVertex = [5, 4, 4, 4, 4, 4, 7, 3, 3, 3];

    let vertexColors = [];

    for (let i = 0; i < faceColors.length; i++) {
        const color = faceColors[i];
        for (let j = 0; j < faceVertex[i]; j++) {
            vertexColors.push(...color);
        }
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    let dodeIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, dodeIndexBuffer);

    let scutoidIndexes = [
        0, 1, 2, 0, 2, 3, 0, 3, 4,  
        5, 6, 7, 6, 7, 8,           
        9, 12, 10, 11, 9, 12,       
        13, 15, 14, 16, 15, 14,     
        17, 19, 18, 20, 17, 19,     
        21, 23, 22, 24, 21, 23,       
        26, 25, 27, 27, 25, 28, 28, 25, 29, 29, 25, 30, 30, 25, 31, 31, 25, 26, 
        32, 33, 34,    
        35, 36, 37,    
        38, 39, 40     
    ];


    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(scutoidIndexes), gl.STATIC_DRAW);

    let scutoid = {
        buffer: vertexBuffer, colorBuffer: colorBuffer, indices: dodeIndexBuffer,
        vertSize: 3, nVerts: 24, colorSize: 4, nColors: 20, nIndices: 66,
        primtype: gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime: Date.now()
    }

    mat4.translate(scutoid
        .modelViewMatrix, scutoid
        .modelViewMatrix, translation);

    scutoid
    .update = function () {
        let now = Date.now()
        let deltat = now - this.currentTime
        this.currentTime = now
        let fract = deltat / duration
        let angle = Math.PI * 2 * fract

        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
    }

    return scutoid
    
}

main();