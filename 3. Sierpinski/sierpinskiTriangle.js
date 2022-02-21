function drawTriangle(ctx, pointArr){ //Funcion para dibujar triangulo individualmente
    let v1 = pointArr[0] //Obteniendo los 3 vertices de la forma [x, y]
    let v2 = pointArr[1]
    let v3 = pointArr[2]

    //Draw
    ctx.beginPath()
    ctx.moveTo(v1[0], v1[1])
    ctx.lineTo(v2[0], v2[1])
    ctx.lineTo(v3[0], v3[1])
    ctx.closePath()
    ctx.stroke()

}

function getMidPoints(pointArray){
    
    let v1 = pointArray[0] //Obteniendo los 3 vertices de la forma [x, y]
    let v2 = pointArray[1]
    let v3 = pointArray[2]
    //console.log("Vertices:\n" + v1 + v2 + v3 + "\n---------\n")

    midPointA = Array((v1[0]+v2[0])/2, (v1[1]+v2[1])/2)
    midPointB = Array((v2[0]+v3[0])/2, (v2[1]+v3[1])/2)
    midPointC = Array((v1[0]+v3[0])/2, (v1[1]+v3[1])/2)
    let newPointArray = [midPointA, midPointB, midPointC]

    return newPointArray
}

function recursiveFunc(ctx, pointArr, steps){
    drawTriangle(ctx, pointArr)
    //console.log('Aqui llego, se dibujo?')
    if(steps > 0){
        console.log("Steps: " + steps)
        let newPointArray = getMidPoints(pointArr)
        console.log("Arrays: \nOriginal: [" + pointArr + "]\nMid: [" + newPointArray + "]")
        recursiveFunc(ctx, [pointArr[0], newPointArray[0], newPointArray[2]], steps-1)
        recursiveFunc(ctx, [pointArr[1], newPointArray[0], newPointArray[1]], steps-1)
        recursiveFunc(ctx, [pointArr[2], newPointArray[1], newPointArray[2]], steps-1)
    }
}

function sliderEvent(canvas, ctx, pointArr){
    document.getElementById("slider").oninput = function(event) {
        let steps = event.target.value
        document.getElementById("sliderValue").innerHTML = "Steps: " + event.target.value
        ctx.clearRect(0,0, canvas.width, canvas.height)
        recursiveFunc(ctx, pointArr, steps)
    };
    //drawTriangle(ctx, pointArr) 
        
}

function main(){
    let pointArr = [[200, 100],[100, 300],[300, 300]]
    console.log("The original pointArray: [" + pointArr + "]")
    // To draw something on a <canvas>, you must first retrieve the <canvas> element from the HTML file
    let canvas = document.getElementById("htmlCanvas");
    let ctx = canvas.getContext("2d");

    // If the canvas is not null, the element was retrieved successfully.
    if(!canvas)
    {
        console.log("Failed to load the canvas element.")
        return;
    }
    if(!ctx){
        console.log('Failed to get context.')
        return
    }
    //Ejemplo de como se dibuja
    /*ctx.beginPath()
    ctx.moveTo(200, 100)
    ctx.lineTo(100, 300)
    ctx.lineTo(300, 300)
    ctx.closePath()
    ctx.stroke()*/

    //drawTriangle(ctx, pointArr) //Testing function

    sliderEvent(canvas, ctx, pointArr)

}