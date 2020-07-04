import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
};

export let routerData = [
    {
                path: '/dashboard',
                component: (resolve) => require(/* webpackChunkName: "dashboard" */ ['../components/page/Dashboard.vue'],resolve),
                meta: { title: '系统首页' }
            
    },
    {
        path: '/icon',
        component: (resolve) => require(/* webpackChunkName: "icon" */ ['../components/page/Icon.vue'],resolve),
        meta: { title: '自定义图标' }
    },
    {
        path: '/table',
        component: (resolve) => require(/* webpackChunkName: "table" */ ['../components/page/BaseTable.vue'],resolve),
        meta: { title: '基础表格' }
    },
    {
        path: '/tabs',
        component: (resolve) => require(/* webpackChunkName: "tabs" */ ['../components/page/Tabs.vue'],resolve),
        meta: { title: 'tab选项卡' }
    },
    {
        path: '/form',
        component: (resolve) => require(/* webpackChunkName: "form" */ ['../components/page/BaseForm.vue'],resolve),
        meta: { title: '基本表单' }
    },
    {
        // 富文本编辑器组件
        path: '/editor',
        component: (resolve) => require(/* webpackChunkName: "editor" */ ['../components/page/VueEditor.vue'],resolve),
        meta: { title: '富文本编辑器' }
    },
    {
        // markdown组件
        path: '/markdown',
        component: (resolve) => require(/* webpackChunkName: "markdown" */ ['../components/page/Markdown.vue'],resolve),
        meta: { title: 'markdown编辑器' }
    },
    {
        // 图片上传组件
        path: '/upload',
        component: (resolve) => require(/* webpackChunkName: "upload" */ ['../components/page/Upload.vue'],resolve),
        meta: { title: '文件上传' }
    },
    {
        // vue-schart组件
        path: '/charts',
        component: (resolve) => require(/* webpackChunkName: "chart" */ ['../components/page/BaseCharts.vue'],resolve),
        meta: { title: 'schart图表' }
    },
    {
        // 拖拽列表组件
        path: '/drag',
        component: (resolve) => require(/* webpackChunkName: "drag" */ ['../components/page/DragList.vue'],resolve),
        meta: { title: '拖拽列表' }
    },
    {
        // 拖拽Dialog组件
        path: '/dialog',
        component: (resolve) => require(/* webpackChunkName: "dragdialog" */ ['../components/page/DragDialog.vue'],resolve),
        meta: { title: '拖拽弹框' }
    },
    {
        // 国际化组件
        path: '/i18n',
        component: (resolve) => require(/* webpackChunkName: "i18n" */ ['../components/page/I18n.vue'],resolve),
        meta: { title: '国际化' }
    },
    {
        // 权限页面
        path: '/permission',
        component: (resolve) => require(/* webpackChunkName: "permission" */ ['../components/page/Permission.vue'],resolve),
        meta: { title: '权限测试', permission: true }
    },
    {
        path: '/404',
        component: (resolve) => require(/* webpackChunkName: "404" */ ['../components/page/404.vue'],resolve),
        meta: { title: '404' }
    },
    {
        path: '/403',
        component: (resolve) => require(/* webpackChunkName: "403" */ ['../components/page/403.vue'],resolve),
        meta: { title: '403' }
    },
    {
        path: '/user',
        component: (resolve) => require(/* webpackChunkName: "user" */ ['../components/page/User.vue'],resolve),
        meta: { title: '用户管理' }
    }
];

export function matchRouter(path) {

    for(var item in routerData){
        if(routerData[item].path == path){
            menu[2].children.push(routerData[item])
        }
    }
    
}

export let menu = [
    {
        path: '/login',
        component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
        meta: { title: '登录' }
    },
    {
        path: '/',
        redirect: '/dashboard'
    },

    {
        path: '/',
        component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
        meta: { title: '自述文件' },
        children: routerData
    },
    {
        path: '/404',
        component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
        meta: { title: '404' }
    },
    {
        path: '*',
        redirect: '/404'
    }
];
export function setMenu() {
    console.log('xxxxxxxxxxx');
}



export default new Router({
    routes: menu
});
