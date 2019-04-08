
const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')({
    prefix: '/auth'
});
const session = require('koa-session2');
const cookieParser = require('koa-cookie-parser');
const bodyParser = require('koa-bodyparser');


app.use(cookieParser({
    cookieNameList:['uid','noteid'],
    cipherKey:"hello world",
    maxAge:60*60*24
}));
app.use(bodyParser());


router.get('/github',(ctx,next)=>{
    ctx.response.redirect('/');
})

router.get('/logout',(ctx,next)=>{
    ctx.body = "点击登出";
})


module.exports = router;