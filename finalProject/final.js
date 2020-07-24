
var VERSION='0.118.3'
import * as THREE from 'https://unpkg.com/three@0.118.3/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.118.3/examples/jsm/controls/OrbitControls.js';

const loader = new THREE.TextureLoader();

var renderer
var scene
var camera
var human;

var controls 

var light_a=[]
var roller_wheel=[]
var texture_a=[];
//dimension of the pivot
const radius = 0.5;
const widthSegments = 6;
const heightSegments = 6;

//dimension of the torso

const bodyWidth=3;
const bodyHeight=5.5;
const bodyDepth=1.5;

function light(a,b,c){
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.castShadow = true; 


//light.shadowCameraVisible = true;
    light.position.set(a,b,c);
    light.shadow.camera.top=30;
    light.shadow.camera.bottom=0;
    light.shadow.mapSize.width = 512;  // default
light.shadow.mapSize.height = 512; // default
light.shadow.camera.near = -10.5;    // default
light.shadow.camera.far = 50;     // default

    scene.add(light);
    light_a.push(light)
    var helper = new THREE.CameraHelper( light.shadow.camera );
    scene.add( helper );

    
  }

function plane(a,b){
    const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = a / 2;

    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneBufferGeometry(a,b);
    const planeMat = new THREE.MeshPhongMaterial({
        map: texture,
    side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -.5;
    mesh.receiveShadow = true;
    scene.add(mesh);
    texture_a.push(texture)
    }

function humanStructure(){
    const Material = new THREE.MeshPhongMaterial({color: 0xFFFF00});
    const cubeGeometry= new THREE.BoxBufferGeometry(1,1,1);
    
    const humanBody = new THREE.Object3D();

    const body=new THREE.Mesh(cubeGeometry,Material);
    body.scale.set(bodyWidth,bodyHeight,bodyDepth);
    body.position.set(0,8,0);
    body.castShadow = true; //default is false
    body.receiveShadow = true; //default
    humanBody.add(body)

    var rightArm=art(false);
    rightArm.position.set(bodyWidth*0.5+0.5,bodyHeight+4.6,0);

    var leftArm=art(false);
    leftArm.position.set(-(bodyWidth*0.5+0.5),bodyHeight+4.6,0);

    var rightLeg=art(true);
    rightLeg.position.set(bodyWidth*0.5-0.5,bodyHeight/2+2,0);

    var leftLeg=art(true);
    leftLeg.position.set(-(bodyWidth*0.5-0.5),bodyHeight/2+2,0);

    var head=new THREE.Mesh(cubeGeometry,Material);
    //head.scale.set(bodyWidth,bodyHeight,bodyDepth);
    head.position.set(0,bodyHeight*2 +0.4,0);

    humanBody.add(head);
    humanBody.add(rightArm);
    humanBody.add(leftArm);
    humanBody.add(rightLeg);
    humanBody.add(leftLeg);
    return humanBody

}
function rollerBlade(){
    const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = 0.15/ 2;

    texture.repeat.set(repeats, repeats);

    var geometryUpper = new THREE.CylinderBufferGeometry(
        0.65, 0.55, 0.7,
        heightSegments, heightSegments,
        true,
        Math.PI * 0.15,//start
        Math.PI * 1.8);//hou much is open 
    
    var lowerGeometry=  new THREE.BoxBufferGeometry(0.7,0.7,2)

    var radiusTop =  0.15;  

    var radiusBottom =  0.15;  
    
    var height =  0.3;  
    
    var radialSegments = 11;  
    
    const geometryWheel = new THREE.CylinderBufferGeometry(
        radiusTop, radiusBottom, height, radialSegments);

    var rollerMaterial = new THREE.MeshPhongMaterial({color: 0xEA330C});
    
    var upperPart= new THREE.Mesh(geometryUpper, rollerMaterial);
    var lowerPart= new THREE.Mesh(lowerGeometry, rollerMaterial);
    //rollerMaterial.map.set(texture);
    var wheel1= new THREE.Mesh(geometryWheel, rollerMaterial);
    var wheel2= new THREE.Mesh(geometryWheel, rollerMaterial);
    var wheel3= new THREE.Mesh(geometryWheel, rollerMaterial);

    lowerPart.position.set(0,-0.7,0.58)
    wheel1.rotation.z=90*Math.PI/180
    wheel1.position.set(0,-0.5,-0.8)

    wheel2.rotation.z=90*Math.PI/180
    wheel2.position.set(0,-0.5,0)

    wheel3.rotation.z=90*Math.PI/180
    wheel3.position.set(0,-0.5,0.8)

    upperPart.add(lowerPart);
    lowerPart.add(wheel1)
    lowerPart.add(wheel2)
    lowerPart.add(wheel3)

    roller_wheel.push(wheel1);
    roller_wheel.push(wheel2);
    roller_wheel.push(wheel3);

    return upperPart;
}


function art( isLeg){
    var pivotGeometry = new THREE.SphereBufferGeometry(
        radius, widthSegments, heightSegments);
  
    var pivotMaterial = new THREE.MeshPhongMaterial({color: 0xFFFF00});

    var cubeGeometry= new THREE.CylinderBufferGeometry(
        0.5, 0.5, 2, 10);
    //THREE.BoxBufferGeometry(1,2,1)

    var pivot1 = new THREE.Mesh(pivotGeometry, pivotMaterial);
    //pivot1.position.set(0.,4.,0.)
    pivot1.castShadow = true; //default is false
    pivot1.receiveShadow = true; //default
    var upperArt= new THREE.Mesh(cubeGeometry, pivotMaterial);
    upperArt.position.set(0.,-0.7,0.)
    upperArt.castShadow = true; //default is false
    upperArt.receiveShadow = true; //default

    var pivot2 = new THREE.Mesh(pivotGeometry, pivotMaterial);
    pivot2.position.set(0.,-1,0.)
    
    var lowerArt= new THREE.Mesh(cubeGeometry, pivotMaterial);
    lowerArt.position.set(0.,-1,0.)
    lowerArt.castShadow = true; //default is false
    lowerArt.receiveShadow = true; //default

    pivot1.add(upperArt)
    upperArt.add(pivot2)
    pivot2.add(lowerArt)

    console.log(pivot1)

    if(isLeg){
        var r=rollerBlade()
        r.position.set(0,-0.68,0);
        lowerArt.add(r)
    }

    return pivot1
}
window.onload= function(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(0,17,17)
    scene.background = new THREE.Color( 'skyblue' );


    light(-2, 4, 8);
    //light(0, 4, 0);
    plane(60,60);

    scene.add(camera)

    human=humanStructure()
    scene.add(human);

    renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.setSize( window.innerWidth, window.innerHeight );

    renderer.setPixelRatio( window.devicePixelRatio );

    // add the automatically created <canvas> element to the page
    document.body.appendChild( renderer.domElement );

    // render, or 'create a still image', of the scene
    renderer.render( scene, camera );
    
    controls = new OrbitControls(camera,renderer.domElement);
    controls.update();
    animate(0.00);
}

var now=0.0;
var an=0.0;

function animate(time) {
    time *= 0.001;
    var delta=time-now;
    now=time;
    an=an+delta

    if (isNaN(an)){
        an=0.0
    }
    requestAnimationFrame( animate );
    //light_a[0].position.set(0,4*Math.cos(an/2),4*Math.sin(an/2))
    human.position.y=(1* Math.cos(an*2)+1)
    human.position.z=(1* Math.cos(an*2))
    human.children[2].rotation.z=(45* Math.cos(an))*Math.PI/180+45
    human.children[3].rotation.z=-(45* Math.cos(an))*Math.PI/180-45

    human.children[4].rotation.x=(90* Math.cos(an))*Math.PI/180
    human.children[5].rotation.x=-(90* Math.cos(an))*Math.PI/180
    human.children[4].children[0].children[0].rotation.x=(45* Math.cos(an))*Math.PI/180+45
    human.children[5].children[0].children[0].rotation.x=-(45* Math.cos(an))*Math.PI/180+45
    for(var i=0; i< roller_wheel.length;i++){
        roller_wheel[i].rotation.x=an*Math.PI/180
    }
    texture_a[0].offset.y -= .07;
    controls.update();
	renderer.render( scene, camera );
}
