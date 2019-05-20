import Vue from 'vue'
import $ from 'jquery'
import DataFilters from './DataFilters'

import { Toast, Dialog } from 'vant'

window.$=$

// 请求失败时重连次数(不包含本次请求 , 设为3 则最多可能会请求4次)
var ajaxReconnection = 3
// 超时设置 , 超过这个时间的时候 , 请求失败 .
var ajaxTimeout = 3000

var rootUrl = ''

export var rootUrl = rootUrl


var requestCenter = {
    defaultFilter(res){
        if(res.code!=0)return
        return res.data || true
    },
    defaultCatch(data){
        Toast(data.msg)
    },
    defaultError(ajaxReq){

        if(this && this.$getAppViewPublic){
            var appViewPublic=this.$getAppViewPublic()
            appViewPublic.view.badInternet=1

            appViewPublic.cacheBadReq(ajaxReq)
        }
    },
    
}


Vue.prototype.$req=$req
Vue.prototype.$setValue=$setValue

export function $req(url,reqData={},updataName){

    var reqObj = getReqObj(url) || {}
    url=reqObj.url||url

    if(reqObj.$req){
        reqObj.$req.call(this,reqData,updataName)
        return
    }

    if(typeof reqData=='string' && updataName===undefined){
        updataName=reqData
        reqData={}
    }

    var _reqData={}
    for(var i in reqData){
        if(i[0]!=('_')){
            _reqData[i]=reqData[i]
        }
    }


    _reqData.token=localStorage.token

    var promiseObj=new EasePromise((promise)=>{
        var sendUrl = url.indexOf('http')==0 ? url : rootUrl+ url
        
        var _ajaxReconnection=ajaxReconnection

        var always=()=>{
            promise.loadingTimeout && clearTimeout(promise.loadingTimeout)
            promise._autoClearPopup && Toast.clear()
            promise.alwaysCallback && promise.alwaysCallback()
        }




        var ajaxReq=()=>{

            $.ajax({
                headers : {
                    // 'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
                    // 'Content-Type':'application/json;charset=UTF-8'
                },
                timeout : ajaxTimeout,
                method : reqObj.method || 'post',
                url : sendUrl,
                data : _reqData,
            })
            .always((res,status,xhr)=>{

                if(status=='error' || status=='timeout'){

                    if(_ajaxReconnection!=0){
                        _ajaxReconnection--
                        console.error(res)
                        ajaxReq()
                    }
                    else{
                        if(promise.errorCallback){
                            promise.errorCallback(res)
                        }
                        else{

                            always()
                            ;(reqObj.error || requestCenter.defaultError).call(this,ajaxReq)
                        }
                    }

                    return
                }

                if(_ajaxReconnection==0){
                    if(promise.onlineCallback){
                        promise.onlineCallback(res)
                    }
                    else{
                        (reqObj.online || requestCenter.defaultOnline).call(this,ajaxReq)
                    }
                }

                always()

                if(res.code==-5000){
                    Toast(res.msg)

                    $appRouter.replaceHome('/login')
                    localStorage.token=''
                    localStorage.lastLoginUser = this.$store.state.userinfo.use_info.id
                    return
                }

                if(status=='success'){

                    var filterData = (reqObj.filter || requestCenter.defaultFilter).call(this,res,_reqData)
                    if(filterData){

                        if(promise.toastMessage){
                            var toastData={
                                message : promise.toastMessage,
                            }
                            if(promise.toastType){
                                toastData.type=promise.toastType
                            }
                            Toast(toastData)
                        }
                        if(updataName){
                            this && this.$setValue(updataName,filterData)
                        }
                        promise.thenCallback && promise.thenCallback(filterData)
                    }
                    else{
                        if(promise.catchCallback){
                            promise.catchCallback(res)
                        }
                        else{
                            requestCenter.defaultCatch.call(this,res)
                        }
                    }
                }
            })
        }

        ajaxReq()
    })

    return promiseObj
}

function getReqObj(url){
    if(typeof url=='object'){
        return url
    }
    var findName=Object.keys(requestCenter).find(name=>{
        if(name.includes('*')==true){
            var index=name.indexOf('*')
            return name.slice(0,index)==url.slice(0,index)
        }
        else{
            return name==url
        }
    })

    return requestCenter[findName]
}

function $setValue(name,data){
    if(!name){
        return
    }

    var path=name.split('.')

    if(path.length==1){
        this[name] = data
        return
    }

    var obj=this

    for(var i=0;i<path.length-1;i++){
        obj=obj[path[i]]
        if(!obj){
            break
        }
    }

    obj[path[path.length-1]] = data
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
        this.thenCallback=cb
        return this
    }

    catch(cb){
        this.catchCallback=cb
        return this
    }

    error(cb){
        this.errorCallback=cb
        return this
    }

    always(cb){
        this.alwaysCallback=cb
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
