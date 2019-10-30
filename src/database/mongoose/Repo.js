const Repository = require('../Repository');

const transformProps = require('transform-props');
const castToString = arg => String(arg);

module.exports = class Repo extends Repository {
  constructor(mongoose, model) {
    super();

    if(!mongoose || !model) throw new Error('Mongoose model cannot be null.');
    this.mongoose = mongoose;

    if(typeof model === 'string') {
      this.model = mongoose.model(model);
    } else {
      this.model = model;
    };
  };

  parse(entity) {
    return entity && transformProps(entity, castToString, '_id');
  };

  add(entity) {
    return this.model.create(entity).then(this.parse);
  };

  findOne(id, projection) {
    return this.model.findById(id, projection).then(this.parse);
  };

  findAll(projection) {
    return this.model.find({}, projection).then(e => e.map(this.parse));
  };

  get(id, projection) {
    return this.findOne(id, projection).then(e => this.parse(e) || this.add({ _id: id }));
  };

  remove(id) {
    return this.model.findByIdAndRemove(id).then(this.parse);
  };

  async verificar(id) {
    return (await this.model.findOne({ _id: id }).then((e) => { return e }) ? true : false);
  };

  update(id, entity) {
    return this.model.updateOne({ _id: id }, entity);
  };
};