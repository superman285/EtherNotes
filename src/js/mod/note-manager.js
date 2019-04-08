import {Toast} from "./toast"; // es6 export way
import Note from "./note";
import Event from "./event";

import {web3,abi,contractAddr,contractFounder,noteContractObj} from "./contractABI";

import NProgress from '../lib/nprogress';
import 'nprogress/nprogress.css';

let userAddr = localStorage.userAddr;

class NoteManagerClass {
    constructor(){
        console.log("I'm NoteManager constructor");
    }

    static load() {
        NProgress.start();
        Event.fire('waterfall');
            $.get('/api/notes',{data:userAddr}).done(function(ret){
                if(ret.status == 0){
                    NProgress.done();
                    $.each(ret.data, function(idx, article) {
                        if(article[0]==0&&article[1]==0&&!article[3]){
                            console.log('this note has been deleted');
                        }else{
                            let noteObj = new Note({
                                id: article[1],
                                context: article[2]
                            });
                            NoteManagerClass.notesObjSets.push(noteObj);
                        }
                    });
                    Event.fire('waterfall');
                }else{
                    Toast(ret.errorMsg);
                }
            }).fail(function(){
                Toast('网络异常');
            });

    }

    static recover() {
        NoteManagerClass.notesObjSets.forEach(item=>{
            item.recover();
        })
    }

    static async add(){
        NProgress.start();
        let addRes = await Note.add({
            uid: userAddr,
            note: '',
        });
        if(addRes) {
            new Note({
                id: ++NoteManagerClass.noteID,
            });
            NProgress.done();
        }else{
            console.log('addnote api failed');
        }
    }
}

noteContractObj.methods.noteIdx().call({},(err,res)=>{
    if (!err) {
        NoteManagerClass.noteID = parseInt(res);
    }
});


NoteManagerClass.notesObjSets = [];

const load = NoteManagerClass.load,
      add = NoteManagerClass.add,
      recover = NoteManagerClass.recover;

let NoteManager = {
    load,
    add,
    recover
};


export default NoteManager;