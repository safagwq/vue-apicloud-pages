<style>
    .NumberKey{position:fixed;  top:0;  left:0;  height:100%;  width:100%;  z-index:9999;  background:rgba(0,0,0,0.3);  user-select:none;  opacity:0;  pointer-events:none;  transform:translateY(-120vh);  }
    .NumberKey-bg{position:absolute;  top:0;  left:0;  right:0;  bottom:0;  }
    .NumberKey,
    .NumberKey *{box-sizing:border-box;  }
    .NumberKey-top{position:absolute;  top:15vw;  margin:auto;  width:300px;  left:0;  right:0;  overflow:hidden;  border-radius:5px;  background:#fff;  padding:10px;  opacity:0;  }
    .NumberKey-input{display:flex;  font-size:20px;  border:1px solid #ccc;  border-radius:5px;  height:40px;  }
    .NumberKey-grid{flex:1;  display:flex;  justify-content:center;  align-items:center;  border-right:1px solid #ccc;  position:relative;  }        

    .NumberKey-body{position:absolute;  bottom:0;  width:100%;  left:0;  padding-bottom:60%;  background:#ddd;  font-size:24px;  opacity:0;  }
    .NumberKey-body-box{position:absolute;  top:0;  left:0;  height:100%;  width:100%;  display:flex;  flex-direction:column;  padding:3px;  }
    .NumberKey-functions{position:absolute;  background:#eee;  bottom:100%;  left:0;  right:0;  display:flex;  flex-direction:row-reverse;  }
    .NumberKey-function{color:#4277c1;  padding:10px;  font-size:14px;  }

    /* 输入值 */
    .NumberKey-grid.hasValue::after{content:attr(data-value);  background:none;  height:auto;  width:auto;  }

    /* 光标 */
    .NumberKey-grid.active::after{opacity:0.2;  }
    .NumberKey-grid.active::before{content:'';  height:1em;  width:2px;  background:#000;  animation:NumberKey-grid-blink 1s infinite;  flex-shrink:0;  }

    .NumberKey-grid:last-child{border-right:none;  }
    .NumberKey-title{text-align:center;  font-size:16px;  line-height:40px;  margin-top:-10px;  }
    .NumberKey-title:empty{display:none;  }

    .NumberKey-close{position:absolute;  left:0;  top:0;  height:40px;  width:40px;  }

    .NumberKey-line{display:flex;  flex:1;  }
    .NumberKey-key{display:flex;  flex:1;  padding:3px;  }
    .NumberKey-key.hide{opacity:0;  pointer-events:none;  }
    .NumberKey-key.disabled{opacity:0.6;  pointer-events:none;  color:#999;  }
    .NumberKey-key.none{display:none;  }
    .NumberKey-key-box{display:flex;  flex:1;  border-radius:5px;  justify-content:center;  align-items:center;  height:100%;  background:#fff;  }


    /* 自由模式 */
    .NumberKey.infiniteModel .NumberKey-input{padding:0 5px;  }
    .NumberKey.infiniteModel .NumberKey-grid{flex:initial;  width:auto;  border-right:none;  }
    .NumberKey.infiniteModel .NumberKey-grid.active::after{opacity:1;  }
    .NumberKey.infiniteModel [data-value=" "]{flex:1;  display:flex;  }
    .NumberKey.infiniteModel [data-value=" "]::after{content:'';  flex:1;  }
    /* 密码模式 */
    .NumberKey.passwordModel .NumberKey-grid.hasValue::after{content:'';  height:5px;  width:5px;  border-radius:50%;  background:currentColor;  display:block;  }

    .NumberKey{animation:NumberKey-show 0.3s forwards;  pointer-events:auto;  }
    .NumberKey .NumberKey-top{animation:NumberKey-top-show 0.2s ease 0.1s forwards;  }
    .NumberKey .NumberKey-body{animation:NumberKey-body-show 0.3s ease 0.2s forwards;  }

    .NumberKey.hide{animation:NumberKey-hide 0.6s forwards;  }
    .NumberKey.hide .NumberKey-top{animation:NumberKey-top-hide 0.2s forwards;  }
    .NumberKey.hide .NumberKey-body{animation:NumberKey-body-hide 0.3s forwards;  }

    @keyframes NumberKey-hide{
        100%{opacity:0;  transform:translateY(-120vh);  }
        99%{opacity:0;  transform:translateY(0);  }
        50%{opacity:1;  transform:translateY(0);  }
        0%{opacity:1;  transform:translateY(0);  }
    }

    @keyframes NumberKey-top-hide{
        0%{transform:translateY(0px);  opacity:1;  }
        100%{transform:translateY(-50px);  opacity:0;  }
    }

    @keyframes NumberKey-body-hide{
        0%{transform:translateY(0px);  opacity:1;  }
        30%{transform:translateY(0px);  opacity:1;  }
        100%{transform:translateY(50px);  opacity:0;  }
    }

    @keyframes NumberKey-show{
        0%{opacity:0;  transform:translateY(-120vh);  }
        1%{opacity:0;  transform:translateY(0);  }
        100%{opacity:1;  transform:translateY(0);  }
    }

    @keyframes NumberKey-top-show{
        0%{transform:translateY(-50px);  opacity:0;  }
        100%{transform:translateY(0px);  opacity:1;  }
    }

    @keyframes NumberKey-body-show{
        0%{transform:translateY(50px);  opacity:0;  }
        100%{transform:translateY(0px);  opacity:1;  }
    }

    @keyframes NumberKey-grid-blink{
        0%{opacity:1;  }
        30%{opacity:1;  }
        50%{opacity:0;  }
        80%{opacity:0;  }
        100%{opacity:1;  }
    }

</style>

<template>
    <div v-if='selfShow' :class="{'NumberKey':true, hide : !show, infiniteModel:infiniteModel , passwordModel:passwordModel=='true' }" >
        <div class='NumberKey-bg' @click=" $emit('blur') "></div>
        <div class="NumberKey-top" v-if=" hideTop!='true' ">
            <div class="NumberKey-title">{{title}}</div>
            <div class="NumberKey-input">
                <span v-for="(text,index) in valueArr" :key='index' @click="setActiveIndex(index)" :class="{ 'NumberKey-grid':true , 'hasValue' : text!=' ' , active:index==activeIndex }" :data-value='text'></span>
            </div>
        </div>

        <div class="NumberKey-body">

            <div class="NumberKey-functions" v-if="hideFunctions!='true'">
                <div class="NumberKey-function" @click='end'>完成</div>
                <div class="NumberKey-function" @click='blur'>取消</div>
            </div>

            <div class="NumberKey-body-box">
                <div class="NumberKey-line" v-for="(keyLine,lineIndex) in numberValues" :key='lineIndex'>
                    <div v-for="(keyValue,valueIndex) in keyLine" class="NumberKey-key" :key='valueIndex' @click="pushValue(keyValue)">
                        <div :class="{'NumberKey-key-box':true }" :data-key-value="keyValue" v-text="keyValue"></div>
                    </div>
                </div>

                <div class="NumberKey-line">
                    <div :class="{'NumberKey-key':true, hide:hidePoint, disabled:isDisabledPoint }" @click="pushValue('.')" data-key-value='.'>
                        <div class="NumberKey-key-box">.</div>
                    </div>
                    <div :class="{'NumberKey-key':true, disabled : isDisabled_0 }" @click="pushValue('0')" data-key-value='0'>
                        <div class="NumberKey-key-box">0</div>
                    </div>
                    <div :class="{'NumberKey-key':true, disabled : isDisabledDel }" @click='del' data-key-value='del'>
                        <div class="NumberKey-key-box">X</div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    export default{
        props : ['show','value','title','type','length','max-length','passwordModel','pointAfterLength','hidePoint','hideFunctions','hideTop'],

        data : function (){

            var valueLength=parseInt(this.length)
            var valueMaxLength=parseInt(this.maxLength)

            return {
                numberValues : [['1','2','3'],['4','5','6'],['7','8','9']],
                closeTimeOut : null,
                infiniteModel : !valueLength,
                disabledInput : false,
                numberPointAfterLength : parseInt(this.pointAfterLength) || 0 ,
                valueLength : valueLength,
                valueMaxLength : valueMaxLength || 20,
                valueArr : [],
                activeIndex : 0,
                selfShow : this.show,
                selfHide : '',
                isSelfClose : false,
            }
        },

        mounted : function(){
            this.init(this.value)
        },
        methods:{
            init : function (newValue){

                var newValueParse = parseFloat(newValue)

                if(isNaN(newValueParse) && newValue!=''){
                    return
                }

                var newValueArr=( newValue==''?newValue:newValueParse ).toString().split('')

                if(this.infiniteModel){
                    newValueArr.push(' ')
                    this.activeIndex = newValueArr.length -1
                }
                else{
                    if(newValueArr.length > this.valueLength){
                        newValueArr.length = this.valueLength
                    }
                    else{
                        for(var i=newValueArr.length;i<this.valueLength;i++){
                            newValueArr.push(' ')
                        }
                    }

                    var activeIndex=newValueArr.indexOf(' ')
                    if(activeIndex==-1){
                        activeIndex=newValueArr.length
                    }

                    this.activeIndex = activeIndex
                }


                if(newValueArr.length>=this.valueMaxLength){
                    newValueArr.length=this.valueMaxLength
                    return
                }

                this.valueArr = newValueArr

            },
            pushValue : function (value){
                if(this.disabledInput){
                    return
                }

                if(this.valueArr.length==this.valueMaxLength){
                    return
                }

                if(this.infiniteModel){
                    if(this.numberPointAfterLength){
                        var pointIndex = this.valueArr.indexOf('.')
                        if(pointIndex!=-1 && this.valueArr.length - pointIndex - 1 > this.numberPointAfterLength){
                            return
                        }
                    }
                    this.valueArr.splice(this.activeIndex,0,value)
                }
                else{
                    if(this.valueArr.length == this.activeIndex){
                        return
                    }
                    this.$set(this.valueArr , this.activeIndex , value)
                }


                if(value=='.' && this.activeIndex==0 && this.passwordModel!='true'){
                    this.valueArr.unshift('0')
                    this.activeIndex++
                }

                this.activeIndex++ 

                this.$emit('input',this.valueStr)
            },
            setActiveIndex : function (index){
                if(this.valueArr[index-1]==' '){
                    index = this.valueArr.indexOf(' ')
                }

                this.activeIndex=index
            },
            del : function (){

                this.activeIndex--
                if(this.activeIndex<0){
                    this.activeIndex=0
                    if(this.valueArr[0]==' '){
                        return
                    }
                }

                // this.disabled=false

                if(this.infiniteModel){
                    this.valueArr.splice(this.activeIndex,1)
                }
                else{
                    this.valueArr.splice(this.activeIndex,1)
                    this.valueArr.push(' ')
                }

                this.$emit('input',this.valueStr)
            },
            end : function (){
                this.$emit('end',this.valueStr)
            },
            blur : function (){
                this.$emit('blur',this.valueStr)
            },
        },
        watch:{
            value : function (newValue,oldValue){
                if(newValue == this.valueStr){
                    return
                }

                this.init(newValue)
            },
            show : function (newValue){
                if(newValue==true){

                    clearTimeout(this.closeTimeOut)
                    this.selfShow = true
                }
                else{
                    this.closeTimeOut = setTimeout(()=>{
                        this.selfShow = false
                    },500)
                }
            }
        },
        computed:{
            valueStr : function (){
                return this.valueArr.filter(function (char){ return char!=' ' }).join('')
            },

            isDisabledPoint : function (){
                return this.passwordModel!='true' && this.infiniteModel && this.valueArr.indexOf(".")!=-1
            },

            isDisabled_0 : function (){
                var disabled_0 = this.passwordModel!='true' && this.valueArr.slice(0,this.activeIndex).every(function (num){
                    return num=='0'
                })

                if(this.valueArr[0]==' '){
                    return false
                }
                return disabled_0
            },
            isDisabledDel : function (){
                return false
            }
        },
    }
</script>