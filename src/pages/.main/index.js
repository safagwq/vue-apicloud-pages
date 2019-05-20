
            import '@/js/apicloud.js'
            import '@/js/apicloud-router.js'
            import '@/js/component.js'
            import '@/js/axios-config.js'

            import Vue from 'vue'
            import App from '@/pages/index.vue'

            Vue.config.productionTip = false

            new Vue({
                el : '#app',
                render: h => h(App)
            })
        