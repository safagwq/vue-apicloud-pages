import Vue from 'vue'


window.apiready=function(){

    window.apiready.isReady = true
    window.apiready.callbackList.forEach((cb)=>{
        cb()
    })

    api.addEventListener({ name : 'sendData' },onSendData)
}


window.apiready.callbackList=[]


export var $api={
    _events : {
        ajax : []
    },

    getOpenViewParams(path,data,option){
        var params = { 
            name : path , 
            url:localStorage.rootPath + path ,
            useWKWebView : true,
            historyGestureEnabled : false,
            pageParam : data || {},
        }

        for(var i in option){
            params[i] = option[i]
        }
        return params
    },
    ready(cb){
        if(window.apiready.isReady){
            setTimeout(cb,1)
        }
        else{
            window.apiready.callbackList.push(cb)
        }
    },

    on(eventName,key,callback){

        if(arguments.length==2){
            callback = key
            key = null
        }

        if(!$api._events[eventName]){
            $api._events[eventName]=[]
        }

        $api._events[eventName].push({ key , callback })
    },
    off(eventName,key){
        if( !$api._events[eventName] )return

        $api._events[eventName] = $api._events[eventName].filter(bindEvent=>bindEvent.key!=key)
    },
    send(eventName,key,data){

        if(arguments.length<=2){
            data = key
            key = null
        }

        api.sendEvent({
            name : 'sendData',
            extra : {
                type : eventName,
                data : data,
                key : key,
            }
        })
    },
    
    ajax(method,name,sendData,updateValueName){
        var key=getRandom()

        return new EasePromise((promise)=>{
            api.sendEvent({
                name : 'ajax',
                extra : {
                    method,
                    name,
                    key,
                    sendData,
                }
            })

            $api.on('ajax',key,(data)=>{
                $api.off('ajax',key)
                promise._then && promise._then(data)
            })
        })
    },
    get : (name,sendData,updateValueName)=>{
        return this.ajax( 'get', name,sendData,updateValueName )
    },
    post : (name,sendData,updateValueName)=>{
        return this.ajax( 'post', name,sendData,updateValueName )
    },
    put : (name,sendData,updateValueName)=>{
        return this.ajax( 'put', name,sendData,updateValueName )
    },
    delete : (name,sendData,updateValueName)=>{
        return this.ajax( 'delete', name,sendData,updateValueName )
    },

    share : share,
}

export var modules={
    mam : null,
    wx : null,
}


Vue.prototype.$api=$api


function onSendData(ret){
    var message = ret.value

    if( !$api._events[message.type] )return

    var bindEvent = $api._events[message.type].find((bindEvent)=>bindEvent.key===message.key)
    bindEvent && bindEvent.callback && bindEvent.callback(message.data)
}

function getRandom(){
    return Math.random()
}













// to   : WX , PengYouQuan ,  QQ , WeiBo , local
// type : image , video , text , link(text和link不支持本地存储)
// data : 
//     text  : String,
//     image ,link , video : { title : String , url : String , preview : String }

function share(shareParams){

    switch(shareParams.to){
        case 'WX':
        case 'PengYouQuan':
            shareToWX(shareParams)
            break
        case 'QQ':
            shareToQQ(shareParams)
            break
        case 'WeiBo':
            shareToWeiBo(shareParams)
            break
        case 'local':
            shareToLocal(shareParams)
            break
    }
}


shareToWX.functionsName={
    text : 'shareText' ,
    image : 'shareImage' ,
    video : 'shareVideo' ,
    link : 'shareWebpage' ,
}

shareToWX.functionsFilter={
    text : (to,data)=>{
        return {
            scene : shareToWX.getScene(to),
            text : data
        }
    },
    image : (to,data)=>{
        return {
            scene : shareToWX.getScene(to),
            thumb : data.preview,
            contentUrl : data.url,
        }
    },
    video : (to,data)=>{
        return {
            scene : shareToWX.getScene(to),
            title : data.title,
            thumb : data.preview,
            contentUrl : data.url,
        }
    },
    link : (to,data)=>{
        return {
            scene : shareToWX.getScene(to),
            title : data.title,
            thumb : data.preview,
            contentUrl : data.url,
        }
    },
}

shareToWX.getScene=(to)=>{ return to=='WX'?'session':'timeline' }

function shareToWX({to,type,data,callback}){

    modules.wx = api.require('wx')
    var shareFunctionsName = shareToWX.functionsName[type]
    var shareFunctionsFilter = shareToWX.functionsFilter[type](to,data)

    modules.wx[shareFunctionsName]( shareFunctionsFilter ,function(ret, err) {
        // if (ret.status) {
        //     alert('分享成功')
        // }
        // else {
        //     alert(err.code)
        // }
    })
}




function shareToLocal({type,data,callback}){
    if(type=='link' || type=='text'){
        return
    }

    saveImage(data.url,type)
}

function saveToAlbum(fileName){
    
    api.saveMediaToAlbum({
        path: fileName
    },function (ret, err) {
        if (ret && ret.status) {

            api.toast({
                msg: "保存成功",
                duration: 2000,
                location: 'bottom'
            })

        } else {

            api.toast({
                msg: "保存失败",
                duration: 2000,
                location: 'bottom'
            })
        }
    })

}


export function saveImage(imgPath,type){
    if(/^file\:\/\//.test(imgPath)){
        saveToAlbum(imgPath.replace(/^file\:\/\//,''))
        return
    }

    var fileName = 'fs://'+Date.now()+'QR'+ (type=='image'?'.jpg':'.mp4')

    api.download({
        url: imgPath,
        savePath: fileName,
        report: true,
        cache: true,
        allowResume: true
    },function (ret, err) {
        if (ret.state == 1) {
            saveToAlbum(fileName)
        }
    })
}









class EasePromise{

    constructor(fn){
        setTimeout(()=>{
            if(this.confirmMessage){

                Dialog.confirm({
                    message : this.confirmMessage,
                    title : this.confirmTitle,
                })
                .then(()=>{
                    fn( this )
                })
                return
            }

            if(typeof this.loadingMessage!='undefined'){

                this.loadingTimeout=setTimeout(()=>{
                    Toast.loading({
                        message : this.loadingMessage,
                        duration : 0,
                        forbidClick : true,
                    })
                },this.loadingTime||10)
            }

            fn( this )
        },1)
    }

    then(cb){
        this._then=cb
        return this
    }

    catch(cb){
        this._catch=cb
        return this
    }

    error(cb){
        this._error=cb
        return this
    }

    always(cb){
        this._always=cb
        return this
    }

    toast(message,type){
        this.toastMessage=message||''
        this.toastType=type||undefined
        return this
    }
    loading(message,time){
        this.loadingMessage=message||''
        this.loadingTime=time
        this.loadingTimeout=null
        return this
    }
    confirm(message,title){
        this.confirmMessage=message
        this.confirmTitle=title||''
        return this
    }

    autoClearPopup(){
        this._autoClearPopup=true
        return this
    }

}
