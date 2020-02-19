(async function run() {
    var fs = require('fs')
    //加载依赖
    const Koa = require('koa'); //引入koa框架
    const Static = require('koa-static-cache'); //引入koa静态资源依赖
    const Router = require('koa-router'); //引入koa路由
    const Bodyparser = require('koa-bodyparser');//加载body解析依赖
    const cors = require('koa2-cors')//引入跨域依赖
    const session = require('koa-session');


    const app = new Koa(); //类似于实例化

    app.keys = ['niconiconi'];
    const CONFIG = {
        key: 'koa:sess', //cookie key (default is koa:sess)
        maxAge: 86400000, // cookie的过期时间 maxAge in ms (default is 1 days)
        overwrite: true, //是否可以overwrite    (默认default true)
        httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
        signed: true, //签名默认true
        rolling: false, //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
        renew: false, //(boolean) renew session when session is nearly expired,
    };
    app.use(session(CONFIG, app));

    
    app.use(Bodyparser());//解析body,也就是post传参
    app.use(cors());//解决跨域问题

    //加载静态资源
    app.use(Static('./static', {
        prefix: '/',
        gzip: true
    }));

    const router = new Router();//路由

    app.use(router.routes());//挂载路由

    router.get('/', async ctx => {
        ctx.type = 'html';
        ctx.body = fs.createReadStream('./static/index.html');
    });

    app.listen(8888, () => {});

})();