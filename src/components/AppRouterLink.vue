<template>
    <a @click="$emit('click',$event) ; click($event)">
        <slot/>
    </a>
</template>

<script>
    export default{
        props : ['params','to','isBack'],
        methods:{
            click(){
                var routeData={
                    path : this.to,
                    params : this.params,
                }

                if(this.isBack){
                    this.$router.back(this.params)
                    return 
                }

                this.$router.push(routeData)
            }
        },
    }
</script>