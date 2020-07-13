"use strict";

var canvas;
var gl;
var program;

var projectionMatrix;
var modelViewMatrix;

var instanceMatrix;

var modelViewMatrixLoc;

var vertices = [

    vec4( -0.5, -0.5,  0.5, 1.0 ),//0
    vec4( -0.5,  0.5,  0.5, 1.0 ),//1
    vec4( 0.5,  0.5,  0.5, 1.0 ),//2
    vec4( 0.5, -0.5,  0.5, 1.0 ),//3
    vec4( -0.5, -0.5, -0.5, 1.0 ),//4
    vec4( -0.5,  0.5, -0.5, 1.0 ),//5
    vec4( 0.5,  0.5, -0.5, 1.0 ),//6
    vec4( 0.5, -0.5, -0.5, 1.0 )//7
];

//texture
var texture1, texture2;

var texCoord = [];

//camera
var eye=vec3(0,0,0)
var at =vec3(0,0,0)
var up=vec3(0,1,0)
var radius = 50.0;
var anglec=25*Math.PI/180;

var projectionMatrixv=-1;

var near = 1.3;
var far = 60.0;
var  fovy = 90.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect;       // Viewport aspect ratio

var torsoId = 0;
var headId  = 1;
var head1Id = 1;
var head2Id = 1;
var leftUpperArmId = 2;
var leftLowerArmId = 3;
var rightUpperArmId = 4;
var rightLowerArmId = 5;
var leftUpperLegId = 6;
var leftLowerLegId = 7;
var rightUpperLegId = 8;
var rightLowerLegId = 9;
var tailId=10;
var sceneId=15;

var bodyTrheeId=11;
var leaf1TrheeId=12;
var leaf2TrheeId=13;
var leaf3TrheeId=14;

var torsoHeight = 3.0;
var torsoWidth = 4.0;
var torsoDeep=8.0;

var upperArmHeight = 1.5;
var upperArmWidth  = 0.7;

var lowerArmHeight = 1.0;
var lowerArmWidth  = 0.7;

var upperLegHeight = 1.5;
var upperLegWidth  = 0.7;

var lowerLegHeight = 1.0;
var lowerLegWidth  = 0.7;

var headHeight = 1.5;
var headWidth = 3.0;

var tailHeight=0.5;
var tailWidth=0.5;


var bodyTrheeHeight=20;
var bodyTrheeWeight=4;

var leaf1TrheeHeight=4;
var leaf1TrheeWeight=20;

var leaf2TrheeHeight=4;
var leaf2TrheeWeight=leaf1TrheeWeight-leaf1TrheeWeight/4;

var leaf3TrheeHeight=4;
var leaf3TrheeWeight=leaf2TrheeWeight-leaf2TrheeWeight/4;

var numNodes = 16;
var numAngles = 11;
var angle = 0;

var  theta = [[90,0,0], [0,0], [180,0], [0,0], [180,0], [0,0], [180,0], [0,0], [180,0], [0,0], [0,0]];

var numVertices = 24;

var stack = [];

var figure = [];


//animation
var walking=false

var torsoRadius=20;
var translateV=[[[0,0,0]]]
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
        figure[sceneId] = createNode( m, scene, null, bodyTrheeId );
        break;

    case torsoId:
    
    m = rotate(theta[torsoId][0], vec3(0, 1, 0) );
    m = mult(m,translate(torsoRadius, 0.0,0.0));
    m= mult(m ,   rotate(theta[torsoId][1], vec3(0, 1, 0) ))
    m= mult(m ,   rotate(theta[torsoId][2], vec3(1, 0, 0) ))
    m=mult(m, translate(
        translateV[torsoId][0][0],
        translateV[torsoId][0][1],
        translateV[torsoId][0][2],
        ))
    figure[torsoId] = createNode( m, torso, null, headId );
    break;

    
    case headId:
        case head1Id:
        case head2Id:
    
    
        m = translate(0.0, 0.5 * torsoHeight, 0.6 * torsoDeep);
          m = mult(m, rotate(theta[head1Id][0], vec3(1, 0, 0)))
          m = mult(m, rotate(theta[head2Id][0], vec3(0, 1, 0)));
        m = mult(m, translate(0.0, -0.5*headHeight, 0.0));
        figure[headId] = createNode( m, head, leftUpperArmId, null);
        break;
    
    
        case leftUpperArmId:
    
        m = translate(-(0.5 * torsoWidth), 0.1*torsoHeight, 0.4 * torsoDeep);
        m = mult(m, rotate(theta[leftUpperArmId][0], vec3(1, 0, 0)));
        m = mult(m, translate(0.0,theta[leftUpperArmId][1], 0.0));
        figure[leftUpperArmId] = createNode( m, leftUpperArm, rightUpperArmId, leftLowerArmId );
        break;
    
        case rightUpperArmId:
    
        m = translate(0.5*torsoWidth, 0.1*torsoHeight, 0.4 * torsoDeep);
          m = mult(m, rotate(theta[rightUpperArmId][0], vec3(1, 0, 0)));
          m = mult(m, translate(0.0,theta[rightUpperArmId][1], 0.0));
        figure[rightUpperArmId] = createNode( m, rightUpperArm, leftUpperLegId, rightLowerArmId );
        break;
    
        case leftUpperLegId:
    
        m = translate(-(0.5*torsoWidth), 0.1*upperLegHeight, - 0.4 * torsoDeep);
          m = mult(m , rotate(theta[leftUpperLegId][0], vec3(1, 0, 0)));
          m = mult(m, translate(0.0,theta[leftUpperLegId][1], 0.0));
        figure[leftUpperLegId] = createNode( m, leftUpperLeg, rightUpperLegId, leftLowerLegId );
        break;
    
        case rightUpperLegId:
    
        m = translate(0.5*torsoWidth, 0.1*upperLegHeight, - 0.4 * torsoDeep);
          m = mult(m, rotate(theta[rightUpperLegId][0], vec3(1, 0, 0)));
          m = mult(m, translate(0.0,theta[rightUpperLegId][1], 0.0));
        figure[rightUpperLegId] = createNode( m, rightUpperLeg, tailId, rightLowerLegId );
        break;
    
        case tailId:
            m=translate(0, 0.5*torsoHeight, -0.5*torsoDeep)
            figure[tailId] = createNode( m, tail, null, null );
            break;

        case leftLowerArmId:
    
        m = translate(0.0, upperArmHeight, 0.0);
        m = mult(m, rotate(theta[leftLowerArmId][0], vec3(1, 0, 0)));
        figure[leftLowerArmId] = createNode( m, leftLowerArm, null, null );
        break;
    
        case rightLowerArmId:
    
        m = translate(0.0, upperArmHeight, 0.0);
        m = mult(m, rotate(theta[rightLowerArmId][0], vec3(1, 0, 0)));
        figure[rightLowerArmId] = createNode( m, rightLowerArm, null, null );
        break;
    
        case leftLowerLegId:
    
        m = translate(0.0, upperLegHeight, 0.0);
        m = mult(m, rotate(theta[leftLowerLegId][0],vec3(1, 0, 0)));
        figure[leftLowerLegId] = createNode( m, leftLowerLeg, null, null );
        break;
    
        case rightLowerLegId:
    
        m = translate(0.0, upperLegHeight, 0.0);
        m = mult(m, rotate(theta[rightLowerLegId][0], vec3(1, 0, 0)));
        figure[rightLowerLegId] = createNode( m, rightLowerLeg, null, null );
        break;
    
        case bodyTrheeId:
        m = translate(0.0,  bodyTrheeHeight/2-torsoHeight/2-upperArmHeight/2, 0.0);
        figure[bodyTrheeId] = createNode( m, bodyTrhee, torsoId, leaf1TrheeId );
        break;
    
        case leaf1TrheeId:
            m = translate(0.0, bodyTrheeHeight/2, 0.0);
            figure[leaf1TrheeId] = createNode( m, leaf1Trhee, null, leaf2TrheeId );
        break;
        case leaf2TrheeId:
            m = translate(0.0, leaf2TrheeHeight, 0.0);
            figure[leaf2TrheeId] = createNode( m, leaf2Trhee, null, leaf3TrheeId );
        break;
        case leaf3TrheeId:
            m = translate(0.0, leaf3TrheeHeight, 0.0);
            figure[leaf3TrheeId] = createNode( m, leaf3Trhee, null, null );
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
    instanceMatrix = mult(instanceMatrix, scale( torsoWidth, torsoHeight, torsoDeep));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1i( gl.getUniformLocation(program,
        "uNode"), torsoId );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function head() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale(headWidth, headHeight, headWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1i( gl.getUniformLocation(program,
        "uNode"), head1Id );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1i( gl.getUniformLocation(program,
        "uNode"), leftUpperArmId );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1i( gl.getUniformLocation(program,
        "uNode"), leftLowerArmId );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(upperArmWidth, upperArmHeight, upperArmWidth) );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
  gl.uniform1i( gl.getUniformLocation(program,
    "uNode"), rightUpperArmId );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1i( gl.getUniformLocation(program,
        "uNode"), rightLowerArmId );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function  leftUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1i( gl.getUniformLocation(program,
        "uNode"), leftUpperLegId );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate( 0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(lowerLegWidth, lowerLegHeight, lowerLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1i( gl.getUniformLocation(program,
        "uNode"), leftLowerLegId );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1i( gl.getUniformLocation(program,
        "uNode"), rightUpperLegId );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(lowerLegWidth, lowerLegHeight, lowerLegWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1i( gl.getUniformLocation(program,
        "uNode"), rightLowerLegId );
   for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function tail() {
    instanceMatrix = mult(modelViewMatrix, scale(tailWidth, tailHeight, tailWidth+1) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1i( gl.getUniformLocation(program,
        "uNode"), tailId );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function bodyTrhee() {
    instanceMatrix = mult(modelViewMatrix, scale(bodyTrheeWeight, bodyTrheeHeight, bodyTrheeWeight) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1i( gl.getUniformLocation(program,
        "uNode"), bodyTrheeId );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leaf1Trhee() {
	instanceMatrix = mult(modelViewMatrix, scale(leaf1TrheeWeight, leaf1TrheeHeight, leaf1TrheeWeight) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1i( gl.getUniformLocation(program,
        "uNode"), leaf1TrheeId );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leaf2Trhee() {
	instanceMatrix = mult(modelViewMatrix, scale(leaf2TrheeWeight, leaf2TrheeHeight, leaf2TrheeWeight) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1i( gl.getUniformLocation(program,
        "uNode"), leaf2TrheeId );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leaf3Trhee() {
	instanceMatrix = mult(modelViewMatrix, scale(leaf3TrheeWeight, leaf3TrheeHeight, leaf3TrheeWeight) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.uniform1i( gl.getUniformLocation(program,
        "uNode"), leaf3TrheeId );
   for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}


function fAngle(v1,v2){
    var num=dot(v1,v2);
    var dv1=0;
    var dv2=0;
    for (var i=0; i <v1.length;i++){
        dv1=dv1+v1[i]*v1[i];
        dv2=dv2+v2[i]*v2[i];
    }
    return  Math.acos((num)/(Math.sqrt(dv2)*Math.sqrt(dv1)))
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
    
    



}



function cube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );




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

    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.enable(gl.DEPTH_TEST)
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //


    image1 = document.getElementById("texImage1");
    image2 = document.getElementById("texImage2");

   
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



        document.getElementById("slider0").onchange = function(event) {
        theta[torsoId ][0] = event.target.value;
        initNodes(torsoId);
    };
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

    document.getElementById("projectionMatrix").onclick = function(event) {
        projectionMatrixv=projectionMatrixv*-1

        initNodes(sceneId);
    };
    

    document.getElementById("animation").onclick = function(event) {
        walking=!walking;
        //alert(event.target.value)
        //initNodes(sceneId);
    };

    for(i=0; i<numNodes; i++) initNodes(i);

    render();
}

var count=0;
var count2=0;
var then=0;
var degree=90;
var animationId=0;
var direction=1;

var tp0=translateV[torsoId][0][2];

var render = function(now) {
    if(projectionMatrixv==1){
        projectionMatrix =  perspective(fovy, aspect, near, far+15);//

    }else{
        projectionMatrix=ortho(-40.0,40.0,-40.0, 40.0,0.0,100.0); //
    }

    gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix)  );
        gl.clear( gl.COLOR_BUFFER_BIT );
        gl.enable(gl.DEPTH_TEST)
        traverse(sceneId);
        now *= 0.001;
        
        then = now;

        //legsAnimation2(0.01)
        if(walking){
            console.log(animationId)
            if(animationId==0){
                animationId++;
                count=0
                requestAnimationFrame(animation1);
            }
            else if(animationId==1){
                animationId++;

                count=90
                direction=1    
                requestAnimationFrame(rotation)
            }
            else if(animationId==2){
                animationId++;

                count=torsoWidth*1.3
                direction=1    
                requestAnimationFrame(moveRight)
            }
            else if(animationId==3){
                animationId++;

                count=180
                direction=1    
                requestAnimationFrame(rotation)
            }
            else if(animationId==4){
                animationId++;
                count=90
                direction=1   
                tp0=translateV[torsoId][0][2]; 
                requestAnimationFrame(horizontal)
            }
            else if(animationId==5){
                animationId++;

                count=360*4
                direction=1    
                tp0=translateV[torsoId][0][2];
                requestAnimationFrame(scratchBack)
            }
            else if(animationId==6){
                animationId++;

                count=-90
                direction=-1    
                tp0=translateV[torsoId][0][2];
                requestAnimationFrame(horizontal)
            }

            else if(animationId==7){
                animationId++;

                count=20
                direction=-1    
                requestAnimationFrame(moveRight)
            }

            else if(animationId==8){
                animationId++;

                count=90
                direction=1    
                requestAnimationFrame(rotation)
            }
            
            else{
                walking=false
                animationId=0;
                count=0;
                torsoRadius=20;

                translateV=[[[0,0,0]]]
                requestAnimationFrame(render)
            }

        }
        else{

            requestAnimationFrame(render)
        }
}

//simulte the run of the bear not used in this file
var legsAnimation2= function(deltaTime){
    var angle=count2/(10*1.5)%365;
    theta[leftUpperArmId][0]+=30* Math.cos(angle)+178
    theta[rightUpperArmId][0]+=30* Math.cos(angle)+168

    theta[leftLowerArmId][0]+=15* Math.cos(angle)+10
    theta[rightLowerArmId][0]+=15* Math.cos(angle)+10

    theta[leftUpperLegId][0]+=30* Math.sin(angle)+178
    theta[rightUpperLegId][0]+=30* Math.sin(angle)+168

    theta[leftLowerLegId][0]+=15* Math.cos(angle)-10
    theta[rightLowerLegId][0]+=15* Math.cos(angle)-10

    initNodes(rightUpperArmId);
    initNodes(leftUpperArmId);
    initNodes(leftLowerArmId);
    initNodes(rightLowerArmId);
    initNodes(rightUpperLegId);
    initNodes(leftUpperLegId);
    initNodes(leftLowerLegId);
    initNodes(rightLowerLegId);
    count2+=50*deltaTime;
}

var legsAnimation= function(deltaTime,speed){
    var angle=count2/(10*1.5)%365;
    theta[leftUpperArmId][0]=45* Math.cos(angle)+178
    theta[rightUpperArmId][0]=-45* Math.cos(angle)+168

    theta[leftLowerArmId][0]=10* Math.sin(angle)+20
    theta[rightLowerArmId][0]=10* Math.sin(angle)+20

    theta[leftUpperLegId][0]=45* Math.cos(angle)+178
    theta[rightUpperLegId][0]=-45* Math.cos(angle)+168

    theta[leftLowerLegId][0]=10* Math.cos(angle)-20
    theta[rightLowerLegId][0]=10* Math.cos(angle)-20

    initNodes(rightUpperArmId);
    initNodes(leftUpperArmId);
    initNodes(leftLowerArmId);
    initNodes(rightLowerArmId);
    initNodes(rightUpperLegId);
    initNodes(leftUpperLegId);
    initNodes(leftLowerLegId);
    initNodes(rightLowerLegId);
    count2+=speed;
}


var animation1=function(now){
    
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
    legsAnimation(deltaTime, speed*2)
    if(count<90){
        theta[torsoId][0]=(speed+theta[torsoId][0])%360;
        initNodes(torsoId);
        //alert(deltaTime)
        count+=speed;
        requestAnimationFrame(animation1);
    }
    else{
        theta[leftUpperArmId][0]=180
        theta[rightUpperArmId][0]=180
    
        theta[leftLowerArmId][0]=0
        theta[rightLowerArmId][0]=0
    
        theta[leftUpperLegId][0]=180
        theta[rightUpperLegId][0]=180
    
        theta[leftLowerLegId][0]=0
        theta[rightLowerLegId][0]=0
        requestAnimationFrame(render);
    }
    //legsAnimation(deltaTime)

}
var rotation=function(now){
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

    if(count<=0){
        console.log("finerotazione")
        theta[leftUpperArmId][1]=0
        theta[rightUpperArmId][1]=0
    
        theta[leftUpperLegId][1]=0
        theta[rightUpperLegId][1]=0

        initNodes(rightUpperArmId);
        initNodes(leftUpperArmId);
        initNodes(rightUpperLegId);
        initNodes(leftUpperLegId);
        requestAnimationFrame(render);
    }
    else{
        theta[torsoId][1]=(speed+theta[torsoId][1])%360; 


        theta[leftUpperArmId][1]=0.5*Math.cos(((count*45))*Math.PI/160)-0.3
        theta[rightUpperArmId][1]=0.5*Math.sin(((count*45))*Math.PI/160)-0.3
    
        theta[leftUpperLegId][1]=0.5*Math.sin(((count*45))*Math.PI/160)-0.3
        theta[rightUpperLegId][1]=0.5*Math.cos(((count*45))*Math.PI/160)-0.3
    
        initNodes(rightUpperArmId);
        initNodes(leftUpperArmId);
        initNodes(rightUpperLegId);
        initNodes(leftUpperLegId);
        initNodes(torsoId);
        count-=speed
        requestAnimationFrame(rotation);
    }

}

var moveRight=function(now){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST)
    traverse(sceneId);
    // Convert the time to seconds
    now *= 0.001;
    // Subtract the previous time from the current time
    var deltaTime = now - then;
    // Remember the current time for the next frame.
    then = now;
    var speed=direction*5*deltaTime //space at frame
    legsAnimation(deltaTime,Math.abs(speed)*8)
    if(count>torsoRadius && direction>0){
        console.log("fine camminata")

        theta[leftUpperArmId][0]=180
        theta[rightUpperArmId][0]=180
    
        theta[leftLowerArmId][0]=0
        theta[rightLowerArmId][0]=0
    
        theta[leftUpperLegId][0]=180
        theta[rightUpperLegId][0]=180
    
        theta[leftLowerLegId][0]=0
        theta[rightLowerLegId][0]=0
        requestAnimationFrame(render);
        }
    else if(count<torsoRadius && direction<0){
        theta[leftUpperArmId][0]=180
        theta[rightUpperArmId][0]=180
    
        theta[leftLowerArmId][0]=0
        theta[rightLowerArmId][0]=0
    
        theta[leftUpperLegId][0]=180
        theta[rightUpperLegId][0]=180
    
        theta[leftLowerLegId][0]=0
        theta[rightLowerLegId][0]=0
        console.log("fine camminata neg ")
        requestAnimationFrame(render);
    }
    else{
        torsoRadius-=speed
        //console.log(torsoRadius)
        initNodes(torsoId);
        requestAnimationFrame(moveRight);
    }

}

var horizontal=function(now){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST)
    traverse(sceneId);
    // Convert the time to seconds
    now *= 0.001;
    // Subtract the previous time from the current time
    var deltaTime = now - then;
    // Remember the current time for the next frame.
    then = now;
    var speed=direction*25*deltaTime //space at frame

    if(count<0 && direction >=0){
        console.log("end horizontila positive")
        requestAnimationFrame(render);
    }
    else if(count>0 && direction <0){

        console.log("end horizontila negsative")
        translateV=[[[0,0,0]]]
        requestAnimationFrame(render);
    }
    else{

        theta[torsoId][2]=(speed+theta[torsoId][2]);

        theta[leftUpperLegId][0]=(-speed*0.65+theta[leftUpperLegId][0]);
        theta[rightUpperLegId][0]=(-speed*0.65+theta[rightUpperLegId][0]);
        theta[leftLowerLegId][0]=(-speed*0.35+theta[leftLowerLegId][0]);
        theta[rightLowerLegId][0]=(-speed*0.35+theta[rightLowerLegId][0]);

        theta[leftLowerArmId][0]=(-speed*0.45+theta[leftLowerArmId][0]);
        theta[rightLowerArmId][0]=(-speed*0.45+theta[rightLowerArmId][0]);

        if (direction >=0){
        translateV[torsoId][0][2]=tp0+3*Math.cos(((count)%360)*Math.PI/180)
        }
        else{
            translateV[torsoId][0][2]=tp0-3*Math.cos(((count)%360)*Math.PI/180)
        }
        count-=speed
        initNodes(torsoId);
        initNodes(leftUpperLegId);
        initNodes(rightUpperLegId);
        initNodes(leftLowerLegId);
        initNodes(rightLowerLegId);
        initNodes(leftLowerArmId);
        initNodes(rightLowerArmId);
        requestAnimationFrame(horizontal);
    }
}


var scratchBack=function(now){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST)
    traverse(sceneId);
    // Convert the time to seconds
    now *= 0.001;
    // Subtract the previous time from the current time
    var deltaTime = now - then;
    // Remember the current time for the next frame.
    then = now;
    var speed=60*deltaTime //space at frame
    if(count<=0 && translateV[torsoId][0][2]-tp0>=0.4  ){
        console.log("end scratch back")
        
        requestAnimationFrame(render)
    }else{
        translateV[torsoId][0][2]=tp0+0.5*Math.sin(((count))*Math.PI/180)
        var angle1=(20)*Math.PI/180*Math.sin(((count))*Math.PI/180+90)
        var angle2=(25)*Math.PI/180*Math.sin(((count))*Math.PI/180+90)
      
        theta[leftUpperLegId][0]+=angle1
        theta[rightUpperLegId][0]+=angle1

        theta[leftLowerLegId][0]-=angle2
        theta[rightLowerLegId][0]-=angle2
        count-=speed
        initNodes(torsoId);
        initNodes(leftUpperLegId);
        initNodes(rightUpperLegId);
        initNodes(leftLowerLegId);
        initNodes(rightLowerLegId);
        initNodes(leftUpperArmId);
        initNodes(rightUpperArmId);
        initNodes(leftLowerArmId);
        initNodes(rightLowerArmId);
        requestAnimationFrame(scratchBack);
    }
        
}
