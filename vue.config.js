var pagesHelper=require('./pages-helper.js')

var pages = pagesHelper('./src/pages/' , {
    mainJsTemp : function (fileName){
        var temp=`
            import '@/js/apicloud.js'
            import '@/js/apicloud-router.js'
            import '@/js/component.js'
            import '@/js/axios-config.js'

            import Vue from 'vue'
            import App from '@/pages/${fileName}'

            Vue.config.productionTip = false

            new Vue({
                el : '#app',
                render: h => h(App)
            })
        `
        return temp
    }
})


module.exports = {
    // 线上环境使用相对路径
    publicPath: process.env.NODE_ENV === 'production'? './' : '/' ,
    // 输出目录
    outputDir : './widget/dict/',
    // 打包正式版时 , 不保留map文件
    productionSourceMap : false,

    pages : pages,

    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'less',
            patterns: [
                './src/less/var.less'
            ]
        }
    }
}

