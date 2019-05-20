<style>

    #header{height:64px;  width:100%;  padding-top:20px;  position:fixed;  top:0;  left:0;  z-index:10;  font-size:18px;  line-height:44px;  color:#fff;  background:#fff;  text-align:center;  color:#333;  }
    #header.dark{color:#fff;  background:#333;  }

    .header-nav-back{position:absolute;  bottom:0;  left:0;  height:44px;  line-height:44px;  font-size:18px;  padding:0 16px;  display:flex;  align-items:center;  }
    .header-nav-back .van-icon-arrow-left{display:block;  }
    .header-function{position:absolute;  bottom:0;  right:0;  height:44px;  font-size:14px;  padding:0 16px;  }

</style>

<template>

    <header id='header' :class='{dark}'>

        <div class="header-nav-back flex-center">
            <slot name='back'>
                <AppRouterLink v-if="isBack" :params='backData' :isBack='isBack'>
                    <van-icon size='18px' name="arrow-left" />
                </AppRouterLink>
            </slot>
        </div>

        <slot/>

        <div class="header-function">
            <slot name='function'/>
        </div>
    </header>

</template>

<script>
    export default{
        props : ['isBack','dark','backData'],
        methods:{
            viewBack(){
                history.back()
            }
        },
        activated(){
            if(typeof api=='object'){
                api.setStatusBarStyle({
                    style : this.dark?'light':'dark'
                })
            }
        },
    }
</script>
