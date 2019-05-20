<template>
    <div id='user'>
        <HeaderTemp dark='true' isBack='true'>
            <span>user</span>
            <AppRouterLink slot='function' :params='data.settings' to='/user/setting.html'>设置</AppRouterLink>
        </HeaderTemp>

        <table border='1' cellpadding='0' cellspacing='0' style='width:100%;  margin-top:70px;  '>
            <tbody>
                <tr v-for='value,name in data.settings'>
                    <td>{{name}}</td>
                    <td>{{value}}</td>
                </tr>
            </tbody>
        </table>

    </div>
</template>

<script>
    export default{
        mounted(){
            this.$api.ready(this.init)
        },
        methods:{
            init(){
                this.$api.on('updata:userinfo',(data)=>{
                    alert('updata:userinfo' + '  :  ' + data)
                })
            }
        },
        data(){
            return{
                data : {
                    settings : {
                        name : 123123 , 
                        sex : 0 , 
                        photo : '' , 
                    }
                }
            }
        },
    }
</script>