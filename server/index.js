const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const mongo = require('./mongo');
const jwt = require('koa-jwt');
const {koaJwtSecret} = require('jwks-rsa');
const cors = require('kcors');

const app = new Koa();
const router = new Router();

app.use(cors());

app.use(jwt({
  secret: koaJwtSecret({
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
    cache: true
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`
}));

function hasScope(user, action, entity) {
  const scopes = user.scope.split(' ');
  const scopeNeeded = action + ':' + entity;
  return scopes.find(element => {
    return element === scopeNeeded;
  }) !== null;
}

router.get('/:entity', async function (ctx) {
  const {entity} = ctx.params;
  if (!entity) {
    return ctx.status = 400;
  }
  if (!hasScope(ctx.state.user, ctx.method.toLowerCase(), entity)) {
    return ctx.status = 401;
  }
  ctx.status = 200;
  ctx.body = await mongo.find(1, entity);
});

router.get('/:entity/:id', async function (ctx) {
  const {entity, id} = ctx.params;
  if (!entity) {
    return ctx.status = 400;
  }
  if (!hasScope(ctx.state.user, ctx.method.toLowerCase(), entity)) {
    return ctx.status = 401;
  }
  ctx.status = 200;
  ctx.body = await mongo.findOne(1, entity, id);
});

router.post('/:entity', async function (ctx) {
  const {entity} = ctx.params;
  await mongo.insert(1, entity, ctx.request.body);
  ctx.status = 200;
});

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3001);
