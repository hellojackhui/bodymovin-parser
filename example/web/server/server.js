const koa = require('koa');
const cors = require('koa-cors');
const parser = require('koa-bodyparser');
const Router = require('koa-router');
const fileManager = require('./fileManager');

const app = new koa();
const router = new Router();


router.post('/html', async (ctx) => {
    console.log('ctx-html', ctx);
});


router.post('/upload', async (ctx) => {
    ctx.body = '上传成功';
});

router.get('/clean', async (ctx) => {
    await fileManager.cleanCssContent();
    ctx.body = '清除完成';
});

router.post('/css', async (ctx) => {
    try {
        await fileManager.cleanCssContent();
        await fileManager.rewriteContent(ctx.request.body);
        ctx.body = '完成解析';
    } catch(e) {
        ctx.body = e;
    }
})

router.get('/css', async (ctx) => {
    ctx.body = '完成解析';
})


app.use(parser({
    enableTypes: ['text', 'json']
}));
app.use(router.routes());
app.use(cors({
    origin: '*',
    credentials: true,
}));

app.listen(3001, () => {
    console.log('server loading, 3001 port');
})
