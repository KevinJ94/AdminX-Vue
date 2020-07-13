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
            <el-button
                size="large"
                type="primary"
                icon="el-icon-lx-add"
                @click="() => handleAdd()"
                style="margin-bottom: 10px"
            >新增菜单</el-button>
            <el-tree
                :data="data"
                :props="defaultProps"
                ref="tree"
                node-key="id"
                default-expand-all
                :expand-on-click-node="false"
            >
                <span class="custom-tree-node" slot-scope="{ node }">
                    <span>{{ node.label + " --- id: " + node.key }}</span>
                    <span>
                        <el-button
                            type="text"
                            size="large"
                            icon="el-icon-lx-add"
                            @click="() => handleAdd(data, node.key)"
                        >新增子菜单</el-button>
                        <el-button
                            type="text"
                            size="large"
                            icon="el-icon-edit"
                            @click="() => handleEdit(data, node.key)"
                        >编辑菜单</el-button>
                        <!-- <el-button type="text" size="large" icon="el-icon-menu">分配菜单</el-button> -->
                        <!-- <el-button type="text" size="large" @click="() => handleBan(data)">Delete</el-button> -->
                        <!-- <el-button type="text" size="large" icon="el-icon-delete" @click="open">删除角色</el-button>-->
                    </span>
                </span>
            </el-tree>
            <div>
                <!-- 增加弹出框 -->
                <el-dialog title="增加菜单" :visible.sync="addVisible" width="30%">
                    <el-form ref="addForm" :model="addForm" label-width="70px">
                        <el-form-item label="组件:">
                            <el-input v-model="addForm.component"></el-input>
                        </el-form-item>
                        <el-form-item label="描述:">
                            <el-input v-model="addForm.desc"></el-input>
                        </el-form-item>
                        <el-form-item label="图标:">
                            <el-input v-model="addForm.icon"></el-input>
                        </el-form-item>
                        <el-form-item label="id:">
                            <el-input v-model="addForm.id"></el-input>
                        </el-form-item>
                        <el-form-item label="index:">
                            <el-input v-model="addForm.index"></el-input>
                        </el-form-item>
                        <el-form-item label="父级id:">
                            <el-input v-model="addForm.pid" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="路径:">
                            <el-input v-model="addForm.path"></el-input>
                        </el-form-item>
                        <el-form-item label="标题:">
                            <el-input v-model="addForm.title"></el-input>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="saveAdd">确 定</el-button>
                        <el-button @click="addVisible = false">取 消</el-button>
                    </span>
                </el-dialog>
            </div>
            <div>
                <!-- 修改弹出框 -->
                <el-dialog title="修改菜单" :visible.sync="editVisible" width="30%">
                    <el-form ref="form" :model="form" label-width="70px">
                        <el-form-item label="组件:">
                            <el-input v-model="form.component"></el-input>
                        </el-form-item>
                        <el-form-item label="描述:">
                            <el-input v-model="form.desc"></el-input>
                        </el-form-item>
                        <el-form-item label="图标:">
                            <el-input v-model="form.icon"></el-input>
                        </el-form-item>
                        <el-form-item label="id:">
                            <el-input v-model="form.id"></el-input>
                        </el-form-item>
                        <el-form-item label="index:">
                            <el-input v-model="form.index"></el-input>
                        </el-form-item>
                        <el-form-item label="父级id:">
                            <el-input v-model="form.pid" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="路径:">
                            <el-input v-model="form.path"></el-input>
                        </el-form-item>
                        <el-form-item label="标题:">
                            <el-input v-model="form.title"></el-input>
                        </el-form-item>
                        <!-- <el-form-item label="名称:">
                            <el-input v-model="form.name" @input="change($event)"></el-input>
                        </el-form-item>
                        <el-form-item label="描述:">
                            <el-input v-model="form.desc" @input="change($event)"></el-input>
                        </el-form-item>-->
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="saveEdit">确 定</el-button>
                        <el-button @click="editVisible = false">取 消</el-button>
                    </span>
                </el-dialog>
            </div>
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
            addVisible: false,
            editVisible: false,
            addForm: {},
            form: {}
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

        handleAdd(data = null, id = null) {
            this.addVisible = true;
            if (id) {
                this.addForm.pid = id;
                console.log(data);
            } else {
                this.addForm.pid = null;
                console.log('no data');
            }
        },

        handleEdit(data, id) {
            //获取数据 放入dialog
            this.editVisible = true;
            axios
                .get(global.serverAddress + '/menu/' + id, {
                    headers: {
                        authorization: localStorage.getItem('token')
                    }
                })
                .then(value => {
                    console.log(value);
                    this.form = value.data.data;
                });
        },

        saveAdd() {
            axios
                .post(global.serverAddress + '/menu', qs.stringify(this.addForm), {
                    headers: {
                        authorization: localStorage.getItem('token')
                    }
                })
                .then(value => {
                    if (value.data.result) {
                        this.addVisible = false;
                        this.$message.success(value.data.msg);
                    } else {
                        this.$message.error(value.data.msg);
                    }
                    this.addForm = {};
                    location.reload();
                });
        },

        saveEdit() {
            axios
                .put(global.serverAddress + '/menu', qs.stringify(this.form), {
                    headers: {
                        authorization: localStorage.getItem('token')
                    }
                })
                .then(value => {
                    console.log(value)
                    if (value.data.result) {
                        this.editVisible = false;
                        this.$message.success(value.data.msg);
                    } else {
                        this.$message.error(value.data.msg);
                    }
                    this.form = {};
                    location.reload();
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
        }
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

.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}
</style>

