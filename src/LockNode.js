class LockNode {
  constructor(pos, enabled = true){
    this.pos = pos
    this.enabled = enabled;
    this.value = Math.floor( Math.random()*4 - 4 );
    this.connections = [];
  }

}

export default LockNode;
