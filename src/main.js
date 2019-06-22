import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import 'nprogress/nprogress.css'

import BaseIcon from '@/components/BaseIcon.vue'
Vue.component('BaseIcon', BaseIcon)
import BaseInput from '@/components/BaseInput.vue'
Vue.component('BaseInput', BaseInput)
import BaseSelect from '@/components/BaseSelect.vue'
Vue.component('BaseSelect', BaseSelect)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
