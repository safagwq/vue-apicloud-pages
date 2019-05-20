import Vue from 'vue'
import { $api, modules } from './apicloud.js'
import axios from 'axios'

window.axios = axios

$api.ready(()=>{
    initRootPath()
    checkUpdate()

    api.addEventListener({ name : 'ajax' },ajax)
})



function initRootPath(){
    var href=window.location.href
    localStorage.rootPath = href.slice(0,href.indexOf('index.html'))
}



function ajax(ret){

    var { name, sendData, method , key } = ret.value

    axios({
        method ,
        url : 'http://192.168.199.184:3000/fruits'
    })
    .then((res)=>{
        $api.send('ajax', key, res.data)
    })
}








function checkUpdate(){
    var mam = api.require('mam')

    mam.checkSmartUpdate(function(ret, err){
        if (ret) {

            if(ret.packages.length==0){
                return
            }

            if(ret.packages[0].extra.indexOf('自动升级')!=-1){
                modules.mam.startSmartUpdate()
                return
            }

            api.confirm({
                title : '系统升级',
                msg : '更新信息 : \n'+ ret.packages[0].extra.split('\\n').join('\n'),
                buttons : ["取消","升级"]
            },function (ret,err){
                if(ret.buttonIndex==2){
                    nowUpdate()
                }
            })

        }
    })
}

function nowUpdate(){
    var mam = api.require('mam')

    api.showProgress({
        title : '',
        text : '准备中...',
        modal : true,
    })

    

    mam.startSmartUpdate(function(ret, err){
        if (ret) {
            if(ret.state == 1){

                api.showProgress({
                    title : '',
                    text : '下载中('+ parseInt(ret.progress) +'%)',
                    modal : true,
                })
            }
            if(ret.state == 3){
                api.showProgress({
                    title : '',
                    text : '更新完成',
                    modal : true,
                })

                setTimeout(function(){
                    api.rebootApp()
                },2000)
            }
        }
        else{
            api.alert({
                title : '',
                msg : '更新失败 : \n'+JSON.stringify(err,null,4)
            })
        }
    })
}



