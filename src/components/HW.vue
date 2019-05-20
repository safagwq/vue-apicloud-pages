<style>
    .HW{position:relative;  }
    .HW-content{position:absolute;  top:0;  left:0;  height:100%;  width:100%;  }
</style>

<template>
    <div class="HW" :style="{paddingTop:paddingTop}">
        <div class="HW-content">
            <slot />
        </div>
    </div>
</template>

<script>
    export default{
        props : {
            hw:{
                type:Number,
                default:1,
            }
        },
        computed:{
            paddingTop(){
                return this.hw*100+'%'
            }
        }
    }
</script>

