;(function(window,$,undefined){
   'use strict';

   var Dialog = function(){};

   Dialog.prototype = {

      params: {
           title: '这里是标题',      // 标题
           msg: '这里是内容',        // 主体内容
           btns: ['确定','取消'],    // 按钮组
           closeColor: '#000',      // 关闭按钮颜色
           ShadeColor: '#000',      // 遮罩层背景颜色
           isShowBtn: true,         // 是否显示按钮
           isShowTitle: true,       // 是否显示标题
           isShowClose: true,       // 是否有关闭按钮
           isMsgPadding: true,      // 内容是否有内边距
           isShadeClick: false      // 遮罩层是否可以点击关闭
      },

      create: function(){
         var params = this.params,
             self   = this,
             dialogHtml  = '',
             headerHtml  = '',
             msgHtml     = '',
             btnsHtml    = '',
             footerHtml  = '',
             closeHtml   = '',
             template    = '';


         // 生成主体内容
         msgHtml = '<div class="dialog-body">'+params.msg+'</div>';
         // 是否生成关闭按钮
         if(params.isShowClose){
            closeHtml = '<span class="dialog-icon icon-htmal5icon19"></span>';
         };

         // 是否生成标题
         if(params.isShowTitle){
            headerHtml = '<div class="dialog-header">'+params.title+'</div>'
         };

         // 是否生成底部按钮
         if(params.isShowBtn){

            // 按钮最多不能超过三个
            if(params.btns.length<=3){
               for(var i=0;i<params.btns.length;i++){
                  var name = params.btns[i]['name'] ? params.btns[i]['name'] : params.btns[i];
                  btnsHtml += '<div class="dialog-btn">'+name+'</div>';
               }
            }else{
                 btnsHtml += '<div class="dialog-btn">定义的按钮最多三个</div>';
            }

            footerHtml = '<div class="dialog-footer">'+btnsHtml+'</div>';
         };

         // 拼接html
         template = headerHtml+msgHtml+footerHtml+closeHtml;
         // 生成完整弹出框
         dialogHtml = '<div class="dialog">'+template+'</div>';
         // 将弹出框dom字符串写入到body中
         document.body.insertAdjacentHTML('beforeend', dialogHtml);

         // 创建遮罩层并写入到body中
         if(!document.querySelector(".mask")){
            var maskHtml = '<div class="mask"></div>';
            document.body.insertAdjacentHTML('beforeend', maskHtml);
         };

         this.show();  // 样式设置

      },

      show: function(){
         if(!document.querySelector(".dialog")) return;

         // 设置dialog弹出框的最大高度
         document.querySelector('.dialog').style.maxHeight = document.documentElement.clientHeight * 0.8+'px';

         // 如果内容边框的控制值为false，则将内容主体内边距设置为0
         if(!this.params.isMsgPadding){
            document.querySelector('.dialog .dialog-body').style.padding = 0;
         };

         // 控制关闭按钮的颜色值
         if(this.params.isShowClose){
            document.querySelector('.dialog .dialog-icon').style.color = this.params.closeColor;
         }

         // 如果只剩弹出框头部不存在时,将内容主体加圆角
         if(!this.params.isShowTitle){
            document.querySelector('.dialog .dialog-body').style.borderRadius = '0.16rem 0.16rem 0 0';
         };

         // 如果只剩弹出框头部不存在时,将内容主体加圆角
         if(!this.params.isShowBtn){
           document.querySelector('.dialog .dialog-body').style.borderRadius = '0 0 0.16rem 0.16rem';
         };


         // 设置dialog弹出框的位置--->左右、上下居中
         var dialogLeft = (document.documentElement.clientWidth - document.querySelector('.dialog').offsetWidth)/2+"px",
             sHeight = document.documentElement.clientHeight/2,
             dHeight;

         // 如果内容中是否包含有图片的情况
         if(document.querySelector(".dialog img")){
            // 有图片时，当图片挂载完成后再获取弹出框的高度，进行高度居中设置
            document.querySelector(".dialog img").addEventListener('load',function(e){
               dHeight = document.querySelector(".dialog").offsetHeight/2;
               document.querySelector('.dialog').style.marginTop = sHeight-dHeight+'px';
            })
         }else{
             // 没有图片时，进行高度居中设置
             dHeight = document.querySelector(".dialog").offsetHeight/2;
             document.querySelector('.dialog').style.marginTop = sHeight-dHeight+'px';
         }
         // 左右居中设置
         document.querySelector('.dialog').style.marginLeft = dialogLeft;

         // 设置遮罩层的背景颜色
         document.querySelector('.mask').style.background = this.params.ShadeColor;

         // 给遮罩层和弹出框添加类样式
         setTimeout(function(){
            document.querySelector(".mask").classList.add("mask-in");
            document.querySelector(".dialog").classList.add("dialog-in");
         }, 10)


         // 清除手指在元素上划动时的默认事件
         document.querySelector(".mask").addEventListener("touchmove", function(e){
            e.preventDefault();
         })
         document.querySelector(".dialog").addEventListener("touchmove", function(e){
            e.preventDefault();
         })

         this.bind();  // 事件绑定
         return;

      },

      bind: function(){
         var self = this;

         // 如果isShadeClick为true时，可以点击遮罩层关闭弹窗
         if(self.params.isShadeClick){
            document.querySelector('.mask').addEventListener('click',function(e){
               self.close();
            })
         }

         // 如果isShowClose为true时，可以点击close按钮关闭弹窗
         if(self.params.isShowClose){
            document.querySelector(".dialog .dialog-icon").addEventListener('click',function(){
               self.close();
            })
         }

         var Btns= document.querySelectorAll(".dialog .dialog-btn");
         if(Btns && Btns.length>0 && self.params['btns'].length<=3){
            for(var k=0;k<Btns.length;k++){
               Btns[k].idx = k;
               Btns[0].style.color = '#0066CD';
               Btns[k].addEventListener('click',function(){
                  for(var i=0;i<Btns.length;i++){
                     Btns[i].style.color = '#999';
                  }
                  this.style.color = '#0066CD';

                  if(self.params.btns[this.idx].callback){
                     self.params.btns[this.idx].callback();
                  }
                  self.close();
                  return;
               });
            }
         }
      },


      close: function(){
         var self = this;

         document.querySelector(".mask").classList.remove("mask-in");
         document.querySelector(".dialog").classList.remove("dialog-in");
         document.querySelector(".dialog").classList.add("dialog-out");

         if(document.querySelector(".dialog:not(.dialog-out)")){
            setTimeout(function(){
               if(document.querySelector(".dialog")){
                  document.querySelector(".dialog").parentNode.removeChild(document.querySelector(".dialog"));
               }
               self.show();
               return true;
            },200)
         }else{
            document.querySelector(".mask").classList.add("mask-out");
            document.querySelector(".dialog").addEventListener("webkitTransitionEnd", function(){
               self.remove();
            })
            document.querySelector(".dialog").addEventListener("transitionend", function(){
               self.remove();
            })
         }
      },

      remove: function(){
        // 如果dialog存在，则移除dislogDOM元素
        if(document.querySelector(".dialog")){
           document.querySelector(".dialog").parentNode.removeChild(document.querySelector(".dialog"));
        }

        // 如果mask遮罩层存在，则移除maskDOM元素的退出类
        if(document.querySelector(".mask")){
           document.querySelector(".mask").classList.remove("mask-out");
        }
        return true;
      },

      each: function(options){
         if(options.constructor !== Object){
            alert('如果有参数则必须是对象')
         }else{
            for(var key in options){
               this.params[key] = options[key];
            }
            this.create();
         }
      },

      open: function(params){
         params ? this.each(params) : this.create()
      }
   }

   window.Dialog = Dialog;

})(window,Zepto)
