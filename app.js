const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const path = require("path");

const nunjucks = require("koa-nunjucks-2");

const index = require('./routes/index')
const api = require('./routes/api')
const auth = require('./routes/auth')
const users = require('./routes/users')

const session = require('koa-session2');

const passport = require('koa-passport');
const cookieParser = require('koa-cookie-parser');

const SESSION_CONFIG = {
    key: 'koa:sess',
    maxAge: 86400000,
    autoCommit: true,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false,
};

onerror(app)

app.use(json())
app.use(logger())

app.use(require('koa-static')(__dirname + '/public'))

app.use(require('koa-static')(__dirname))

app.use(nunjucks({
    ext: 'njk',
    path: path.resolve(__dirname, 'views'),// 指定视图目录
    nunjucksConfig: {
        trimBlocks: true // 开启转义 防Xss
    }
}));

app.use(async (ctx, next) => {
    const start = new Date()
    await next();
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
});


app.use(cookieParser({
    cookieNameList:['uid','noteid'],
    cipherKey:"hello world",
    maxAge:60*60*24
}));
app.use(bodyParser());
app.keys = ['some secret hurr'];
app.use(session(SESSION_CONFIG, app));
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use(index.routes(), index)
app.use(api.routes(),api);
app.use(auth.routes(),auth);
app.use(users.routes(), users.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

module.exports = app
