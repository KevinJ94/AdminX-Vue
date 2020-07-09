import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import { messages } from './components/common/i18n';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
//import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';
import * as index from './router/index';

Vue.config.productionTip = false;
Vue.use(VueI18n);
Vue.use(ElementUI, {
    size: 'small'
});
const i18n = new VueI18n({
    locale: 'zh',
    messages
});



//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | AdminX-Vue`;

    const role = localStorage.getItem('ms_username');

    if (to.path == '/login' && role) {
        next('/');
    } 
    else {
        console.log('here')
        // if(localStorage.getItem('routers')){
        //     console.log(JSON.parse(localStorage.getItem('routers')))
        //     router.addRoutes(JSON.parse(localStorage.getItem('routers')))
        //     console.log('fu')
        //     next();
        // }
        next();
        
    }
});



new Vue({
    router,
    i18n,
    render: h => h(App)
}).$mount('#app');
