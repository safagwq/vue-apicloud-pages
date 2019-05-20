<style>
</style>

<template>
    <span class="touch-expand" @click="getAuthCode">{{ value<=0?'获取验证码':value+'秒后获取' }}</span>
</template>

<script>
    export default{
        props : ['value','time','auto'],
        methods:{
            getAuthCode(){
                if(this.value>0){
                    return
                }

                this.$emit('input',this.time||60)
                this.$emit('click')
                this._timeout=setTimeout(this.timeout,1000)
            },
            timeout(){
                if(this.value<=0){
                    return
                }

                this.$emit('input',this.value-1)
            }
        },
        mounted : function(){
            console.log(this.value)
            this._timeout=setTimeout(this.timeout,1000)
        },
        watch:{
            value(){
                if(this.auto=='false'){
                    return
                }

                clearTimeout(this._timeout)
                this._timeout=setTimeout(this.timeout,1000)
            }
        },
    }
</script>

