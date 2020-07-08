<template>
    <div class="custom-tree-container">
        <div class="block">
            <p style="padding-bottom: 10px">角色管理</p>
            <el-button type="primary" @click="() => handleAdd()" style="margin-bottom: 10px">新增角色</el-button>
            <el-tree
                :data="data"
                :props="defaultProps"
                show-checkbox
                node-key="id"
                default-expand-all
                :expand-on-click-node="false"
            >
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ node.label }}</span>
                    <span>
                        <el-button type="text" size="large" @click="() => handleAdd(data)">Append</el-button>
                        <el-button type="text" size="large" @click="() => handleEdit(data)">Edit</el-button>
                        <!-- <el-button type="text" size="large" @click="() => handleBan(data)">Delete</el-button> -->
                        <el-button type="text" size="large" @click="open">Delete</el-button>
                    </span>
                </span>
            </el-tree>
        </div>
        <div>
            <!-- 增加弹出框 -->
            <el-dialog title="增加角色" :visible.sync="addVisible" width="30%">
                <el-form ref="form" :model="form" label-width="70px">
                    <el-form-item label="父角色:">
                        <el-input v-model="form.desc_" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="新角色:">
                        <el-input v-model="form.role"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary">确 定</el-button>
                    <el-button @click="addVisible = false">取 消</el-button>
                </span>
            </el-dialog>
        </div>
        <div>
            <!-- 修改弹出框 -->
            <el-dialog title="修改角色" :visible.sync="editVisible" width="30%">
                <el-form ref="form" :model="form" label-width="70px">
                    <el-form-item label="父角色:">
                        <el-input v-model="form.desc_" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="新角色:">
                        <el-input v-model="form.role"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary">确 定</el-button>
                    <el-button @click="editVisible = false">取 消</el-button>
                </span>
            </el-dialog>
        </div>
        <!-- <div>
        禁用弹出框-->
        <!-- <el-dialog title="禁用角色" :visible.sync="banVisible" width="30%">
                spo
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary">确 定</el-button>
                    <el-button @click="banVisible = false">取 消</el-button>
                </span>
            </el-dialog>
        </div>-->
    </div>
</template>



<script>
let id = 1000;
import axios from 'axios';
import bus from '../common/bus';
import global from '../common/Global';

export default {
    data() {
        return {
            data: [],
            defaultProps: {
                children: 'children',
                label: 'desc_'
            },
            editVisible: false,
            addVisible: false,
            // banVisible: false,
            form: { desc_: null, role: null }
        };
    },

    created() {
        this.retriveData();
    },

    methods: {
        append(data) {
            // console.log(data.title);
        },

        retriveData() {
            axios
                .get(global.serverAddress + '/role', {
                    headers: {
                        authorization: localStorage.getItem('token')
                    }
                })
                .then(value => {
                    console.log(value.data.data);
                    this.data = JSON.parse(JSON.stringify(value.data.data));
                });
        },

        handleAdd(data = null) {
            this.addVisible = true;

            if (data == null) {
                this.form.desc_ = "无";
            } else {
                this.form.desc_ = data.desc_;
            }
            // console.log(data.desc_)
        },

        handleEdit(data) {
            this.editVisible = true;
            let pid = data.id;
            this.form.desc_ = data.desc_;
            // console.log(pid)
        },

        // handleBan(data) {
        //     this.banVisible = true;
        //     let pid = data.id;
        //     this.form.prole = data.desc_;
        //     // console.log(pid)
        // },

        open() {
            this.$confirm('此操作将使该角色失效, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        }
    }
};
</script>

<style>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}
</style>