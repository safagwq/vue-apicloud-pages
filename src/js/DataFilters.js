import axios from 'axios'
import Bignumber from 'bignumber.js'

var DataFilters = {
    
    queryData : (url='')=>{

        var data={}
        var dataUrl=decodeURI( url.replace(/^\?/,'') )

        dataUrl.split('&').forEach((item)=>{
            var _indexOf=item.indexOf('=')
            var keyName = item.slice(0,_indexOf)
            if(keyName){
                data[keyName]= item.slice(_indexOf+1)
            }
        })

        return data
    },
    dataQuery : (data)=>{

        var dataArr=[]
        for(var i in data){
            dataArr.push(i+'='+data[i])
        }

        return '?'+encodeURI(dataArr.join('&'))
    },
    QNUploadFile({token,file,onprogress,callback}){
        if(typeof file=='string'){
            api.ajax({
                // headers : {"Content-Type": "multipart/form-data"},
                // url : 'https://upload-z2.qiniup.com',
                url : 'http://up-z0.qiniup.com',
                method: 'post',
                data : {
                    files : { file : file, },
                    values : { token : token, },
                },
                report : true,
            },(ret,err)=>{
                if(ret){
                    if(ret.status==0){
                        onprogress && onprogress(ret.progress)
                    }
                    if(ret.status==1){
                        onprogress && onprogress(100)
                        callback && callback(ret.body.hash)
                    }
                }
                // else{
                //     alert(JSON.stringify(err))
                // }
            })
        }
        else{

            var formData=new FormData()
            formData.append('file',file)
            formData.append('token',token)

            axios({
                method : 'post',
                // url : 'http://upload-z2.qiniup.com',
                url : 'https://up-z0.qiniup.com',
                headers: {"Content-Type": "multipart/form-data"},
                data : formData,
                onUploadProgress : function (status){
                    var progress=parseFloat(status.loaded / status.total * 100)
                    if(progress>95){
                        progress=95
                    }
                    onprogress && onprogress(progress)
                }
            })
            .then((res)=>{
                onprogress && onprogress(100)
                callback && callback(res.data.hash)
            })
        }
    },

    telFilter : (telValue)=>{
        return telValue.slice(0,3)+'****'+telValue.slice(7)
    },
    dateFormat : (date,formatStr)=>{

        var o = {   
            "M+" : date.getMonth()+1,
            "d+" : date.getDate(),
            "h+" : date.getHours(),
            "m+" : date.getMinutes(),
            "s+" : date.getSeconds(),
            "q+" : Math.floor((date.getMonth()+3)/3),
            "S"  : date.getMilliseconds()
        }

        if(/(y+)/.test(formatStr))   
            formatStr=formatStr.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
                for(var k in o)   
                    if(new RegExp("("+ k +")").test(formatStr))
                        formatStr = formatStr.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
        return formatStr
    },

    getComputeFrames : (videoElement,length,callback)=>{

        var canvasElement = document.createElement('canvas')
        var context = canvasElement.getContext("2d")
        var interval=null
        var width=0
        var height=0
        var canComputeFrame=true

        var list=[]

        videoElement.addEventListener("play", function onplay(){

            videoElement.removeEventListener('play',onplay)

            interval=setInterval(()=>{
                canComputeFrame=true
                videoElement.currentTime+=videoElement.duration/length-0.1
            },400)

            width = videoElement.videoWidth / 2
            height = videoElement.videoHeight / 2
            canvasElement.width=width
            canvasElement.height=height

            timerCallback()
        })

        videoElement.addEventListener("ended",function onended(){
            videoElement.removeEventListener('ended',onended)

            clearInterval(interval)
            callback(list,true)
        })



        function timerCallback() {
            if(videoElement.paused || videoElement.ended) {
                return
            }

            setTimeout(timerCallback,0)
            computeFrame()
        }


        function computeFrame() {
            context.drawImage(videoElement, 0, 0, width, height)

            var src=canvasElement.toDataURL("image/jpeg", 0.7)

            if(!list.length){
                videoElement.currentTime+=videoElement.duration/length-0.1
            }

            if(list.indexOf(src) ==-1 && canComputeFrame ){
                canComputeFrame=false

                list.push(src)
                callback(list)
                return

                // canvasElement.toBlob((file)=>{
                //     list.push({
                //         file : file,
                //         preview : URL.createObjectURL( file )
                //     })
                //     callback(list)
                // },"image/jpeg", 0.5)

            }

        }
    }

}


export default DataFilters