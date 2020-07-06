"use strict";

var canvas;
var gl;
var program;

var projectionMatrix;
var modelViewMatrix;

var instanceMatrix;

var modelViewMatrixLoc;

//camera
var eye=vec3(0,0,0)
var at =vec3(0,0,0)
var up=vec3(0,1,0)
var radius = 17.0;
var anglec=25*Math.PI/180;

//projection
var near = 1.3;
var far = 60.0;
var  fovy = 90.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect;       // Viewport aspect ratio

var vertices = [
    vec4( 0.0, 0.0, 0.5, 1.0),
    vec4( 0,  1,  0.5, 1.0 ),
    vec4( 1,  0,  0.5, 1.0 ),
    vec4( 0, -1,  0.5, 1.0 ),
    vec4( -1, 0,  0.5, 1.0 ),

    vec4( 0.0, 0.0, 0.0, 1.0),
    vec4( 0,  1,  0, 1.0 ),
    vec4( 1,  0,  0, 1.0 ),
    vec4( 0, -1,  0, 1.0 ),
    vec4( -1, 0,  0, 1.0 ),

    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];

var carverticies=[
    vec4(-0.5 ,0.0 ,0.0, 1.0 ),//0
    vec4(0.18, 0.0, 0.0, 1.0 ),//1
    vec4(0.18, 3.0, 0.0, 1.0),//2

    vec4(0.18, 0.7, 0.0, 1.0),//3
    vec4(1.22, 0.7, 0.0, 1.0),//4
    vec4(1.22, 3.0, 0.0, 1.0),//5

    vec4(1.22, 0.0, 0.0, 1.0),//6
    vec4(2.8, 0.0, 0.0, 1.0),//7
    vec4(2.8, 3.0, 0.0, 1.0),//8

    vec4(2.8, 0.7, 0.0, 1.0),//9
    vec4(3.8, 0.7, 0.0, 1.0),//10
    vec4(3.8, 1.5, 0.0, 1.0),//11

    vec4(3.8, 0.0, 0.0, 1.0),//12
    vec4(5.5, 0.0, 0.0, 1.0),//13

    //other side
    vec4(-0.5 ,0.0 ,2.0, 1.0 ),//14
    vec4(0.18, 0.0, 2.0, 1.0 ),//15
    vec4(0.18, 3.0, 2.0, 1.0),//16

    vec4(0.18, 0.5, 2.0, 1.0),//17
    vec4(1.22, 0.5, 2.0, 1.0),//18
    vec4(1.22, 3.0, 2.0, 1.0),//19

    vec4(1.22, 0.0, 2.0, 1.0),//20
    vec4(2.8, 0.0, 2.0, 1.0),//21
    vec4(2.8, 3.0, 2.0, 1.0),//22

    vec4(2.8, 0.5, 2.0, 1.0),//23
    vec4(3.8, 0.5, 2.0, 1.0),//24
    vec4(3.8, 1.5, 2.0, 1.0),//25

    vec4(3.8, 0.0, 2.0, 1.0),//26
    vec4(5.5, 0.0, 2.0, 1.0),//27
];

var thet=[
    vec4(0.0, 0.0, -1.0,1),
    vec4(0.0, 0.942809, 0.333333, 1),
    vec4(-0.816497, -0.471405, 0.333333, 1),
    vec4(0.816497, -0.471405, 0.333333,1),
];
//texture
var texture1, texture2;

var texCoord = [];


var cari=[0,0];
var wheeli=[0,0];
var worldi=[0,0];
var index=0;

var carID = 0;
var wheel1ID = 1;
var wheel2ID = 2;
var wheel3ID = 3;
var wheel4ID = 4;
var sceneId=5;
var worldID=6;


var numNodes = 7;
var numAngles = 11;
var angle = 0;

var theta = [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]];

var wheelDepth=0.5;
var wheelHight=0.5;
var wheelWidth=0.5;

var stack = [];

var figure = [];

for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);

var vBuffer;
var modelViewLoc;

var pointsArray = [];

//-------------------------------------------

function scale4(a, b, c) {
   var result = mat4();
   result[0] = a;
   result[5] = b;
   result[10] = c;
   return result;
}

//--------------------------------------------


function createNode(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}


function initNodes(Id) {

    var m = mat4();

    switch(Id) {
    
    case sceneId:
        eye=vec3(0,radius*Math.sin(anglec),radius*Math.cos(anglec))
        m=lookAt(eye,at,up)
        figure[sceneId] = createNode( m, scene, null, carID );
        break;

    case carID:

        m=mult(m,translate(15.5*Math.sin(theta[0][0]),15.5*Math.cos(theta[0][0]),0));
        m=mult(m,rotate(  180.0/Math.PI *theta[0][0]+8 ,[0,0,1]));
        figure[carID]=createNode(m,car,worldID,wheel1ID);
        break;

    case wheel1ID:
       // m=rotate(theta[0],[0,1,0]);
        figure[wheel1ID]=createNode(m,wheel1,wheel2ID,null);
        break;
    
    case wheel2ID:
        //m=rotate(theta[0],[0,1,0]);
        figure[wheel2ID]=createNode(m,wheel2,wheel3ID,null);
        break;
    
    case wheel3ID:
        //m=rotate(theta[0],[0,1,0]);
        figure[wheel3ID]=createNode(m,wheel3,wheel4ID,null);
        break;

    case wheel4ID:
        //m=rotate(theta[0],[0,1,0]);
        figure[wheel4ID]=createNode(m,wheel4,null,null);
        break;

    case worldID:
        figure[worldID]=createNode(m,world,null,null);
        break;
    }

    


}

function traverse(Id) {

   if(Id == null) return;
   stack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
   figure[Id].render();
   if(figure[Id].child != null) traverse(figure[Id].child);
    modelViewMatrix = stack.pop();
   if(figure[Id].sibling != null) traverse(figure[Id].sibling);
}

function scene() {

}

function car() {

    instanceMatrix = modelViewMatrix
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1i( gl.getUniformLocation(program,
        "uNode"), carID );
    gl.drawArrays(gl.TRIANGLES, cari[0], cari[1]-cari[0]);

}

function wheel1() {

    instanceMatrix = mult(modelViewMatrix, scale(wheelHight,wheelHight,wheelHight))
    instanceMatrix = mult(instanceMatrix, translate(6.5,0,0))
    instanceMatrix = mult(instanceMatrix, rotate(theta[1][0],[0,0,1]))
    
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1i( gl.getUniformLocation(program,
        "uNode"), wheel1ID );
    gl.drawArrays(gl.TRIANGLES, wheeli[0], wheeli[1]-wheeli[0]);
}

function wheel2() {

    instanceMatrix = mult(modelViewMatrix, scale(wheelHight,wheelHight,wheelHight))
    instanceMatrix = mult(instanceMatrix, translate(6.5,0,3.0))
    instanceMatrix = mult(instanceMatrix, rotate(theta[1][0],[0,0,1]))
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1i( gl.getUniformLocation(program,
        "uNode"), wheel1ID );
    gl.drawArrays(gl.TRIANGLES, wheeli[0], wheeli[1]-wheeli[0]);
}

function wheel3() {

    instanceMatrix = mult(modelViewMatrix, scale(wheelHight,wheelHight,wheelHight))
    instanceMatrix = mult(instanceMatrix, translate(1.4,0,0))
    instanceMatrix = mult(instanceMatrix, rotate(theta[1][0],[0,0,1]))
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1i( gl.getUniformLocation(program,
        "uNode"), wheel1ID );
     gl.drawArrays(gl.TRIANGLES, wheeli[0], wheeli[1]-wheeli[0]);
}

function wheel4() {
    instanceMatrix = mult(modelViewMatrix, scale(wheelHight,wheelHight,wheelHight))
    instanceMatrix = mult(instanceMatrix, translate(1.4,0,3.0))
    instanceMatrix = mult(instanceMatrix, rotate(theta[1][0],[0,0,1]))
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1i( gl.getUniformLocation(program,
        "uNode"), wheel1ID );
     gl.drawArrays(gl.TRIANGLES, wheeli[0], wheeli[1]-wheeli[0]);
}

function world() {
    instanceMatrix = mult(modelViewMatrix, scale(15,15,15))
    //instanceMatrix = mult(instanceMatrix, translate(0,-1.03,0))
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1i( gl.getUniformLocation(program,"uNode"), worldID );
     gl.drawArrays(gl.TRIANGLES, worldi[0], worldi[1]-worldi[0]);
}

function quad(a, b, c, d) {
     pointsArray.push(a);
     pointsArray.push(b);     
     pointsArray.push(c);

     pointsArray.push(b);     
     pointsArray.push(c);
     pointsArray.push(d);

     texCoord.push(vec2(0,0));
     texCoord.push(vec2(0,0));
     texCoord.push(vec2(0,0));

     texCoord.push(vec2(0,0));
     texCoord.push(vec2(0,0));
     texCoord.push(vec2(0,0));

     index=index+6
}

function tri(a, b, c) {
    pointsArray.push(a);
    pointsArray.push(b);
    pointsArray.push(c);
    texCoord.push(vec2(0,0));
    texCoord.push(vec2(0,0));
    texCoord.push(vec2(0,0));
    index=index+3

}

function drawCircle(a,b,c,n,depth,i,f){
    if (n==0){
        var a1=vec4(a[0],a[1],a[2]-depth,1)
        var b1=vec4(b[0],b[1],b[2]-depth,1)
        var c1=vec4(c[0],c[1],c[2]-depth,1)
      

        pointsArray.push(a);
        pointsArray.push(b);
        pointsArray.push(c);

        texCoord.push(vec2(0,i));
        texCoord.push(vec2(0,f));
        texCoord.push(vec2(0.5,0.5));

        pointsArray.push(a1);
        pointsArray.push(b1);
        pointsArray.push(c1);
        texCoord.push(vec2(0,i));
        texCoord.push(vec2(0,f));
        texCoord.push(vec2(0.5,0.5));

        pointsArray.push(a);
        pointsArray.push(a1);
        pointsArray.push(b1);
        pointsArray.push(b1);
        pointsArray.push(b);
        pointsArray.push(a);
        texCoord.push(vec2(0,0));
        texCoord.push(vec2(0,0));
        texCoord.push(vec2(0,0));
        texCoord.push(vec2(0,0));
        texCoord.push(vec2(0,0));
        texCoord.push(vec2(0,0));
        index=index+12
        return;
    }
    var ab= mult(0.5,add(a,b))//normalize(mult(0.5,add(a,b)),true);//

    ab[2]=0
    ab=normalize(ab,true)
    ab[2]=a[2]

    var j=n-1;
    drawCircle(a,ab,c,j,depth,i,f/2)
    drawCircle(b,ab,c,j,depth,f/2,f)
    return
}

function circle(center,a,b,c,d,n,depth){
    //var center=//mult( 1/3, add( vertices[a], add( vertices[b], vertices[c]) ));
    
    //tri(vertices[a],vertices[b],center)
    drawCircle(vertices[a],vertices[b],vertices[center],n,depth,0,1)
    drawCircle(vertices[b],vertices[c],vertices[center],n,depth,0,1)
    drawCircle(vertices[c],vertices[d],vertices[center],n,depth,0,1)
    drawCircle(vertices[d],vertices[a],vertices[center],n,depth,0,1)
}

function cilinder(center,a,b,c,d){
    var n=2; 
    var depth=0.5
    wheeli[0]=index;
 
    circle(center,a,b,c,d,n,depth);
    wheeli[1]=index;

}



function drawCar(c){
    cari[0]=index;
    tri(c[0],c[1],c[2]);

    tri(c[2],c[5],c[3]);
    tri(c[5],c[3],c[4]);

    tri(c[5],c[6],c[8]);
    tri(c[6],c[7],c[8]);

    tri(c[8],c[11],c[9]);
    tri(c[9],c[11],c[10]);

    tri(c[11],c[12],c[13]);
    
    //other side
    tri(c[0+14],c[1+14],c[2+14]);

    tri(c[2+14],c[5+14],c[3+14]);
    tri(c[5+14],c[3+14],c[4+14]);

    tri(c[5+14],c[6+14],c[8+14]);
    tri(c[6+14],c[7+14],c[8+14]);

    tri(c[8+14],c[11+14],c[9+14]);
    tri(c[9+14],c[11+14],c[10+14]);

    tri(c[11+14],c[12+14],c[13+14]);

    //corner
    quad(c[0],c[0+14],c[2],c[2+14]);

    quad(c[2],c[2+14],c[5],c[5+14]);

    quad(c[5],c[5+14],c[8],c[8+14]);

    quad(c[8],c[8+14],c[11],c[11+14]);

    quad(c[11],c[11+14],c[13],c[13+14]);

    quad(c[13],c[13+14],c[12],c[12+14]);

    quad(c[12],c[12+14],c[10],c[10+14]);

    quad(c[9],c[9+14],c[10],c[10+14]);

    quad(c[7],c[7+14],c[9],c[9+14]);

    quad(c[6],c[6+14],c[7],c[7+14]);

    quad(c[4],c[4+14],c[6],c[6+14]);

    quad(c[3],c[3+14],c[4],c[4+14]);

    quad(c[1],c[1+14],c[3],c[3+14]);

    quad(c[0],c[0+14],c[1],c[1+14]);
    cari[1]=index-1;
}



function triangle(a, b, c) {

    pointsArray.push(a);
    pointsArray.push(b);
    pointsArray.push(c);
    texCoord.push(vec2(0,0));
    texCoord.push(vec2(0,0));
    texCoord.push(vec2(0,0));
    // normals are vectors

    // normalsArray.push(vec4(a[0],a[1], a[2], 0.0));
    // normalsArray.push(vec4(b[0],b[1], b[2], 0.0));
    // normalsArray.push(vec4(c[0],c[1], c[2], 0.0));

    index += 3;
}


function divideTriangle(a, b, c, count) {
   if (count > 0) {

       var ab = mix( a, b, 0.5);
       var ac = mix( a, c, 0.5);
       var bc = mix( b, c, 0.5);

       ab = normalize(ab, true);
       ac = normalize(ac, true);
       bc = normalize(bc, true);

       divideTriangle(a, ab, ac, count - 1);
       divideTriangle(ab, b, bc, count - 1);
       divideTriangle(bc, c, ac, count - 1);
       divideTriangle(ab, bc, ac, count - 1);
   }
   else {
       triangle(a, b, c);
   }
}


function tetrahedron(a, b, c, d, n) {
   worldi[0]=index
   divideTriangle(a, b, c, n);
   divideTriangle(d, c, b, n);
   divideTriangle(a, d, b, n);
   divideTriangle(a, c, d, n);
   worldi[1]=index

}



function cube()
{
    cilinder(0,1,2,3,4);
    drawCar(carverticies);
    tetrahedron(thet[0],thet[1],thet[2],thet[3],8)
}

var image1 ;
var image2 ;
function configureTexture() {
    texture1 = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image1);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
        gl.NEAREST_MIPMAP_LINEAR);
   // gl.texParameteri(gl.TEXTURE_2D, gl.GL_TEXTURE_WRAP_S, gl.GL_CLAMP_TO_EDGE);
    texture2 = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
        gl.RGB, gl.UNSIGNED_BYTE, image2);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
        gl.NEAREST_MIPMAP_LINEAR);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.uniform1i(gl.getUniformLocation(program, "uTex0"), 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    gl.uniform1i(gl.getUniformLocation(program, "uTex1"), 1);
}


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    aspect =  canvas.width/canvas.height;
    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.enable(gl.DEPTH_TEST)
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader");

    gl.useProgram( program);

    instanceMatrix = mat4();

    projectionMatrix = perspective(fovy, aspect, near, far+15);//ortho(-10.0,10.0,-10.0, 10.0,-10.0,10.0);//
    modelViewMatrix = mat4();


    gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix)  );
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix)  );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix")

    cube();

    vBuffer = gl.createBuffer();


    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( positionLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( positionLoc );


    var tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoord), gl.STATIC_DRAW);




    image1 = document.getElementById("texImage1");
    image2 = document.getElementById("texImage2");

    var texCoordLoc = gl.getAttribLocation(program, "aTexCoord");
    gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texCoordLoc);

    configureTexture();


    document.getElementById("camera").oninput = function(event) {
        anglec= event.target.value*Math.PI /180;
        //alert(event.target.value)
        initNodes(sceneId);
    };

    document.getElementById("radius").oninput = function(event) {
        radius= event.target.value
        //alert(event.target.value)
        initNodes(sceneId);
    };

    for(i=0; i<numNodes; i++) initNodes(i);

    render();
}


var render = function() {
        theta[1][0]+=3;
        theta[0][0]+=0.01;

        initNodes(carID);
        initNodes(wheel1ID);
        initNodes(wheel2ID);
        initNodes(wheel3ID);
        initNodes(wheel4ID);
        gl.clear( gl.COLOR_BUFFER_BIT );
        traverse(sceneId);
        requestAnimationFrame(render);
}
