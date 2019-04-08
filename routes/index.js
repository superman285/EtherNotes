const KoaRouter = require('koa-router');

const router = new KoaRouter();

const Koa = require('koa');
const app = new Koa();

const session = require('koa-session2');
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

app.use(session(SESSION_CONFIG, app));

router.get('/', async (ctx, next) => {
    let data = {};
    if(ctx.session.user){
        data = {
            isLogin: true,
            user: ctx.session.user,
        }
    }else {
        data = {
            isLogin: false,
        }
    }
    let userstr = JSON.stringify(data);
    await ctx.render('index', {
        isLogin: data.isLogin,
        user: data.user,
        data: userstr,
    });
});

router.get('/checkLogin', async (ctx,next)=>{
    ctx.body = {login:true}
})

router.get('/string', async (ctx, next) => {
    ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
    ctx.body = {
        title: 'koa2 json'
    }
})

module.exports = router;
