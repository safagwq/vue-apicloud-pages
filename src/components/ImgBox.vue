<style>
    .ImgBox{position:relative;  height:100%;  width:100%;  overflow:hidden;  }
    .ImgBox-target{position:absolute;  top:0;  left:0;  width:100%;  height:100%;  background-position:center;  background-repeat:no-repeat;  }
</style>

<template>
    <div class="ImgBox" :style="{width:width, height:height, borderRadius:round=='true'?'50%':''}">
        <div class="ImgBox-target" :style="{backgroundImage:backgroundSrc, backgroundSize:backgroundSize, maxWidth:max, maxHeight:max }"></div>
        <slot />
    </div>
</template>

<script>
    export default {
        props : ['src','max','type','width','height','round'],
        computed:{
            backgroundSrc(){
                return `url('${this.src}')`
            },
            backgroundSize(){
                return this.type=='cover'?'cover':'contain'
            }
        },
    }
</script>


