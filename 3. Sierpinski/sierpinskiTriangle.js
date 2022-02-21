class Triangle{
    constructor(pointArr){
        this.v1 = pointArr[0] //Obteniendo los 3 vertices de la forma [x, y]
        this.v2 = pointArr[1]
        this.v3 = pointArr[2]
    }

    draw(ctx){
        ctx.beginPath()
        ctx.moveTo(this.v1[0], this.v1[1])
        ctx.lineTo(this.v2[0], this.v2[1])
        ctx.lineTo(this.v3[0], this.v3[1])
        ctx.closePath()
        ctx.stroke()
    }
}

/*function drawTriangle(ctx, pointArr){ //Funcion para dibujar triangulo individualmente
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

}*/

function getMidPoints(pointArray){
    
    let v1 = pointArray[0] //Obteniendo los 3 vertices de la forma [x, y]
    let v2 = pointArray[1]
    let v3 = pointArray[2]

    midPointA = Array((v1[0]+v2[0])/2, (v1[1]+v2[1])/2) //Se obtienen los puntos medios de la forma Q((x1+x2)/2, (y1+y2)/2)
    midPointB = Array((v2[0]+v3[0])/2, (v2[1]+v3[1])/2)
    midPointC = Array((v1[0]+v3[0])/2, (v1[1]+v3[1])/2)
    let newPointArray = [midPointA, midPointB, midPointC]

    return newPointArray //Se regresa un arreglo con el mismo formato de pointArray pero con las nuevas coordenadas
}

function recursiveFunc(ctx, pointArr, steps){
    let triangle = new Triangle(pointArr).draw(ctx)

    if(steps > 0){

        let newPointArray = getMidPoints(pointArr)

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
}

function main(){
    let pointArr = [[200, 100],[100, 300],[300, 300]] //Coordenadas del primer triangulo

    let canvas = document.getElementById("htmlCanvas");
    let ctx = canvas.getContext("2d");

    if(!canvas)
    {
        console.log("Failed to load the canvas element.")
        return;
    }
    if(!ctx){
        console.log('Failed to get context.')
        return
    }

    sliderEvent(canvas, ctx, pointArr)

}