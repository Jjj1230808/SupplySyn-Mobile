// #ifndef VUE3
import Vue from 'vue'
import App from './App'
// import Config from 'common/config.js'
import api from '@/kevinrong-http/'
import Api from 'common/Api.js'

Vue.config.productionTip = false
Vue.prototype.$Api = Api
Vue.prototype.$MyHttp = api
App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
// import App from './App.vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif
