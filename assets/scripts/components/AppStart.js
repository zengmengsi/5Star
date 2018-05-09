function urlParse() {
    var params = {};
    if (window.location == null) {
        return params;
    }
    var name, value;
    var str = window.location.href; //取得整个地址栏
    var num = str.indexOf("?")
    str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]

    var arr = str.split("&"); //各个参数放到数组里
    for (var i = 0; i < arr.length; i++) {
        num = arr[i].indexOf("=");
        if (num > 0) {
            name = arr[i].substring(0, num);
            value = arr[i].substr(num + 1);
            params[name] = value;
        }
    }
    return params;
}

function initMgr() {
    cc.vv = {};
    var UserMgr = require("UserMgr");
    cc.vv.userMgr = new UserMgr();

    var ReplayMgr = require("ReplayMgr");
    cc.vv.replayMgr = new ReplayMgr();

    cc.vv.http = require("HTTP");
    cc.vv.global = require("Global");
    cc.vv.net = require("Net");

    var GameNetMgr = require("GameNetMgr");
    cc.vv.gameNetMgr = new GameNetMgr();
    cc.vv.gameNetMgr.initHandlers();

    var AnysdkMgr = require("AnysdkMgr");
    cc.vv.anysdkMgr = new AnysdkMgr();
    cc.vv.anysdkMgr.init();

    var VoiceMgr = require("VoiceMgr");
    cc.vv.voiceMgr = new VoiceMgr();
    cc.vv.voiceMgr.init();

    var AudioMgr = require("AudioMgr");
    cc.vv.audioMgr = new AudioMgr();
    cc.vv.audioMgr.init();

    var Utils = require("Utils");
    cc.vv.utils = new Utils();

    //var MJUtil = require("MJUtil");
    //cc.vv.mjutil = new MJUtil();

    cc.args = urlParse();
}



cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        // label: {
        //     default: null,
        //     type:cc.Label
        // },

        loadingProgess: cc.Label,
        _stateStr: '',
        _progress: 0.0,
        _isLoading: false,
    },

    // use this for initialization
    onLoad: function() {
        if (!cc.sys.isNative && cc.sys.isMobile) {
            var cvs = this.node.getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = true;
        }
        initMgr();
        this.loadingProgess.string = this._stateStr;
        this.startPreloading();
        // console.log('haha'); 
        // this._mainScene = 'loading';
        // this.showSplash(function(){

            // var url = cc.url.raw('resources/ver/cv.txt');
            // cc.loader.load(url,function(err,data){
            //     cc.VERSION = data;
            //     console.log('current core version:' + cc.VERSION);
                this.getServerInfo();
            // }.bind(this));
        // }.bind(this));
    },

    startPreloading: function() {
        this._stateStr = "正在加载资源，请稍候"
        this._isLoading = true;
        var self = this;

        cc.loader.onProgress = function(completedCount, totalCount, item) {
            //console.log("completedCount:" + completedCount + ",totalCount:" + totalCount );
            if (self._isLoading) {
                self._progress = completedCount / totalCount;
            }
        };

        cc.loader.loadResAll("textures", function(err, assets) {
            self.onLoadComplete();
        });
    },
    onLoadComplete: function() {
        this._isLoading = false;
        this._stateStr = "准备登陆";
        console.log('准备登陆wx');
        // cc.director.loadScene("login");
        cc.vv.audioMgr.playBGM("bgMain.mp3");
        // var button = wx.createUserInfoButton({
        //     type: 'text',
        //     text: '获取用户信息',
        //     style: {
        //         left: 10,
        //         top: 76,
        //         width: 200,
        //         height: 40,
        //         lineHeight: 40,
        //         backgroundColor: '#ff0000',
        //         color: '#ffffff',
        //         textAlign: 'center',
        //         fontSize: 16,
        //         borderRadius: 4
        //     }
        // });
        // button.show()
        // button.onTap((res) => {
        //     console.log(res)
        // });
        // wx.authorize({
        //     scope: 'scope.record'
        // })
        // wx.login({
        //     success: function() {
        //         wx.getUserInfo({
        //             openIdList: ['selfOpenId'],
        //             lang: 'zh_CN',
        //             success: function(res) {
        //                 console.log('success', res);
        //                 let ret = {
        //                     errcode: 0,
        //                     account: res.userInfo.nickName,
        //                     sign: res.signature,
        //                     userInfo: JSON.stringify(res.userInfo)
        //                 }
        //                 cc.vv.userMgr.onAuth(ret);
        //             }
        //         })
        //     }
        // })
        //修改成不用登录的版本，每次都是gust
        cc.vv.userMgr.guestAuth();
        // console.log(scope.userInfo)
        cc.loader.onComplete = null;
    },

    // onBtnDownloadClicked:function(){
    //     cc.sys.openURL(cc.vv.SI.appweb);
    // },

    // showSplash:function(callback){
    //     var self = this;
    //     var SHOW_TIME = 3000;
    //     var FADE_TIME = 500;
    //     this._splash = cc.find("Canvas/splash");
    //     if(true || cc.sys.os != cc.sys.OS_IOS || !cc.sys.isNative){
    //         this._splash.active = true;
    //         if(this._splash.getComponent(cc.Sprite).spriteFrame == null){
    //             callback();
    //             return;
    //         }
    //         var t = Date.now();
    //         var fn = function(){
    //             var dt = Date.now() - t;
    //             if(dt < SHOW_TIME){
    //                 setTimeout(fn,33);
    //             }
    //             else {
    //                 var op = (1 - ((dt - SHOW_TIME) / FADE_TIME)) * 255;
    //                 if(op < 0){
    //                     self._splash.opacity = 0;
    //                     callback();   
    //                 }
    //                 else{
    //                     self._splash.opacity = op;
    //                     setTimeout(fn,33);   
    //                 }
    //             }
    //         };
    //         setTimeout(fn,33);
    //     }
    //     else{
    //         this._splash.active = false;
    //         callback();
    //     }
    // },

    getServerInfo:function(){
        var self = this;
        var onGetVersion = function(ret){
            if(ret.version == null){
                console.log("error.");
            }
            else{
                cc.vv.SI = ret;//取后台返回的url
                // if(ret.version != cc.VERSION){
                //     cc.find("Canvas/alert").active = true;
                // }
                // else{
                //     cc.director.loadScene(self._mainScene);
                // }
            }
        };

        var xhr = null;
        var complete = false;
        var fnRequest = function(){
            self.loadingProgess.string = "正在连接服务器";
            xhr = cc.vv.http.sendRequest("/get_serverinfo",null,function(ret){
                xhr = null;
                complete = true;
                onGetVersion(ret);
            });
            setTimeout(fn,5000);            
        }

        var fn = function(){
            if(!complete){
                if(xhr){
                    xhr.abort();
                    self.loadingProgess.string = "连接失败，即将重试";
                    setTimeout(function(){
                        fnRequest();
                    },5000);
                }
                else{
                    fnRequest();
                }
            }
        };
        fn();
    },
    log:function(content){
        this.label.string += content + '\n';
    },
});