import Vue from 'vue'
import DataFilters from './DataFilters.js'

import 'vant/lib/index.css'
import '../less/public.less'
import Vant from 'vant'
Vue.use(Vant)


import HW from '@/components/HW.vue'
Vue.component('HW',HW)

import NumberKey from '@/components/NumberKey.vue'
Vue.component('NumberKey',NumberKey)

import ImgBox from '@/components/ImgBox.vue'
Vue.component('ImgBox',ImgBox)

import TextView from '@/components/TextView.vue'
Vue.component('TextView',TextView)

import LoadReloadView from '@/components/LoadReloadView.vue'
Vue.component('LoadReloadView',LoadReloadView)

import ReloadView from '@/components/ReloadView.vue'
Vue.component('ReloadView',ReloadView)

import HeaderTemp from '@/components/HeaderTemp.vue'
Vue.component('HeaderTemp',HeaderTemp)



var timeFiltersDefault=(time,timeDIF)=>DataFilters.dateFormat(time,'yyyy-MM-dd')
var timeFilters=[
    { time : -Infinity, format : timeFiltersDefault },
    { time : 0, format : (time,timeDIF)=>parseInt(timeDIF)+'秒前' },
    { time : 60, format : (time,timeDIF)=>parseInt(timeDIF/60)+'分钟前' },
    { time : 60*60, format : (time,timeDIF)=>parseInt(timeDIF/60/60)+'小时前' },
    { time : 60*60*24, format : (time,timeDIF)=>parseInt(timeDIF/60/60/24)+'天前' },
    { time : 60*60*24*10, format : timeFiltersDefault },
    { time : Infinity , format : timeFiltersDefault },
]


Vue.filter('timeFilter',function (value){

    if(value){

        var time= typeof value=='number' ? new Date(value) : new Date(value.replace(/\-/g,'/'))
        
        var timeDIF=( Date.now()-time.getTime() )/1000
        var timeText=value

        var timeFilter=timeFilters.find((timeFilter,index)=>{
            return timeFilter.time<timeDIF && timeDIF<timeFilters[index+1].time
        })

        return timeFilter.format(time,timeDIF)
    }

    return value
})


Vue.filter('telFilter',function (telValue){
    return telValue.slice(0,3)+'****'+telValue.slice(7)
})

Vue.filter('number',function (num){
    if(num>10000){
        return (num/10000).toFixed(1)+'w'
    }

    return num
})
