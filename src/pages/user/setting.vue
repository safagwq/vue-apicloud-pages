<style>
    form{padding-top:64px;  }
    label{height:44px;  display:block;  display:flex;  align-items:center;  margin-top:10px;  }
    label>span{width:80px;  display:flex;  flex-direction:row-reverse;  padding-right:5px;  }
    label>input{flex:1;  height:100%;  padding:0 5px;  }
</style>

<template>
    <div id='user'>
        <HeaderTemp dark='true' isBack='true'>setting</HeaderTemp>

        <form>
            <label v-for='value,name in form'>
                <span>{{name}}</span>
                <input v-model='form[name]'/>
            </label>
        </form>

        <button type='button' @click='save()'>保存退出</button>
    </div>
</template>

<script>
    export default{
        data(){
            return{
                form : {}
            }
        },
        mounted(){
            this.$api.onReady(this.init)
        },
        methods:{
            init(){
                this.$api.on('update:setting')
            },
            save(){
                api.sendEvent({
                    name : 'sendData',
                    extra : {}
                })
            }
        },
    }
</script>