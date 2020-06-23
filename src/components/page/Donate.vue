<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-redpacket_fill"></i> 支持作者
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="plugins-tips">如果该框架对你有帮助，那就请作者喝杯饮料吧！加微信号linxin_20探讨问题。</div>
            <div>
                <img src="https://lin-xin.gitee.io/images/weixin.jpg" />
            </div>
        </div>
        <div class="login-btn">
                    <el-button type="primary" @click="request()">request</el-button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    methods:{
        request(){
            axios.get("http://ec2-54-148-49-213.us-west-2.compute.amazonaws.com:8080/login")
            .then(function(value){
                console.log(value.data)
            })
        }
    }

};
</script>

<style>
</style>