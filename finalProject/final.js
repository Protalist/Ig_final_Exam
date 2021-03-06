
//import
import * as THREE from '../three.js-master/build/three.module.js'//'https://unpkg.com/three@0.118.3/build/three.module.js';
import { OrbitControls } from '../three.js-master/examples/jsm/controls/OrbitControls.js' // 'https://unpkg.com/three@0.118.3/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from '../three.js-master/examples/jsm/loaders/FBXLoader.js';
import TWEEN from '../tween.esm.js';

//trhee object
const loader = new THREE.TextureLoader();
var loaderF = new FBXLoader();
var box = new THREE.Box3();

//main object in the scene
var renderer
var scene
var camera
var human;
var humanBodyB=new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());;
var light_a=[]
var roller_wheel=[]
var texture_a=[];
var tree_a=[];
var lamp_a=[];
var car_a=[];
var carBox_a=[]

//controlli della telecamera
var controls 

//Dimensions
    //dimension Plane
    var planeA=120
    var planeB=120

    //dimension of the pivot
    const radius = 0.5;
    const widthSegments = 6;
    const heightSegments = 6;

    //dimension of the torso
    const bodyWidth=3;
    const bodyHeight=5.5;
    const bodyDepth=1.5;

//function
//
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
   // scene.add( helper );

    
  }

function plane(a,b){
    const texture = loader.load('../finalProject/texture/body.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = a/32;

    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneBufferGeometry(a,b);
    const planeMat = new THREE.MeshPhongMaterial({
        map: texture,
    side: THREE.DoubleSide,
    fog: false,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -.5;
    mesh.receiveShadow = true;
    scene.add(mesh);
    texture_a.push(texture)
    }

function checkIn(O){
    if(O.position.z<30 && O.position.z<30){
        O.fog=false
    }else{
        O.fog=true
    }
}

function humanStructure(){
    const Material = new THREE.MeshPhongMaterial({color: 0xFFFF00, fog: true});
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
    const texture = loader.load('../finalProject/texture/body.png');
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

    var rollerMaterial = new THREE.MeshPhongMaterial({color: 0xEA330C, fog: true});
    
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
  
    var pivotMaterial = new THREE.MeshPhongMaterial({color: 0xFFFF00, fog: true});

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


    if(isLeg){
        var r=rollerBlade()
        r.position.set(0,-0.68,0);
        lowerArt.add(r)
    }

    return pivot1
}

function treeS(){

  var geometry = new THREE.BoxGeometry( 1, 1, 1 );

  var leaveDarkMaterial = new THREE.MeshLambertMaterial( { color: 0x91E56E } );
  var leaveLightMaterial = new THREE.MeshLambertMaterial( { color: 0xA2FF7A } );
  var leaveDarkDarkMaterial = new THREE.MeshLambertMaterial( { color: 0x71B356 } );
  var stemMaterial = new THREE.MeshLambertMaterial( { color: 0x7D5A4F } );

  var stem = new THREE.Mesh( geometry, stemMaterial );
  stem.position.set( 0, 0, 0 );
  stem.scale.set( 0.3, 1.5, 0.3 );

  var squareLeave01 = new THREE.Mesh( geometry, leaveDarkMaterial );
  squareLeave01.position.set( 0.5, 1.6, 0.5 );
  squareLeave01.scale.set( 0.8, 0.8, 0.8 );

  var squareLeave02 = new THREE.Mesh( geometry, leaveDarkMaterial );
  squareLeave02.position.set( -0.4, 1.3, -0.4 );
  squareLeave02.scale.set( 0.7, 0.7, 0.7 );

  var squareLeave03 = new THREE.Mesh( geometry, leaveDarkMaterial );
  squareLeave03.position.set( 0.4, 1.7, -0.5 );
  squareLeave03.scale.set( 0.7, 0.7, 0.7 );

  var leaveDark = new THREE.Mesh( geometry, leaveDarkMaterial );
  leaveDark.position.set( 0, 1.2, 0 );
  leaveDark.scale.set( 1, 2, 1 );

  var leaveLight = new THREE.Mesh( geometry, leaveLightMaterial );
  leaveLight.position.set( 0, 1.2, 0 );
  leaveLight.scale.set( 1.1, 0.5, 1.1 );

  var ground = new THREE.Mesh( geometry, leaveDarkDarkMaterial );
  ground.position.set( 0, -1, 0 );
  ground.scale.set( 2.4, 0.8, 2.4 );

  var tree = new THREE.Group();
  tree.add( leaveDark );
  tree.add( leaveLight );
  tree.add( squareLeave01 );
  tree.add( squareLeave02 );
  tree.add( squareLeave03 );
  tree.add( ground );
  tree.add( stem );

  return tree;
}

var bbcar=new THREE.Box3();;
function loadMOdel(){
    var carBox=new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());;;
    var r=loaderF.load( '../finalProject/models/Low Poly Cars (Free)_fbx/Models/car_1.fbx', function ( object ) {
        car_a.push(object)
        object.position.set(0,0,planeA/2+10);
        // apply texture
        object.traverse(
            function (child){
                if (child instanceof THREE.Mesh) {
            child.material.map = loader.load('../finalProject/models/Low Poly Cars (Free)_fbx/Textures/Car Texture 1.png');
            child.material.needsUpdate = true;
            child.castShadow = true; //default is false
            child.receiveShadow = true; //default
                }
            }
        )

        object.rotateX(90*Math.PI/180)
        object.rotateZ(90*Math.PI/180)
        object.scale.set(7,7,7)

        scene.add( object );
        
        console.log("before")
        var bb=new THREE.Box3Helper(  bbcar.setFromObject(object),0x00ff00)//new THREE.BoxHelper(  object, 0x00ff00);
       
        carBox_a.push(bb)
        scene.add(bb)

        object.children[4].geometry.computeBoundingBox();
        console.log("after")

        tween2.push(new TWEEN.Tween(object.position).to({z: -planeA/2-10}, 8000).delay(5000).repeat(Infinity).repeatDelay(0).start())
        tween2.push(new TWEEn.Tween({w1: object.children[0].rotation.z, w2: object.children[1].rotation.z, w3: object.children[2].rotation.z, w4: object.children[3].rotation.z})
            .to({z1:360,z2:360,z3:360,z4:360},4000).repeatDelay(0).start())
            object.geometry.computeBoundingBox();


    } );
    
}

function loadMOdel2(){
    var carBox=new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());;;
    var r=loaderF.load( '../finalProject/models/Low Poly Cars (Free)_fbx/Models/car_2.fbx', function ( object ) {
        car_a.push(object)
        object.position.set(0,0,planeA/2+10);
        // apply texture
        object.traverse(
            function (child){
                if (child instanceof THREE.Mesh) {
            child.material.map = loader.load('../finalProject/models/Low Poly Cars (Free)_fbx/Textures/Car Texture 2.png');
            child.material.needsUpdate = true;
            child.castShadow = true; //default is false
            child.receiveShadow = true; //default
                }
            }
        )

        object.rotateX(90*Math.PI/180)
        object.rotateZ(90*Math.PI/180)
        object.scale.set(7,7,7)

        scene.add( object );
        
        console.log("before")
        var bb=new THREE.Box3Helper(  bbcar.setFromObject(object),0x00ff00)//new THREE.BoxHelper(  object, 0x00ff00);
       
        carBox_a.push(bb)
        scene.add(bb)

        object.children[4].geometry.computeBoundingBox();
        console.log("after")

        tween2.push(new TWEEN.Tween(object.position).to({z: -planeA/2-10}, 8000).delay(9000).repeat(Infinity).repeatDelay(0).start())
        tween2.push(new TWEEn.Tween({w1: object.children[0].rotation.z, w2: object.children[1].rotation.z, w3: object.children[2].rotation.z, w4: object.children[3].rotation.z})
            .to({z1:360,z2:360,z3:360,z4:360},4000).repeatDelay(0).start())
            object.geometry.computeBoundingBox();


    } );
    
}

function streetLamp(){
    var bodymaterial = new THREE.MeshLambertMaterial({ color: 0x8B8381 } );
    var geometry=new THREE.BoxGeometry( 1, 1, 2 );
    var GeometryLamp = new THREE.CylinderBufferGeometry(0.5, 0.5, 15, 10);
   
    var pole= new THREE.Mesh( GeometryLamp, bodymaterial );
    pole.position.set(0,15/2,0)
   
    var pole2= new THREE.Mesh(geometry,bodymaterial);
    pole2.position.set(0.0,15.0,0.5);

    var sLight=new THREE.SpotLight(0xFFFFFF,1)
    sLight.position.set(0.0,15.0,1.0)
    sLight.angle=35*Math.PI/180
    sLight.target.position.set(0.0,0.0,6.0)
    sLight.castShadow = true;
    var street = new THREE.Group();

    street.add(pole);
    street.add(pole2);
    street.add(sLight);
    street.add(sLight.target)
 
    return street;
}

var tween2=[];

window.onload= function(){
    
    for(var i=0;i<100;i++){
        continue;
    }
    scene = new THREE.Scene();
    //scene.fog=new THREE.Fog( 'skyblue' , 1, 2);

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(0,17,17)
    scene.background = new THREE.Color( 'skyblue' );

    var helper = new THREE.CameraHelper( camera );
   // scene.add( helper );
    
    light(-2, 4, 8);

    plane(planeA,planeB);

    scene.add(camera)

    human=humanStructure()
    scene.add(human);
    humanBodyB= new THREE.Box3Helper(  box.setFromObject(human.children[0]),0x00ff00)
    scene.add(humanBodyB)

    for(var i=0;i<4;i++){
        var d=-1
        if(i%2 !=0 ){
            d=d*-1
        }
        tree_a.push(treeS())
        tree_a[i].scale.set(4,4,4)
        tree_a[i].position.set(d*(planeA/2-10),2*3,planeA/2+10)
        tree_a[i].visible=false
        scene.add( tree_a[i])
    }

    for(var i=0;i<4;i++){
        lamp_a.push(streetLamp())
        var d=1
        if(i%2 !=0 ){
            d=d*-1
        }
        lamp_a[i].rotation.y=d*(270*Math.PI/180)
        lamp_a[i].position.x=d*(planeA/2-10)
        lamp_a[i].position.z=planeA/2+10
        lamp_a[i].visible=false
        scene.add( lamp_a[i])
    }
    

    loadMOdel()
    loadMOdel2()

    for(var i=0;i<tree_a.length;i++){
        var tween = new TWEEN.Tween({ z:tree_a[i].position.z, obj:tree_a[i]}
            ).to({z: -planeA/2}, 10000).delay((i+1)*10000/4).repeat(Infinity).repeatDelay(0).onUpdate(
            
            function (O){
                O.obj.position.z=O.z
                //console.log(O)
                if(O.z<planeA/2+10 && O.z>-planeA/2-10){
                    O.obj.visible=true
                }else{
                    O.obj.visible=false
                }
        }
            ).start()
    }

    for(var i=0;i<lamp_a.length;i++){
        var tween = new TWEEN.Tween({ z:lamp_a[i].position.z, obj:lamp_a[i]}).to({z: -planeA/2}, 10000).delay((i+1)*10000/4+250).repeat(Infinity).repeatDelay(0).onUpdate(
            
            function (O){
                O.obj.position.z=O.z
                //O.obj.children[2].target.position.set(O.obj.position)
                if(O.z<planeA/2+10 && O.z>-planeA/2-10){
                    O.obj.visible=true
                }else{
                    O.obj.visible=false
                }
        }
            )
        .start()



        
    }


    var leftLeg = new TWEEN.Tween(human.children[4].rotation).to({x: (90*Math.PI/180)}, 1500).delay(0).repeat(1).yoyo(true)
    var lefLowertLeg = new TWEEN.Tween(human.children[4].children[0].children[0].rotation).to({x: (45*Math.PI/180)}, 1500).repeat(1).yoyo(true)
    var rightLeg = new TWEEN.Tween(human.children[5].rotation).to({x: (90*Math.PI/180)}, 1500).delay(0).repeat(1).yoyo(true)
    var rightLowertLeg = new TWEEN.Tween(human.children[5].children[0].children[0].rotation).to({x: (45*Math.PI/180)}, 1500).repeat(1).yoyo(true)


    leftLeg.chain(rightLeg);
    rightLeg.chain(leftLeg);
    leftLeg.start()

    lefLowertLeg.chain(rightLowertLeg)
    rightLowertLeg.chain(lefLowertLeg)
    lefLowertLeg.start()


    renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = false;
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


function animate(time){
    // time *= 0.001;
    // var delta=time-now;
    // now=time;
    // an=an+delta
    requestAnimationFrame( animate );

    
     TWEEN.update(time)
 
    // if(car_a.length>0 && carBox_a.length >0){
    //      carBox_a[0].position.set(0,0,time)
    //    // humanBodyB.update()
    //     //console.log(car_a[0])
    //     //console.log(car_a[0])
    //    if(human.children[0].geometry.boundingBox.intersectsBox(car_a[0].children[4].geometry.boundingBox.applyMatrix4(car_a[0].children[4].matrixWorld))){
    //        console.log("HIT!!!")
    //    }
    // }

    texture_a[0].offset.y -= .0043;
    controls.update();
	renderer.render( scene, camera );
}


document.onkeypress=function(e){
    if(e.keyCode==115){
        renderer.shadowMap.enabled = !renderer.shadowMap.enabled;
    }
}


