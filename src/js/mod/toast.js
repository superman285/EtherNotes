import jQuery from 'jquery';
import "../../sass/toast.scss";

window.$ = window.jQuery = jQuery;

class toast {
    constructor(msg,time) {
        this.msg = msg;
        this.dismissTime = time || 1000;
        this.createToast();
        this.showToast();
    }

    createToast() {
        var tpl = `<div class="toast">${this.msg}</div>`;
        this.$toast = $(tpl);
        $('body').append(this.$toast);
    };

    showToast() {
        var self = this;
        this.$toast.fadeIn(300,()=>{
            setTimeout(()=>{
                self.$toast.fadeOut(300,()=>{
                    self.$toast.remove();
                });
            },self.dismissTime)
        });
    };
}

function Toast(msg,time) {
    return new toast(msg,time)
}

window.Toast = Toast;


export {toast,Toast}
