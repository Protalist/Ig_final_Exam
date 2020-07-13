"use strict";

var canvas;
var gl;
var program;

var projectionMatrix;
var modelViewMatrix;

var instanceMatrix;

var modelViewMatrixLoc;

var vertices = [

    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];

var cilindre = [
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

var thet=[

    
    vec4(0.0, 0.0, -1.0,1),
    vec4(0.0, 0.942809, 0.333333, 1),
    vec4(-0.816497, -0.471405, 0.333333, 1),
    vec4(0.816497, -0.471405, 0.333333,1),

    vec4( 0.5,  0.,  0.5, 1.0 ),//2
    vec4( 0.5,  0.,  -0.5, 1.0 ),//3
    vec4( -0.5, 0., 0.5, 1.0 ),//4
    vec4( -0.5,  0., -0.5, 1.0 ),//5
];

//draw

var cari=[0,0];
var wheeli=[0,0];
var worldi=[0,0];
var index=0;


//camera
var eye=vec3(0,0,0)
var at =vec3(0,0,0)
var up=vec3(0,1,0)
var radius = 60.0;
var anglec=25*Math.PI/180;

var projectionMatrixv=-1;

var near = 1.3;
var far = 60.0;
var  fovy = 90.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect;       // Viewport aspect ratio


//Iss
var torsoId = 0;
var headId  = 1;

var leftUpperArmId = 2;
var leftLowerArmId = 3;
var rightUpperArmId = 4;
var rightLowerArmId = 5;
var leftUpperLegId = 6;
var leftLowerLegId = 7;
var rightUpperLegId = 8;
var rightLowerLegId = 9;
var neckId=10;
var handLeftId=11;
var hadnRightId=12;
var feetRightId=13;
var feetLeftId=14;
var leftFeetId=15;
var rightFeetId=16;

var planeId=17;

var vStickId=18;
var oStickId=19;
var sackId=20

var sceneId=21;

var torsoHeight    = 8.0;
var torsoWidth     = 3.5;

var upperArmHeight = 3.2;
var upperArmWidth  = 1.2;

var lowerArmHeight = 3.0;
var lowerArmWidth  = 1.2;

var upperLegWidth  = 1.3;
var upperLegHeight = 3.8;

var lowerLegWidth  = 1.3;
var lowerLegHeight = 3.0;

var feetWidth      = 1.3; 
var feetHeight     = 1.2;
var feetdepht      = 2;

var handWidth      = 1.0; 
var handHeight     = 1.0;
var handdepht      = 1.0;

var vStickWidth=1.0;
var vStickHeight=25.0;
var vStickDepth=1.0;

var oStickWidth=1.0;
var oStickHeight=1.0;
var oStickDepth=5.0;

var sackWidth=2.0;
var sackHight=2.0;
var sackDepth=25.0;


var headHeight = 2.5;
var headWidth = 2.0;

var numNodes = 22;

var numAngles = 11;
var angle = 0;

var theta = [
             [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],
             [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],
             [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],
             [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],
             [0,0,0],[0,0,0],[0,0,0],[0,0,0],
            ]
theta[rightUpperArmId][0]=90
theta[leftUpperArmId][0]=95

theta[rightLowerArmId][0]=-90
theta[leftLowerArmId][0]=-90

theta[leftFeetId][0]=-7
theta[rightFeetId][0]=-15

theta[leftUpperLegId][0]=180

theta[rightUpperLegId][0]=180
theta[rightLowerLegId][0]=0

theta[sackId][0]=0;

var numVertices = 24;

var stack = [];

var figure = [];

for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);

var vBuffer;
var modelViewLoc;

var pointsArray = [];
//texture
var texture1, texture2;

var texCoord = [];

//Light
    //normal array
var normalsArray=[];

//animation
var matrixSack;
var matrixRightPounch;
var matrixLeftPounch;

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
        eye=vec3(radius*Math.sin(anglec),0,radius*Math.cos(anglec))
        m=lookAt(eye,at,up)
        figure[sceneId] = createNode( m, scene, null, torsoId );
        break;
        
    case planeId:

        //m = rotate(theta[torsoId], vec3(0, 1, 0) );
        figure[planeId] = createNode( m, plane, vStickId, null );
        break;
    
    case torsoId:
        m = mult(m,translate(0,0,3));
        m = mult(m,rotate(theta[torsoId][0], vec3(0, 1, 0) ));
        figure[torsoId] = createNode( m, torso, planeId, headId );
        break;

    case headId:


        m = translate(0.0, torsoHeight+0.5*headHeight, 0.0);
        m = mult(m, rotate(theta[headId][0], vec3(1, 0, 0)))
        m = mult(m, rotate(theta[headId][0], vec3(0, 1, 0)));
        m = mult(m, translate(0.0, -0.5*headHeight, 0.0));
        figure[headId] = createNode( m, head, leftUpperArmId, null);
    break;


    case leftUpperArmId:

        m = translate(-(torsoWidth/2+upperArmWidth*0.7), 0.95*torsoHeight, 0.0);
        m = mult(m, rotate(theta[leftUpperArmId][0], vec3(1, 0, 0)));
        figure[leftUpperArmId] = createNode( m, leftUpperArm, rightUpperArmId, leftLowerArmId );
    break;

    case rightUpperArmId:

        m = translate((torsoWidth/2+upperArmWidth*0.7), 0.95*torsoHeight, 0.0);
        m = mult(m, rotate(theta[rightUpperArmId][0], vec3(1, 0, 0)));
        figure[rightUpperArmId] = createNode( m, rightUpperArm, leftUpperLegId, rightLowerArmId );
    break;

    case leftUpperLegId:

        m = translate(-(torsoWidth/4+upperLegWidth*0.3), -0.05*upperLegHeight, 0.0);
        m = mult(m , rotate(theta[leftUpperLegId][0], vec3(1, 0, 0)));
        figure[leftUpperLegId] = createNode( m, leftUpperLeg, rightUpperLegId, leftLowerLegId );
    break;

    case rightUpperLegId:

        m = translate(torsoWidth/4+upperLegWidth*0.3, -0.05*upperLegHeight, 0.0);
        m = mult(m, rotate(theta[rightUpperLegId][0], vec3(1, 0, 0)));
        figure[rightUpperLegId] = createNode( m, rightUpperLeg, null, rightLowerLegId );
        break;

    case leftLowerArmId:

        m = translate(0.0, upperArmHeight, 0.0);
        m = mult(m, rotate(theta[leftLowerArmId][0], vec3(1, 0, 0)));
        m = mult(m, rotate(15, vec3(0, 0, 1)));
        figure[leftLowerArmId] = createNode( m, leftLowerArm, null, handLeftId );
        break;
    
    case handLeftId:

        m = translate(0.0, lowerArmHeight+handHeight/2, 0.0);
        
        figure[handLeftId] = createNode( m, handLeft, null, null );
        break;
    
    case hadnRightId:

        m = translate(0.0, lowerArmHeight+handHeight/2, 0.0);
        figure[hadnRightId] = createNode( m, hadnRight, null, null );
        break

    case rightLowerArmId:

        m = translate(0.0, upperArmHeight, 0.0);
        m = mult(m, rotate(theta[rightLowerArmId][0], vec3(1, 0, 0)));
        m = mult(m, rotate(-15, vec3(0, 0, 1)));
        figure[rightLowerArmId] = createNode( m, rightLowerArm, null, hadnRightId );
        break;

    case leftLowerLegId:

        m = translate(0.0, upperLegHeight, 0.0);
        m = mult(m, rotate(theta[leftLowerLegId][0],vec3(1, 0, 0)));
        figure[leftLowerLegId] = createNode( m, leftLowerLeg, null, leftFeetId );
        break;

    case rightLowerLegId:

        m = translate(0.0, upperLegHeight, 0.0);
        m = mult(m, rotate(theta[rightLowerLegId][0], vec3(1, 0, 0)));
        figure[rightLowerLegId] = createNode( m, rightLowerLeg, null, rightFeetId );
        break;

    case leftFeetId:
        m = translate(0.0, lowerLegHeight,  feetdepht*0.2);
        figure[leftFeetId]=createNode(m,leftFeet,null,null)
        break;
    
    case rightFeetId:
        m = translate(0.0, lowerLegHeight, feetdepht*0.2);
        figure[rightFeetId]=createNode(m,rightFeet,null,null)
        break;
    
    case vStickId:
        m = mult(m, translate(0, -(upperLegHeight+lowerLegHeight+feetHeight-vStickHeight/2), -10));
        figure[vStickId]=createNode(m,verticalStick,null,oStickId)
        break;
    
    case oStickId:
        m = mult(m, translate(0, (vStickHeight/2), oStickDepth/2));
        figure[oStickId]=createNode(m,orizontaStick,null,sackId)
        break;

    case sackId:
        m = mult(m, rotate(-90, vec3(1, 0, 0)));
        m = mult(m, translate(0, (sackHight), oStickDepth/2));
        m = mult(m, rotate(dingding*Math.sin(radians(theta[sackId][0])),[1,0,0]));
 
        figure[sackId]=createNode(m,sack,null,null)
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

function torso() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*torsoHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale( torsoWidth, torsoHeight, torsoWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1i( gl.getUniformLocation(program,"uNode"), torsoId );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function head() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale(headWidth, headHeight, headWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1i( gl.getUniformLocation(program,"uNode"), headId );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1i( gl.getUniformLocation(program,"uNode"), leftUpperArmId );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1i( gl.getUniformLocation(program,"uNode"), leftLowerArmId );
     for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(upperArmWidth, upperArmHeight, upperArmWidth) );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
  gl.uniform1i( gl.getUniformLocation(program,"uNode"), rightUpperArmId );
  for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1i( gl.getUniformLocation(program,"uNode"), rightLowerArmId );
  for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function  leftUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1i( gl.getUniformLocation(program,"uNode"), leftUpperLegId );
   for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate( 0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(lowerLegWidth, lowerLegHeight, lowerLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1i( gl.getUniformLocation(program,"uNode"), leftLowerLegId );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1i( gl.getUniformLocation(program,"uNode"), rightUpperLegId );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(lowerLegWidth, lowerLegHeight, lowerLegWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1i( gl.getUniformLocation(program,"uNode"), rightLowerLegId );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightFeet() {

  //  instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(modelViewMatrix, scale(feetWidth, feetHeight,feetdepht) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1i( gl.getUniformLocation(program,"uNode"), rightFeetId );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftFeet() {

    //instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(modelViewMatrix, scale(feetWidth, feetHeight, feetdepht) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1i( gl.getUniformLocation(program,"uNode"), leftFeetId );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function handLeft() {

    instanceMatrix = mult(modelViewMatrix, scale(handWidth,handHeight, handdepht) )
    matrixLeftPounch=instanceMatrix;
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1i( gl.getUniformLocation(program,"uNode"), handLeftId );
    gl.drawArrays(gl.TRIANGLES, worldi[0], worldi[1]-worldi[0]);
}


function hadnRight() {

    instanceMatrix = mult(modelViewMatrix, scale(handWidth,handHeight, handdepht) )
    matrixRightPounch=instanceMatrix;
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1i( gl.getUniformLocation(program,"uNode"), hadnRightId );
    gl.drawArrays(gl.TRIANGLES, worldi[0], worldi[1]-worldi[0]);
}

function plane() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, -(upperLegHeight+lowerLegHeight+feetHeight/2), 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(20, 1, 20) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1i( gl.getUniformLocation(program,"uNode"), planeId );
    gl.drawArrays(gl.TRIANGLE_FAN, 4*2, 4);
}


function verticalStick() {

    //instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0 ,0.0) );
    instanceMatrix = mult(modelViewMatrix, scale(vStickWidth, vStickHeight, vStickDepth) )
    
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1i( gl.getUniformLocation(program,"uNode"), planeId );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function orizontaStick() {

    //instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0 ,0.0) );
    instanceMatrix = mult(modelViewMatrix, scale(oStickWidth, oStickHeight, oStickDepth) )
    
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1i( gl.getUniformLocation(program,"uNode"), planeId );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}


function sack() {

    instanceMatrix = mult(modelViewMatrix, scale(sackWidth,sackHight,sackDepth))
    matrixSack=instanceMatrix
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1i( gl.getUniformLocation(program,
        "uNode"), sackId );
    gl.drawArrays(gl.TRIANGLES, wheeli[0], wheeli[1]-wheeli[0]);
}


function quad(a, b, c, d) {
     pointsArray.push(vertices[a]);
     pointsArray.push(vertices[b]);
     pointsArray.push(vertices[c]);
     pointsArray.push(vertices[d]);
    

     texCoord.push(vec2(0,0));
     texCoord.push(vec2(0,1));
     texCoord.push(vec2(1,1));
     texCoord.push(vec2(1,0));

     var t1 = subtract(vertices[c], vertices[a]);
     var t2 = subtract(vertices[b], vertices[a]);
     var normal = cross(t1,t2);
 
     normalsArray.push(vec4(normal[0], normal[1], normal[2], 0.0));
     normalsArray.push(vec4(normal[0], normal[1], normal[2], 0.0));
     normalsArray.push(vec4(normal[0], normal[1], normal[2], 0.0));
     normalsArray.push(vec4(normal[0], normal[1], normal[2], 0.0));

     index+=4

}
function triangle(a, b, c) {

    pointsArray.push(a);
    pointsArray.push(b);
    pointsArray.push(c);
    texCoord.push(vec2(a[0],a[1]));
    texCoord.push(vec2(a[0],a[1]));
    texCoord.push(vec2(a[0],a[1]));
    //normals are vectors

    normalsArray.push(vec4(a[0],a[1], a[2], 0.0));
    normalsArray.push(vec4(b[0],b[1], b[2], 0.0));
    normalsArray.push(vec4(c[0],c[1], c[2], 0.0));

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


        normalsArray.push(vec4(a[0], b[1], c[2], 0.0));
        normalsArray.push(vec4(a[0], b[1], c[2], 0.0));
        normalsArray.push(vec4(a[0], b[1], c[2], 0.0));
        
        pointsArray.push(a1);
        pointsArray.push(b1);
        pointsArray.push(c1);

        texCoord.push(vec2(0,i));
        texCoord.push(vec2(0,f));
        texCoord.push(vec2(0.5,0.5));
    
        normalsArray.push(vec4(a1[0], b1[1], c1[2], 0.0));
        normalsArray.push(vec4(a1[0], b1[1], c1[2], 0.0));
        normalsArray.push(vec4(a1[0], b1[1], c1[2], 0.0));

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

        var t1 = subtract(a, b1);
        var t2 = subtract(a, a1);
        var normal = cross(t1,t2);
    
        normalsArray.push(vec4(normal[0], normal[1], normal[2], 0.0));
        normalsArray.push(vec4(normal[0], normal[1], normal[2], 0.0));
        normalsArray.push(vec4(normal[0], normal[1], normal[2], 0.0));


        normalsArray.push(vec4(normal[0], normal[1], normal[2], 0.0));
        normalsArray.push(vec4(normal[0], normal[1], normal[2], 0.0));
        normalsArray.push(vec4(normal[0], normal[1], normal[2], 0.0));

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
    drawCircle(cilindre[a],cilindre[b],cilindre[center],n,depth,0,1)
    drawCircle(cilindre[b],cilindre[c],cilindre[center],n,depth,0,1)
    drawCircle(cilindre[c],cilindre[d],cilindre[center],n,depth,0,1)
    drawCircle(cilindre[d],cilindre[a],cilindre[center],n,depth,0,1)
}

function cilinder(center,a,b,c,d){
    var n=2; 
    var depth=0.5
    wheeli[0]=index;
 
    circle(center,a,b,c,d,n,depth);
    wheeli[1]=index;

}



function cube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );

    cilinder(0,1,2,3,4);

    tetrahedron(thet[0],thet[1],thet[2],thet[3],8)

}



var image1 ;
var image2 ;
var texSize=255;
function configureTexture() {
    texture1 = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image1);
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
    image1 = document.getElementById("texImage1");
    image2 = document.getElementById("texImage2");

    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.enable(gl.DEPTH_TEST)
    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader");

    gl.useProgram( program);

    instanceMatrix = mat4();

    projectionMatrix =  perspective(fovy, aspect, near, far+15);//ortho(-40.0,40.0,-40.0, 40.0,-40.0,40.0); //
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

    var texCoordLoc = gl.getAttribLocation(program, "aTexCoord");
    gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texCoordLoc);

    configureTexture();



    document.getElementById("camera").oninput = function(event) {
        anglec= event.target.value*Math.PI /180;

        initNodes(sceneId);
    };

    document.getElementById("radius").oninput = function(event) {
        radius= event.target.value
        initNodes(sceneId);
    };

    for(i=0; i<numNodes; i++) {initNodes(i);}

    render();
}


var then=0;
var count=270;
var animationId=0;


var decreas= false

var render = function(now) {
   
    now *= 0.001;
        
    then = now;
    if(dingding>0){
        theta[sackId][0]=(theta[sackId][0]-0.5)%360
        console.log(dingding<5.0)
        if(dingding<5.0 ){
            dingding=0
        }
        //console.log()
        if( dingding*Math.sin(radians(theta[sackId][0]))<=dingding+0.1 && dingding*Math.sin(radians(theta[sackId][0]))>=dingding-0.1){
            decreas= true
        }

        if( dingding*Math.sin(radians(theta[sackId][0]))>=-dingding-0.1 && dingding*Math.sin(radians(theta[sackId][0]))<=-dingding+0.1){
            decreas= true
        }
        //console.log(dingding-45*Math.sin(radians(theta[sackId][0])))

        if(decreas && Math.sin(radians(theta[sackId][0]))<=0.1 && Math.sin(radians(theta[sackId][0]))>=-0.1){
            dingding=dingding/1.5
            console.log(dingding)
            decreas= false
        }

       
    }
    if(animationId==1){
        
        requestAnimationFrame(rightPunch)
    }else{

    for(i=0; i<numNodes; i++) {initNodes(i);}
        gl.clear( gl.COLOR_BUFFER_BIT );
        traverse(sceneId);
        requestAnimationFrame(render);
    }
}

var distance=function(a,b){
    var x=(a[0]-b[0])*(a[0]-b[0]);
    var y=(a[1]-b[1])*(a[1]-b[1]);
    var z=(a[2]-b[2])*(a[2]-b[2]);
    return Math.sqrt(x+z)
}
var coincideRight=function(){
    //vertices
    var punch=[];
    var sack=[];
    for (var i =0; i < vertices.length;i++){
        punch.push(mult(matrixRightPounch,vertices[i]));
        sack.push(mult(matrixSack,vertices[i]));
    }
    
    for (var i=0; i< punch.length;i++){
        for(var j=0; j< sack.length;j++){
            // console.log(distance(punch[i],sack[j]))
            if(distance(punch[i],sack[j])<0.6){
                return true;
            }
        }
    }
    return false;
}

var dingding=0;
var hit=false;

var rightPunch=function(now){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST)
    traverse(sceneId);
    // Convert the time to seconds
    now *= 0.001;
    // Subtract the previous time from the current time
    var deltaTime = now - then;
    // Remember the current time for the next frame.
    then = now;
    var speed=25*deltaTime //space at frame
    var next=false;
    if(count<=270 && count >=180){
        theta[rightUpperArmId][0]=(theta[rightUpperArmId][0]+speed)%360
     }
    
    else if(count<=180 && count >=90){
        theta[rightUpperArmId][0]=(theta[rightUpperArmId][0]-speed)%360
        theta[rightLowerArmId][0]=(theta[rightLowerArmId][0]+speed)%360
     }
    else if(count <=90 && count >=0){
        theta[rightLowerArmId][0]=(theta[rightLowerArmId][0]-speed)%360
     }
    else{
       next=true
    }

    count-= speed
    
    if(coincideRight() && hit==false){
        console.log("ding ding")
        hit=true;
        dingding=45
        // if(theta[sackId][0]>90 &&theta[sackId][0]<180  ){
        //     theta[sackId][0]=(theta[sackId][0]+270)%360
        // }
        // if(theta[sackId][0]>180 &&theta[sackId][0]<270  ){
        //     theta[sackId][0]=(theta[sackId][0]+90)%360
        // }
    }

 
    for(i=0; i<numNodes; i++) {initNodes(i);}

    if(!next){ 
        requestAnimationFrame(render)
    }else{
        animationId=0;
        count=270
        hit=false
        requestAnimationFrame(render)
    }
}