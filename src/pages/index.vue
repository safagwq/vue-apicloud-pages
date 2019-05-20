<style lang='css'>

    .Home-nav{position:fixed !important;  bottom:0;  left:0;  right:0;  height:50px;  padding:0 12px;  display:flex;  background:rgba(0,0,0,0.6);  box-shadow:0 0 10px rgba(0,0,0,0.1);  z-index:990;  justify-content:space-between;  }
    .Home-nav-item{display:flex;  justify-content:center;  align-items:center;  flex-direction:column;   font-size:10px;  line-height:13px;  color:#f5f5f5;  opacity:0.5;  width:56px;  height:100%;  }
    .Home-nav-icon{height:22px;  width:22px;  margin-bottom:2px;  }

    .Home-nav-item.active{opacity:1;  }
    .Home-nav.hide{bottom:-60px;  }
</style>


<template>
    <div id='index'>

        <nav class="Home-nav fixed">

            <div @click="toggleHome(0)" class="Home-nav-item">
                <img class="Home-nav-icon" src=""/>
                <span>首页</span>
            </div>

            <div @click="toggleHome(1)" class="Home-nav-item">
                <img class="Home-nav-icon" src=""/>
                <span>用户</span>
            </div>
        </nav>

    </div>
</template>

<script>
    import '../js/apicloud-index.js'

    export default{
        data(){
            return {
                data : {
                }
            }
        },
        methods:{
            initFrameGroup(){
                api.openFrameGroup({
                    name : 'homeGroup',
                    rect : {
                        marginBottom : 50,
                    },
                    scrollEnabled : false,
                    frames : [
                        this.$api.getOpenViewParams('/home.html'), 
                        this.$api.getOpenViewParams('/user.html'), 
                    ]
                })
            },
            toggleHome(index){
                api.setFrameGroupIndex({
                    name : 'homeGroup',
                    index : index
                })
            },
        },
        mounted(){
            this.$api.ready(()=>{
                this.initFrameGroup()
            })
        },
    }
</script>