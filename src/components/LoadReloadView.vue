<style>
    .LoadReloadView{flex:1;  display:flex;  }
    .LoadReloadView>.van-pull-refresh{flex:1;  display:flex;  }
    .LoadReloadView>.van-pull-refresh>.van-pull-refresh__track{flex:1;  }
</style>
<template>
    <div class='LoadReloadView'>
        <van-pull-refresh v-model="view.reloading" @refresh="reload()">
            <slot v-if='view.notData' name="notData" />

            <van-list v-if='view.showList' v-model="view.loading" @load="load" finished-text="没有更多了" :immediate-check='false' :finished="view.finished"  :offset='view.offset'>
                <slot />
            </van-list>

        </van-pull-refresh>
    </div>
</template>

<script>
    export default{
        props : {
            value : Number,
            valuePath : String,
            autoInit : Boolean,
            form : Object,
            pageSize : Number,
        },
        data(){

            return {
                view : {
                    reloading : false,
                    loading : false,
                    finished : false,
                    notData : false,
                    showList : true,
                    offset : -9999,
                },
            }
        },
        methods : {
            reload(){
                this.view.reloading=true
                this.view.offset=-9999
                this.view.finished=false
                this.$emit('input',1)

                this.loadData((data)=>{
                    this.$emit('reload',data)
                    this.view.reloading=false
                    this.view.offset=99

                    this.view.notData=false
                    this.view.showList=true

                    if(this.pageSize>data.length){
                        this.view.finished=true

                        if(data.length==0){
                            if(this.$slots.notData && this.$slots.notData.length){
                                this.view.notData=true
                                this.view.showList=false
                            }
                        }
                    }
                })
            },
            load(){
                this.$emit('input',this.value+1)

                this.loadData((data)=>{
                    this.$emit('load',data)
                    this.view.loading=false
                    if(this.pageSize>data.length){
                        this.view.finished=true
                    }
                })
            },
            loadData(callback){

                var p=this.form.page
                this.$req(this.form._url , this.form)
                .then((data)=>{
                    callback( this.getDataByPath(data,this.valuePath) )
                })
            },
            getDataByPath(fromData,valuePath){

                if(!valuePath){
                    return fromData
                }

                var valuePathArr=valuePath.split('.')
                var outData=fromData
                for(var i=0;i<valuePathArr.length;i++){
                    outData=outData[valuePathArr[i]]
                    if(!outData){
                        break
                    }
                }
                return outData
            }          
        },
        watch:{
            value(newValue , oldValue){
                if(newValue==-1){
                    this.reload()
                }
            }
        },
        mounted(){
            this.reload()
        }
    }
</script>
