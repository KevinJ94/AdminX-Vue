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
import axios from 'axios';
import qs from 'qs';
import global from '../common/Global';
import * as index from '../../router/index';

export default {
    data: function() {
        return {
            param: {
                name: 'zhang3',
                password: '12345'
            },
            rules: {
                name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
            }
        };
    },
    methods: {
        submitForm() {
            let data = this.param;
            let router = this.$router;
            let message = this.$message;
            console.log(global.serverAddress);
            axios.post(global.serverAddress + '/login', qs.stringify(this.param)).then(function(value) {
                if (value.data.result) {
                    localStorage.setItem('ms_username', data.name);
                    localStorage.setItem('token', value.data.data);
                    //console.log(localStorage.getItem('token'))
                    // axios
                    //     .get(global.serverAddress + '/getrouter/' + localStorage.getItem('ms_username'), {
                    //         // axios.get(global.serverAddress + "/getmenu/zhang3",{
                    //         headers: {
                    //             authorization: localStorage.getItem('token')
                    //         }
                    //     })
                    //     .then(value => {
                    //         let data = value.data;
                    //         for(var item in data){
                    //             index.matchRouter(data[item].path)
                    //         }
                    //         console.log('login page')

                    //         localStorage.setItem('routers',JSON.stringify(index.menu));
                    //         console.log(index.menu)
                    //         router.addRoutes(index.menu)
                    //         router.push('/');
                    //     });
                    router.push('/');
                   
                } else {
                    message.error('用户名或密码错误!');
                }
            });
        }
    }
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