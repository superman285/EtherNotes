import "../../sass/note.scss";

import {Toast} from "../mod/toast";
import Event from "./event";
import {msnry} from "../app";

import NProgress from "nprogress";
import 'nprogress/nprogress.css';

import {web3,abi,contractAddr,contractFounder,noteContractObj} from "./contractABI";

let userAddr = localStorage.userAddr;
let keyAddr = localStorage.keyAddr;

class Note {

    constructor(opts) {
        this.defaultOpts = {
            id: '',   //Note的 id
            $ct: $('#content').length > 0 ? $('#content') : $('body'),  //默认存放 Note 的容器
            context: 'input here'  //Note 的内容
        };
        this.initOpts(opts);
        this.createNote();
        this.setStyle();
        this.bindEvent();
    };

    initOpts(opts) {
        this.opts = $.extend({}, this.defaultOpts, opts || {});
        if (this.opts.id) {
            this.id = this.opts.id;
        }
    };

    createNote() {
        let tpl = '<div class="note item">'
            + '<div class="note-head"><span class="delete">&nbsp;&times;</span></div>'
            + '<div class="note-ct" contenteditable="true"></div>'
            + '</div>';
        this.$note = $(tpl);
        this.$note.find('.note-ct').html(this.opts.context);
        $('#content').append(this.$note);
        var self = this;
    };

    recover() {
        if (this.$note) {
            this.$note.find('.note-ct').html(this.opts.context);
        } else {
            console.log('$note is empty');
        }
    }

    setStyle() {
        let color = Note.colors[Math.floor(Math.random() * 15)];
        this.$note.find('.note-head').css('background-color', color[0]);
        this.$note.find('.note-ct').css('background-color', color[1]);
    };

    setLayout() {
        var self = this;
        if (self.clk) {
            clearTimeout(self.clk);
        }
        self.clk = setTimeout(function () {
            Event.fire('waterfall');
        }, 100);
    };

    bindEvent() {
        var self = this,
            $note = this.$note,
            $noteHead = $note.find('.note-head'),
            $noteCt = $note.find('.note-ct'),
            $delete = $note.find('.delete'),
            $addNote = $('.add-note');

        $delete.on('click', function () {
            self.delete();
        });
        $noteCt.on('focus', function () {
            if ($noteCt.html() == 'input here') $noteCt.html('');
            $noteCt.data('before', $noteCt.html());
        }).on('blur paste', function () {
            if ($noteCt.data('before') != $noteCt.html()) {
                $noteCt.data('before', $noteCt.html());
                self.setLayout();
                //self.edit($noteCt.html())
                self.edit($noteCt.html());
            }
        });
        //设置笔记的移动
        $noteHead.on('mousedown', function (e) {
            var evtX = e.pageX - $note.offset().left,
                evtY = e.pageY - $note.offset().top;
            $note.addClass('draggable').data('evtPos', {x: evtX, y: evtY});
        }).on('mouseup', function () {
            $note.removeClass('draggable').removeData('pos');
        });
        $('body').on('mousemove', function (e) {
            $('.draggable').length && $('.draggable').offset({
                top: e.pageY - $('.draggable').data('evtPos').y,
                left: e.pageX - $('.draggable').data('evtPos').x
            });
        });
    };

    static async add(val) {
        var self = this;
        let addRes;
        Toast("正在写入区块链，请稍等...",10000)
        await $.ajax({
            type: "POST",
            url: '/api/note/add',
            data: {
                uid: val.uid,
                note: val.note,
                key: keyAddr,
            },
            success: ret => {
                if (ret.status === 0) {
                    Toast('Add Note Success!',2500);
                    addRes = {
                        success: true,
                    }
                } else {
                    Event.fire('waterfall')
                    Toast(ret.errorMsg);
                    addRes = {
                        success: false,
                    }
                }
            },
        });
        if (addRes.success) {
            return true;
        } else {
            return false;
        }

    };

    async edit(msg) {

        var self = this;
        userAddr = localStorage.userAddr;

        if (!userAddr) {
            this.recover();
            Toast("游客只可以阅览便签!请先登录!");
            return;
        }

        NProgress.start();
        Toast("正在写入区块链，请稍等...",10000)
        $.post('/api/note/edit', {
            noteid: self.id,
            uid: userAddr,
            note: msg,
            key: keyAddr,
        }).done(function (ret) {
            if (ret.status === 0) {
                Toast('Update Note Success!',2500);
            } else {
                Toast(ret.errorMsg);
            }
            NProgress.done();
        }).fail(ret=>{
            this.recover();
            Toast("网络异常")
            NProgress.done();
        })
    };

    async delete() {

        var self = this;
        userAddr = localStorage.userAddr;
        if (!userAddr) {
            this.recover();
            Toast("游客无法进行删除操作!");
            return;
        }
        NProgress.start();
        msnry.layout();
        Toast("正在写入区块链，请稍等...",10000)
        $.ajax({
            type: "POST",
            url: '/api/note/delete',
            data: {
                noteid: self.id,
                uid: userAddr,
                key: keyAddr,
            }
        }).done(function (ret) {
            if (ret.status === 0) {
                Toast('Delete Note Success!',2500);
                self.$note.remove();
                Event.fire('waterfall')
            } else {
                Toast(ret.errorMsg);
            }
            NProgress.done();
        });
    };
}

Note.colors = [
    ['#EF5350', '#EF9A9A'], // headColor, containerColor
    ['#EC407A', '#F48FB1'],
    ['#AB47BC', '#CE93D8'],
    ['#5C6BC0', '#9FA8DA'],
    ['#42A5F5', '#90CAF9'],
    ['#26C6DA', '#80DEEA'],
    ['#26A69A', '#80CBC4'],
    ['#9CCC65', '#C5E1A5'],
    ['#D4E157', '#E6EE9C'],
    ['#FFEE58', '#FFF59D'],
    ['#FFCA28', '#FFE082'],
    ['#FFA726', '#FFCC80'],
    ['#8D6E63', '#BCAAA4'],
    ['#78909C', '#B0BEC5'],
    ['#BDBDBD', '#EEEEEE'],
];

export default Note;