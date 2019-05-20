<template>
    <div id='user'>
        <HeaderTemp dark='true'>home</HeaderTemp>
        
    </div>
</template>

<script>
    export default{
        methods:{
            init(){

                this.$api.get('index')
                .then((data)=>{
                    alert(JSON.stringify(data,null,2))

                    // this.$api.send('updata:userinfo',123123123)
                })

            }
        },
        mounted(){
            this.$api.ready(this.init)
        },
    }
</script>