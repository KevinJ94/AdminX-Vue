<template>
    <div class>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-copy"></i> 菜单管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tree
                :data="data"
                :props="defaultProps"
                show-checkbox
                node-key="id"
                default-expand-all
                :expand-on-click-node="false"
            >
                <span class="custom-tree-node" slot-scope="{ node }">
                    <span>{{ node.label }}</span>
                    <!-- <span>
                        <el-button
                            type="text"
                            size="large"
                            icon="el-icon-lx-add"
                            @click="() => handleAdd(data)"
                        >新增子角色</el-button>
                        <el-button
                            type="text"
                            size="large"
                            icon="el-icon-edit"
                            @click="() => handleEdit(data)"
                        >编辑角色</el-button>
                        <el-button
                            type="text"
                            size="large"
                            icon="el-icon-s-promotion"
                            @click="() => handleEditRouter(data)"
                        >分配权限</el-button>
                        <el-button type="text" size="large" icon="el-icon-menu">分配菜单</el-button> -->
                        <!-- <el-button type="text" size="large" @click="() => handleBan(data)">Delete</el-button> -->
                        <!-- <el-button type="text" size="large" icon="el-icon-delete" @click="open">删除角色</el-button>
                    </span> -->
                </span>
            </el-tree>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
// import bus from '../common/bus';
import global from '../common/Global';
import qs from 'qs';
export default {
    data() {
        return {
            data: [],
            defaultProps: {
                children: 'children',
                label: 'title',
                pid: 'pid',
                id: 'id',
                title: 'title'
            },
        };
    },

    created() {
        this.retriveData();
    },

    methods: {
        retriveData() {
            axios
                .get(global.serverAddress + '/menu', {
                    headers: {
                        authorization: localStorage.getItem('token')
                    }
                })
                .then(value => {
                    // console.log(value.data.data);
                    this.data = JSON.parse(JSON.stringify(value.data.data));
                });
        },

        handleRead(index) {
            const item = this.unread.splice(index, 1);
            console.log(item);
            this.read = item.concat(this.read);
        },

        handleDel(index) {
            const item = this.read.splice(index, 1);
            this.recycle = item.concat(this.recycle);
        },

        handleRestore(index) {
            const item = this.recycle.splice(index, 1);
            this.read = item.concat(this.read);
        },
    },



    computed: {
        unreadNum() {
            return this.unread.length;
        }
    }
};
</script>

<style>
.message-title {
    cursor: pointer;
}
.handle-row {
    margin-top: 30px;
}
</style>

