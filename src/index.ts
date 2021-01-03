import { AmbientLight, Bone, BoxGeometry, Color, DirectionalLight, Group, Material, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, SkeletonHelper, WebGLRenderer, Object3D, PlaneGeometry, DoubleSide, Box3, Vector3, Loader } from 'three';
import { MeshLoader } from './loader';

const scene = new Scene();
const camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// init


// Geometry
const loader = new MeshLoader(scene, {
    'robot': '/res/spot.glb'
});


// Floor
const floor = new PlaneGeometry( 30, 30);
const material = new MeshBasicMaterial( {color: 0xffff00, side: DoubleSide} );
const plane = new Mesh( floor, material );
scene.add( plane )



// Camera
camera.position.z = 5;
camera.rotation.x = Math.PI / 2;
camera.position.y = -20;


// Other
scene.background = new Color(0xffffff);

// Lighting
const light = new AmbientLight( 0x404040 ); // soft white light
scene.add( light );
const directionalLight = new DirectionalLight( 0xffffff, 0.5 );
scene.add( directionalLight );



(async () => {
    await loader.ready();

    //Init
    const loadedRobot = loader.meshes.robot;
    const robot = loadedRobot.obj;
    const robotBones = loadedRobot.parts.Bone;

    console.log('bones', robotBones);
    console.log('all', loadedRobot.parts);
    
    robot.rotation.x = Math.PI / 2;
    robot.position.z = 10;



    // Game
    let c = 1;
    
    function animate() {
        requestAnimationFrame( animate );

        const blc = robotBones.bl_calf as Bone;
        const blt = robotBones.bl_tigh as Bone;

        const flc = robotBones.fl_calf as Bone;
        const flt = robotBones.fl_tigh as Bone;
        
        const brc = robotBones.br_calf as Bone;
        const brt = robotBones.br_tigh as Bone;

        const frc = robotBones.fr_calf as Bone;
        const frt = robotBones.fr_tigh as Bone;


        if (c > 0 && blc.rotation.z > -0) {
            c = -1;
        } else if (c < 0 && blc.rotation.z < -0.7) {
            c = 1
        }

        blt.rotation.z -= c / 100;
        blc.rotation.z += c / 100;

        flt.rotation.z -= c / 100;
        flc.rotation.z += c / 100;

        brt.rotation.z -= c / 100;
        brc.rotation.z += c / 100;

        frt.rotation.z -= c / 100;
        frc.rotation.z += c / 100;

        renderer.render( scene, camera );
    }

    requestAnimationFrame( animate );
})();
