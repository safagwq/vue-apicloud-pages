import Vue from 'vue'
import { $api, modules } from './apicloud.js'
import DataFilters from './DataFilters.js'
import AppRouterLink from '../components/AppRouterLink.vue'

Vue.component('AppRouterLink',AppRouterLink)


var router = {
    push(path){
        var route = typeof path=='string' ? path={ path : path } : path

        api.openWin({
            useWKWebView : true,
            historyGestureEnabled  : false,
            url : localStorage.rootPath + route.path,
            name : route.path,
            pageParam : route.params || {},
        })
    },
    back(params){
        api.closeWin()
    },
    backTo(path){
        api.closeToWin({
            name : path
        })
    },
    replace(path){
        router.push(path)
        router.back()
    },
    _beforeEachCallbacks : [],
    beforeEach(callback){
        router._beforeEachCallbacks.push(callback)
    }
}

function getRoute(){
    var path=location.pathname

    return {
        query : DataFilters.queryData(location.search),
        path : path,
        name : path,
        params : api.pageParam,
        fullPath : path+location.search,
    }
}





Object.defineProperty(Vue.prototype, '$router', {
    get(){
        return router
    }
})

Object.defineProperty(Vue.prototype, '$route', {
    get(){
        return getRoute()
    }
})