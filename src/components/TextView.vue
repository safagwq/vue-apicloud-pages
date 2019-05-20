<style>
    .textView{line-height:1;  overflow:hidden;  position:relative;  }
    .textView-content{position:absolute;  top:0;  left:0;  width:100%;  -webkit-box-orient:vertical;  -webkit-line-clamp:1;  display:-webkit-box;  overflow:hidden;  word-break:break-all;  }
    .textView-auto-height{word-break:break-all;  opacity:0;  pointer-events:none;  }
</style>

<template>
    <div class="textView" :style="{ color, fontSize, lineHeight, maxHeight:__maxHeight }">
        <div class="textView-auto-height" :style="{ marginTop:__marginValue ,  marginBottom:__marginValue}"><slot/></div>
        <div class="textView-content" :style="{ marginTop:__marginValue ,  webkitLineClamp:line }"><slot/></div>
    </div>
</template>

<script>

    export default{
        data(){

            var font=this.font.split('/')

            var fontSize = font[0] || '1em'
            var lineHeight = font[1] || '1em'

            fontSize = /(px|em)/.test( fontSize )?fontSize : fontSize+'px'
            lineHeight = /(px|em)/.test( lineHeight )?lineHeight : lineHeight+'em'
            
            return {
                fontSize,
                fontSizeNum : parseFloat(fontSize),
                fontSizeIsEm : fontSize.includes('em'),

                lineHeight,
                lineHeightNum : parseFloat(lineHeight),
                lineHeightIsPx : lineHeight.includes('px'),
            }
        },
        props : {
            'line':{
                default : '1',
            },
            'font':{
                default : '',
            },
            'color':{}
        },
        computed : {

            __maxHeight(){

                if(this.lineHeightIsPx){
                    return this.lineHeightNum*parseInt(this.line) - (this.lineHeightNum-this.fontSizeNum) + 'px'
                }
                else{
                    if(this.fontSizeIsEm){
                        return this.lineHeightNum*parseInt(this.line) - (this.lineHeightNum-1) + 'em'
                    }
                    else{
                        return this.fontSizeNum*this.lineHeightNum*parseInt(this.line) - this.fontSizeNum*(this.lineHeightNum-1) + 'px'
                    }
                }
            },
            __marginValue(){

                if(this.lineHeightIsPx){
                    return -(this.lineHeightNum-this.fontSizeNum)/2 +'px'
                }
                else{
                    return -(this.lineHeightNum-1)/2 +'em'
                }

            }
        }
    }
</script>


