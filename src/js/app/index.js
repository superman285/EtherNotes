console.log('我是入口文件entry');

require("../../sass/index.scss");


import NoteManager from "../mod/note-manager.js";
import Event from "../mod/event";
import {Toast} from "../mod/toast";
import "../mod/Masonry.js";

import {web3,abi,contractAddr,contractFounder,noteContractObj} from "../mod/contractABI";


let userAddr = localStorage.userAddr;

// load
NoteManager.load();

var cct = document.querySelector("#content");
var msnry;

$('.add-note').on('click', function () {
    if(userAddr){
        if (!web3.utils.isAddress(userAddr)) {
            Toast('账号有误，请重新登录!');
            return;
        }
        NoteManager.add().then(()=>{
            if (msnry) {
                msnry.layout();
                msnry = new Masonry(cct, {
                    itemSelector: '.note',
                    gutter: 30
                });
            } else {
                msnry = new Masonry(cct, {
                    itemSelector: '.note',
                    gutter: 30
                });
            }
        })
    }else {
        Toast("游客无法添加便签，请先登录!")
    }
});

let frame = document.querySelector("#content");

frame.addEventListener('click', (e) => {
    if (msnry && e.target.id == "content") {
        msnry.layout();
        msnry = new Masonry(cct, {
            itemSelector: '.note',
            //columnWidth: 15%,
            gutter: 30
        });
        if(userAddr) {
            if (!web3.utils.isAddress(userAddr)) {
                Toast('账户地址有误，请重新登录!');
                return;
            }
        }else {
            NoteManager.recover();
        }


    }
});

Event.on('waterfall', function () {
    var cct = document.querySelector("#content");
    if (msnry) {
        msnry.layout()
    } else {
        msnry = new Masonry(cct, {
            // options
            itemSelector: '.note',
            //columnWidth: 15%,
            gutter: 30
        });
    }
})

export {msnry};