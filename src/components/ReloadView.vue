<style>
    .ReloadView{flex:1;  display:flex;  }
    .ReloadView>.van-pull-refresh{flex:1;  display:flex;  }
    .ReloadView>.van-pull-refresh>.van-pull-refresh__track{flex:1;  }
</style>
<template>

    <div class='ReloadView'>
        <van-pull-refresh v-model="view.reloading" @refresh=" $emit('reload'); $emit('input',0) ">
            <slot />
        </van-pull-refresh>
    </div>
</template>

<script>
    export default{
        props : {
            value : Number,
            autoInit : Boolean,
            padding : String
        },
        data(){
            return {
                view : {
                    reloading : false,
                },
            }
        },
        methods : {
            init(){

                this.view.reloading=true
                this.$emit('input',0)
                this.$emit('reload')
            }
        },
        watch : {
            value(newValue , oldValue){
                if(newValue==-1){
                    this.init()
                    return
                }
                if(newValue==1){
                    this.$emit('input',0)
                    this.view.reloading=false
                    return
                }
            }
        },
        mounted(){
            if(this.autoInit){
                this.init()
            }
        }
    }
</script>
