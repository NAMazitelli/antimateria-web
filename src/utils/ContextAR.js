import * as THREE from './three.module.js';
THREEx.ArToolkitContext.baseURL = '../../';
export class ContextAR{
    constructor(mundo){
        this.mundo = mundo;
        //------- AR Toolkit Source, es decir lo que la camara ve
        this.arToolkitSource = new THREEx.ArToolkitSource({
            sourceType : 'webcam'
        });
        //--- El source se inicializa en un proceso por separado
        var tmpresize = this.onResize;
        var tmparToolkitSource = this.arToolkitSource;
        var tmparToolkitContext = this.arToolkitContext;
        var tmprenderizador = mundo.renderer;
        this.arToolkitSource.init(function onReady(){
            // necesitamos una funcion para cambiar el tamaño de la ventana cuando se inicia la camara
            setTimeout(function() {
                tmpresize(tmparToolkitSource,tmparToolkitContext,tmprenderizador);
            }, 2000);
        });
        window.addEventListener('resize', function(){
            tmpresize(tmparToolkitSource,tmparToolkitContext,tmprenderizador);
        });

        //-------- AR Toolkit Context
        this.arToolkitContext = new THREEx.ArToolkitContext({
            cameraParametersUrl: THREEx.ArToolkitContext.baseURL + 'camera_para.dat',
            detectionMode: 'mono'
        });
        //-- inicializar
        var tmparToolkitContext = this.arToolkitContext;
        this.arToolkitContext.init(function onCompleted(){
            // copy projection matrix to camera
            mundo.camera.projectionMatrix.copy( tmparToolkitContext.getProjectionMatrix() );
        });


    }

    crearMarcador(archivo, nombre){
        var raizDelMarcador = new THREE.Group;
        raizDelMarcador.name = nombre;
        this.mundo.scene.add(raizDelMarcador)
        this.markerControls = new THREEx.ArMarkerControls(this.arToolkitContext, raizDelMarcador, {
            type : 'pattern',
            patternUrl  : THREEx.ArToolkitContext.baseURL + archivo
        });
        return raizDelMarcador;
    }

    onResize(arToolkitSource,arToolkitContext,renderizador){
        if(arToolkitSource.domElement!== null && arToolkitContext !== undefined){
            arToolkitSource.onResizeElement();
            arToolkitSource.copyElementSizeTo(renderizador.domElement);
            if( arToolkitContext.arController !== null ){
                arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas)
            }
        }
    }

    actualizar(){
        if( this.arToolkitSource.ready === false )  return;
        this.arToolkitContext.update( this.arToolkitSource.domElement );
    }
}
