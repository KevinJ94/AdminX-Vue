<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.name" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="password"
                        v-model="param.password"
                        @keyup.enter.native="submitForm()"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
                <p class="login-tips">Tips : 用户名和密码随便填。</p>
            </el-form>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import qs from 'qs'
import global from '../common/Global'
import * as index from '../../router/index'



export default {
    
    data: function() {
        return {
            param: {
                name: 'zhang3',
                password: '12345',
            },
            rules: {
                name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            },
        };
    },
    methods: {
        
        submitForm() {
            let data = this.param
            let router = this.$router
            let message = this.$message;
            console.log(global.serverAddress)
            axios.post(global.serverAddress + "/login",qs.stringify(this.param))
            .then(function(value){
                if(value.data.result){
                    localStorage.setItem('ms_username', data.name);
                    localStorage.setItem('token', value.data.data);
                    //console.log(localStorage.getItem('token'))
                    index.menu.push(
                        
                        {
                            path: '/',
                            redirect: '/dashboard'
                        },

                        {
                            path: '/',
                            component: () => import(/* webpackChunkName: "home" */ '../common/Home.vue'),
                            meta: { title: '自述文件' },
                            children: [
                                        {
                                            path: '/dashboard',
                                            component: () => import(/* webpackChunkName: "dashboard" */ '../page/Dashboard.vue'),
                                            meta: { title: '系统首页' },
                                        },
                                        {
                                            path: '/icon',
                                            component: () => import(/* webpackChunkName: "icon" */ '../page/Icon.vue'),
                                            meta: { title: '自定义图标' }
                                        },
                                        {
                                            path: '/table',
                                            component: () => import(/* webpackChunkName: "table" */ '../page/BaseTable.vue'),
                                            meta: { title: '基础表格' }
                                        },
                                        {
                                            path: '/tabs',
                                            component: () => import(/* webpackChunkName: "tabs" */ '../page/Tabs.vue'),
                                            meta: { title: 'tab选项卡' }
                                        },
                                        {
                                            path: '/form',
                                            component: () => import(/* webpackChunkName: "form" */ '../page/BaseForm.vue'),
                                            meta: { title: '基本表单' }
                                        },
                                        {
                                            // 富文本编辑器组件
                                            path: '/editor',
                                            component: () => import(/* webpackChunkName: "editor" */ '../page/VueEditor.vue'),
                                            meta: { title: '富文本编辑器' }
                                        },
                                        {
                                            // markdown组件
                                            path: '/markdown',
                                            component: () => import(/* webpackChunkName: "markdown" */ '../page/Markdown.vue'),
                                            meta: { title: 'markdown编辑器' }
                                        },
                                        {
                                            // 图片上传组件
                                            path: '/upload',
                                            component: () => import(/* webpackChunkName: "upload" */ '../page/Upload.vue'),
                                            meta: { title: '文件上传' }
                                        },
                                        {
                                            // vue-schart组件
                                            path: '/charts',
                                            component: () => import(/* webpackChunkName: "chart" */ '../page/BaseCharts.vue'),
                                            meta: { title: 'schart图表' }
                                        },
                                        {
                                            // 拖拽列表组件
                                            path: '/drag',
                                            component: () => import(/* webpackChunkName: "drag" */ '../page/DragList.vue'),
                                            meta: { title: '拖拽列表' }
                                        },
                                        {
                                            // 拖拽Dialog组件
                                            path: '/dialog',
                                            component: () => import(/* webpackChunkName: "dragdialog" */ '../page/DragDialog.vue'),
                                            meta: { title: '拖拽弹框' }
                                        },
                                        {
                                            // 国际化组件
                                            path: '/i18n',
                                            component: () => import(/* webpackChunkName: "i18n" */ '../page/I18n.vue'),
                                            meta: { title: '国际化' }
                                        },
                                        {
                                            // 权限页面
                                            path: '/permission',
                                            component: () => import(/* webpackChunkName: "permission" */ '../page/Permission.vue'),
                                            meta: { title: '权限测试', permission: true }
                                        },
                                        {
                                            path: '/404',
                                            component: () => import(/* webpackChunkName: "404" */ '../page/404.vue'),
                                            meta: { title: '404' }
                                        },
                                        {
                                            path: '/403',
                                            component: () => import(/* webpackChunkName: "403" */ '../page/403.vue'),
                                            meta: { title: '403' }
                                        },
                                        {
                                            path: '/donate',
                                            component: () => import(/* webpackChunkName: "donate" */ '../page/Donate.vue'),
                                            meta: { title: '支持作者' }
                                        }
                                    ]
                        },
                        {
                            path: '*',
                            redirect: '/404'
                        }

                    )
                    router.addRoutes(index.menu)
                    console.log(index.menu)
                   
                    router.push('/');
                }
                else{
                    message.error("用户名或密码错误!")
                }
            })
        },
    },
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>