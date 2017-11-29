const mongo = require('./mongo');

module.exports = {
  getEntities, getEntity, addNewEntity, deleteEntity
};

async function getEntities(ctx) {
  ctx.body = await mongo.find(1, ctx.state.entity) || [];
  ctx.status = 200;
}

async function getEntity(ctx) {
  ctx.body = await mongo.findOne(1, ctx.state.entity);
  if (ctx.body) {
    return ctx.status = 200;
  }
  ctx.status = 404;
}

async function addNewEntity(ctx) {
  const {entity} = ctx.params;
  await mongo.insert(1, entity, ctx.request.body);
  ctx.status = 200;
}

async function deleteEntity(ctx) {
  const result = await mongo.deleteOne(1, ctx.state.entity);
  if (result.deletedCount > 0) {
    return ctx.status = 200;
  }
  ctx.status = 404;
}
