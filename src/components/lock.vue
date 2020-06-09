<template>
  <div class="container">
      <vue-p5 class="screen"  v-on="{ setup, draw, preload, mousepressed }"></vue-p5>
  </div>
</template>

<script>
import VueP5 from "vue-p5";
import LockNode from '@/LockNode';

export default {
  name: 'HelloWorld',
  components: {
    "vue-p5": VueP5
  },
  data(){
    return {
      width: 500,
      height: 500,
      canvas: null,
      layers: [],
      centerVal: 0
    }
  },
  methods: {
    mousepressed(sketch){
      if( !(this.layers.length > 0) ){
        return;
      }

      let mult = 1;
      if(sketch.mouseButton === sketch.RIGHT) {
        mult = -1;
        //console.log("right")
      }
      //console.log(sketch.mouseButton)


      if( sketch.dist(sketch.mouseX, sketch.mouseY, this.width/2, this.height/2) <  (this.width/10)/2 ){
        // center node clicked
        let numNodes = 0;
        for(let i = 0; i < this.layers[0].length; i++){
          if(this.layers[0][i].enabled){
            this.layers[0][i].value += mult;
            numNodes ++;
          }
        }
        this.centerVal -= numNodes*mult;
      }else{
        for(let i = 0; i < this.layers.length; i++){
          for(let j = 0; j < this.layers[i].length; j++){
            if( sketch.dist( sketch.mouseX - this.width/2, sketch.mouseY - this.height/2, this.layers[i][j].pos.x, this.layers[i][j].pos.y ) <  (this.width/15)/2 ){
              this.nodeClicked(i,j,mult);
              //console.log("clicked")
            }
          }
        }
      }

    },
    preload(sketch) {
      this.canvas = sketch;
      this.layers = this.generateLayers();
      let newCenterVal = 0;
      for(let i = 0; i < this.layers.length; i++){
        for(let j = 0; j < this.layers[i].length; j++){
          if(this.layers[i][j].enabled){
            newCenterVal += -1*this.layers[i][j].value;
          }
        }
      }
      this.centerVal = Math.round(newCenterVal*1.5);
    },
    setup(sketch) {
      sketch.resizeCanvas( this.width, this.height);
      sketch.frameRate(30);
      //sketch.noLoop();
    },
    draw(sketch) {
      sketch.translate( this.width/2, this.height/2 );
      this.drawBackground();

      this.drawLines();
      this.drawCenter();
      this.drawNodes();
    },

    drawCenter(){
      this.canvas.push();

      if(this.centerVal >= 0){
        this.canvas.fill("rgb(40,40,255)");
      }else{
        this.canvas.fill("rgb(200,40,40)");
      }

      this.canvas.circle( 0 ,0 ,this.width/10 );

      this.canvas.textAlign(this.canvas.CENTER, this.canvas.CENTER);
      this.canvas.fill("black");
      this.canvas.strokeWeight(this.width/400);
      this.canvas.textSize(this.width/25)
      this.canvas.stroke("rgb(10,10,10)");
      this.canvas.text(this.centerVal, 0, 0);

      this.canvas.pop();
    },
    drawBackground(){
      this.canvas.background("rgb(15,15,15)");
    },
    drawNodes(){
      for(let i = 0; i < this.layers.length; i++){
          let rowSize = this.layers[i].length;
          for(let j = 0; j < rowSize; j++){
            this.canvas.push();
            this.canvas.translate( this.layers[i][j].pos.x, this.layers[i][j].pos.y );
            this.drawNode( this.layers[i][j] );
            this.canvas.pop();
          }
      }
    },
    drawNode(node){
      this.canvas.push();

      if(!node.enabled){
        this.canvas.fill("rgba(80,80,80, 0.1)");
        this.canvas.stroke("rgba(10,10,10, 0.1)");
      }else if(node.value >= 0){
        this.canvas.fill("rgb(80,80,255)");
        this.canvas.stroke("rgb(10,10,150)");
      }else{
        this.canvas.fill("rgb(255,80,80)");
        this.canvas.stroke("rgb(150,10,10)");
      }

      this.canvas.strokeWeight(this.width/200);
      this.canvas.circle( 0 ,0 ,this.width/15 );

      if(node.enabled){
        this.canvas.strokeWeight(this.width/400);
        this.canvas.stroke("rgb(0,0,0)");
        this.canvas.textSize(this.width/35)
        this.canvas.textAlign(this.canvas.CENTER, this.canvas.CENTER);
        this.canvas.fill("black");
        this.canvas.text(node.value, 0, 0);
      }

      this.canvas.pop();
    },
    drawLines(){
      if( !(this.layers.length > 0) ){
        return
      }

      for(let i = 0; i < this.layers[0].length; i++){
        if(this.layers[0][i].enabled){
          this.drawLine(0,0, this.layers[0][i].pos.x, this.layers[0][i].pos.y )
        }
      }

      for(let i = 0; i < this.layers.length - 1; i++){
        for(let j = 0; j < this.layers[i].length; j++){
          if(this.layers[i][j].enabled){
            if( this.layers[i+1][2*j].enabled ){
              this.drawLine( this.layers[i][j].pos.x, this.layers[i][j].pos.y, this.layers[i+1][2*j].pos.x, this.layers[i+1][2*j].pos.y );
            }
            if( this.layers[ i+1 ][ 2*j + 1].enabled ){
              this.drawLine( this.layers[i][j].pos.x, this.layers[i][j].pos.y, this.layers[i+1][2*j + 1].pos.x, this.layers[i+1][2*j + 1].pos.y );
            }
          }
        }
      }
    },
    drawLine(x1, y1, x2, y2){
      this.canvas.push();
      this.canvas.strokeWeight(this.width/100);
      this.canvas.stroke("rgb(150,150,150)");
      this.canvas.line(x1, y1, x2, y2)
      this.canvas.pop();
    },

    makeLayers(){
      let result = [];
      let baseNum = 6;
      let layers = 3;

      let layerSize = baseNum;
      for(let i = 0; i < layers; i++){
        result.push([]);
        for(let j = 0; j < layerSize; j++){
          let pos = this.canvas.createVector( 0 ,(i+1)*(this.width/7) );
          pos.rotate( this.canvas.radians( j*(360/layerSize) + (360/baseNum)/(Math.pow(2, i+1 )) ) )
          let enabled = (Math.random() > 0.5) ? false : true;
          let node = new LockNode(pos, enabled);

          result[i].push(node);
        }
        layerSize *= 2;
      }
      return result;
    },
    generateLayers(){
      let result = this.makeLayers()
      while( !this.layersValid(result) ){
        result = this.makeLayers();
      }
      // if( !this.layersValid(result) ){
      //   return( this.generateLayers() );
      // }
      //console.log(result);
      return result;
    },
    layersValid(layers){
      let valid = true;
      for(let i = layers.length-1; i > 0; i--){
        for(let j = 0; j < layers[i].length; j++){
          if( layers[i][j].enabled && !layers[i-1][Math.floor(j / 2)].enabled ){
            valid = false;
          }
        }
      }
      return valid;
    },

    nodeClicked(i, j, mult){
      //console.log(mult)
      let numAffected = 0;
      if(i == 0){
        this.centerVal += mult;
        numAffected ++;
      }else{
        this.layers[i-1][Math.floor(j/2)].value += mult;
        numAffected ++;
      }

      if(i < this.layers.length-1){
        for(let x = 0; x < 2; x++){
          if( this.layers[i+1][2*j+x].enabled ){
            this.layers[i+1][2*j+x].value += mult
            numAffected++;
          }
        }
      }

      this.layers[i][j].value -= numAffected*mult

    }

  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.container {
  width: 500px;
  height: 500px;
  background-color: rgba(200,200,200,0.2);

}
</style>
