const Koa = require("koa");
const app = new Koa();
const router = require('koa-router')();
router.prefix('/api');
const Web3 = require('web3');

const Tx = require('ethereumjs-tx');
const ethABI = require('ethereumjs-abi');
const ethers = require('ethers');

const bodyParser = require('koa-bodyparser');
app.use(bodyParser());

let {web3, abi, contractAddr, contractFounder, noteContractObj, mywallet, etherProvider, myetherContractObj} = require("../src/js/mod/contractABI_backend.js");


router.get("/notes", async (ctx, next) => {

    if (web3.utils.isAddress(ctx.query.data)) {
        await noteContractObj.methods.getMyNotes.call({
            from: ctx.query.data
        }, (err, result) => {
            //let data = result;
            ctx.response.body = {
                status: 0,
                data: result,
                query: 'myNotes'
            }
        });
    } else {
        await noteContractObj.methods.getAllNotes.call({}, (err, result) => {
            ctx.response.body = {
                status: 0,
                data: result,
                query: 'allNotes'
            }
        });
    }
});

router.post("/note/add", async (ctx, next) => {
    let note = ctx.request.body.note,
        uid = ctx.request.body.uid,
        privateKey = ctx.request.body.key;

    var wallet = new ethers.Wallet(privateKey, etherProvider);
    var etherContractObj = new ethers.Contract(contractAddr, abi, wallet);

    let addResult;
    try {
        let result = await etherContractObj.addNote(note);
        addResult = {
            success: true,
            res: result,
        };
        //必须加，不然连续操作连续发起交易就会出问题
        await result.wait();
        ctx.response.body = {status: 0, result: addResult};
    } catch (err) {
        addResult = {
            success: false,
            res: err,
        };
        ctx.response.body = {status: 3, result: addResult, errorMsg: "Failed to add Note!"};
    }
});

router.post("/note/edit", async (ctx, next) => {
    let uid = ctx.request.body.uid,
        noteid = ctx.request.body.noteid,
        note = ctx.request.body.note,
        privateKey = ctx.request.body.key;
    let noteOwner = await noteContractObj.methods.noteidTouid(noteid).call();

    var wallet = new ethers.Wallet(privateKey, etherProvider);
    var etherContractObj = new ethers.Contract(contractAddr, abi, wallet);

    let updateRes;
    if (uid) {
        if (Number(uid) !== Number(noteOwner)) {
            console.log("笔记所有者和笔记修改不是同一人，不允许");
            ctx.response.body = {status: 4, result: "ownerErr", errorMsg: "无法修改他人的便签!"};
            return;
        }
        try {
            let result = await etherContractObj.updateNote(noteid, note);
            updateRes = {
                success: true,
                res: result
            };
            await result.wait();
            ctx.body = {status: 0, result: updateRes}
        } catch (err) {
            updateRes = {
                success: true,
                res: err
            };
            ctx.body = {status: 4, result: updateRes, errorMsg: "Failed to edit Note!"}
        }
    } else {
        updateRes = {
            success: false,
            res: 'guestAuth Error!',
        };
        ctx.response.body = {status: 4, result: updateRes, errorMsg: "游客只可以阅览便签!请先登录!"};
    }

});

router.post("/note/delete", async (ctx, next) => {
    console.log('/del');
    let uid = ctx.request.body.uid,
        noteid = ctx.request.body.noteid,
        privateKey = ctx.request.body.key;

    var wallet = new ethers.Wallet(privateKey, etherProvider);
    var etherContractObj = new ethers.Contract(contractAddr, abi, wallet);

    let noteOwner = await noteContractObj.methods.noteidTouid(noteid).call();
    let deleteRes;
    let txNums = Number(await web3.eth.getTransactionCount(contractFounder));

    if (uid) {
        if (Number(uid) !== Number(noteOwner)) {
            ctx.response.body = {status: 5, result: "ownerErr", errorMsg: "亲,不能删除别人的便签哦!"};
            return;
        }
        try {
            let result = await etherContractObj.deleteNote(noteid);
            deleteRes = {
                success: true,
                res: result,
            };
            await result.wait();
            ctx.body = {status: 0, result: deleteRes};
        } catch (err) {
            deleteRes = {
                success: false,
                res: err,
            };
            ctx.body = {status: 5, result: deleteRes, errorMsg: "Failed to delete Note!"}
        }
    } else {
        deleteRes = {
            success: false,
            res: "guestAuth Error!"
        };
        ctx.response.body = {status: 5, result: deleteRes, errorMsg: "游客无法进行删除操作!"};
    }
});

module.exports = router;
