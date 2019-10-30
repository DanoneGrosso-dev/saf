module.exports = class Wrapper {
  constructor(opts = {}) {    
    if(this.constructor == Wrapper) throw new Error('Abstract class')
    this.opts = opts
  };
  
  async startConnection () {
    
  };
};