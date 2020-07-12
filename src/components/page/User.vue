<template>
    <div>
        <template>
            <div>
                <div class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>
                            <i class="el-icon-lx-cascades"></i> 用户列表
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <div class="container">
                    <div class="handle-box" style="padding-bottom: 10px">
                        <el-button type="primary" icon="el-icon-lx-add" @click="handleAdd">新增用户</el-button>
                    </div>
                    <el-table
                        :data="tableData"
                        border
                        class="table"
                        ref="multipleTable"
                        header-cell-class-name="table-header"
                        @selection-change="handleSelectionChange"
                    >
                        <el-table-column type="selection" width="55" align="center"></el-table-column>
                        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                        <el-table-column prop="name" label="用户名"></el-table-column>
                        <el-table-column prop="enable" label="状态" align="center">
                            <template slot-scope="scope">
                                <el-tag
                                    :type="scope.row.enable===1?'success':(scope.row.enable=== 0 ?'danger':'')"
                                >{{scope.row.enable === 0 ? '禁止' : '正常'}}</el-tag>
                            </template>
                        </el-table-column>

                        <!-- <el-table-column prop="date" label="注册时间"></el-table-column> -->
                        <el-table-column label="操作" width="180" align="center">
                            <template slot-scope="scope">
                                <el-button
                                    type="text"
                                    icon="el-icon-edit"
                                    @click="handleEdit(scope.$index, scope.row)"
                                >编辑</el-button>
                                <el-button
                                    type="text"
                                    icon="el-icon-s-promotion"
                                    @click="handleRole(scope.$index, scope.row)"
                                >分配角色</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination
                            background
                            layout="total, sizes, prev, pager, next, jumper"
                            :current-page.sync="currentPage"
                            :page-sizes="[10, 15, 20]"
                            :page-size="pagesize"
                            :total="total"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                        ></el-pagination>
                    </div>
                </div>

                <!-- 编辑弹出框 -->
                <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
                    <el-form ref="form" :model="form" label-width="70px">
                        <el-form-item label="用户名">
                            <el-input v-model="form.name" :disabled="true"></el-input>
                        </el-form-item>
                        <!-- <el-form-item label="状态">
                            <el-input v-model="form.enable"></el-input>
                        </el-form-item>-->
                        <el-form-item label="状态">
                            <el-radio-group v-model="radio">
                                <el-radio :label="1">启用</el-radio>
                                <el-radio :label="0">禁用</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="editVisible = false">取 消</el-button>
                        <el-button type="primary" @click="saveEdit">确 定</el-button>
                    </span>
                </el-dialog>

                <el-dialog title="新增用户" :visible.sync="addVisible" width="30%">
                    <el-form ref="form" :model="form" label-width="70px">
                        <el-form-item label="用户名">
                            <el-input v-model="addForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="密码">
                            <el-input type="password" v-model="addForm.password"></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码">
                            <el-input type="password" v-model="addForm.confirmPass"></el-input>
                        </el-form-item>
                        <el-form-item label="状态">
                            <el-radio-group v-model="addForm.enable">
                                <el-radio :label="1">启用</el-radio>
                                <el-radio :label="0">禁用</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="addVisible = false">取 消</el-button>
                        <el-button type="primary" @click="saveAdd">确 定</el-button>
                    </span>
                </el-dialog>

                <el-dialog title="分配角色" :visible.sync="roleVisible" width="30%">
                    <el-form ref="form" :model="form" label-width="70px">
                        <el-tree
                            :data="data"
                            :props="defaultProps"
                            ref="tree"
                            show-checkbox
                            node-key="id"
                            default-expand-all
                            :expand-on-click-node="false"
                            :default-checked-keys= default_role_id
                            @close = "closeDialog"
                            :before-close="closeDialog"
                        >
                            <span class="custom-tree-node" slot-scope="{ node, data }">
                                <span>{{ node.label + "----id: " + node.key}}</span>
                            </span>
                        </el-tree>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="roleVisible = false;">取 消</el-button>
                        <el-button type="primary" @click="saveRoldchanged">确 定</el-button>
                    </span>
                </el-dialog>
            </div>
        </template>
    </div>
</template>



<script>
import { fetchData } from '../../api/index';
import global from '../common/Global';
import axios from 'axios';
import qs from 'qs';
export default {
    name: 'basetable',
    data() {
        return {
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            addVisible: false,
            roleVisible: false,
            pageTotal: 0,
            form: {},
            addForm: {},
            idx: -1,
            id: -1,
            radio: null,
            pageTotal: 10,
            currentPage: 1, //默认显示页面为1
            pagesize: 10, //    每页的数据条数
            total: 0,
            data: [],
            defaultProps: {
                children: 'children',
                label: 'desc_',
                pid: 'pid',
                id: 'id',
                title: 'title'
            },
            default_role_id:[],
            roledata: {
                rids:[],
                uid: null,
            }
            
            
        };
    },
    created() {
        //this.getData();
        this.getMyData(0, this.pagesize);
    },
    methods: {
        //
        getMyData(pageNum, size) {
            axios
                .get(global.serverAddress + '/user', {
                    headers: {
                        authorization: localStorage.getItem('token')
                    },
                    params: {
                        pageNum: pageNum,
                        size: size
                    }
                })
                .then(value => {
                    //console.log(value.data.data);
                    //this.tableData = value.data.data;
                    this.tableData = value.data.data.data;
                    this.total = value.data.data.total;
                });
        },

        retriveData() {//获取角色数据
            axios
                .get(global.serverAddress + '/role', {
                    headers: {
                        authorization: localStorage.getItem('token')
                    }
                })
                .then(value => {
                    //console.log(value.data.data);
                    this.data = JSON.parse(JSON.stringify(value.data.data));
                });
        },
        // 触发搜索按钮
        handleRole(index, row) {
            this.roleVisible = true;
            this.retriveData();
            this.getRoleid(row.id);
            this.roledata.uid = row.id
            this.$forceUpdate();
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$message.success('删除成功');
                    this.tableData.splice(index, 1);
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },

        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.editVisible = true;
            this.radio = row.enable;
            this.addForm.id = row.id;
            this.addForm.enable = row.enable;
        },
        handleAdd() {
            this.addVisible = true;
        },
        saveAdd() {
            if (this.addForm.password != this.addForm.confirmPass) {
                this.$message.error('输入的密码不一致');
                return;
            } else {
                axios
                    .post(global.serverAddress + '/user', qs.stringify(this.addForm), {
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
            }
        },
        // 保存编辑
        saveEdit() {
            this.addForm.enable = this.radio;
            //console.log(this.addForm)
            this.editVisible = false;
            axios
                .put(global.serverAddress + '/user', qs.stringify(this.addForm), {
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
                    this.radio = null;
                    this.addForm = {};
                    location.reload();
                });
        },
        //获取用户角色
        getRoleid(user_id){
            console.log("fff")
            axios.get(global.serverAddress + '/allocrole/'+ user_id, {
                    headers: {
                        authorization: localStorage.getItem('token')
                    }
                }).then(value=>{
                    console.log(value.data.data)
                    this.default_role_id = value.data.data.rids
                });
        },

        // 控制页面页数
        handleSizeChange: function(size) {
            this.pagesize = size;
            this.getMyData(0, size);
            this.currentPage = 1;
            /*console.log(this.pagesize) */
        },
        //点击第几页
        handleCurrentChange: function(currentPage) {
            this.getMyData(currentPage - 1, this.pagesize);
            /*console.log(this.currentPage) */
        },

        closeDialog(done){
            console.log("closed")
        },

        saveRoldchanged(){//修改用户角色
            let res = this.$refs.tree.getCheckedKeys();
            this.roledata.rids = res
            console.log(this.roledata.rids)
            console.log(this.roledata.user_id)
            axios
                    .post(global.serverAddress + '/allocrole', qs.stringify(this.roledata), {
                        headers: {
                            authorization: localStorage.getItem('token')
                        }
                    })
                    .then(value => {
                        console.log(value)
                        if (value.data.result) {
                            this.roleVisible = false;
                            this.$message.success(value.data.msg);
                        } else {
                            this.$message.error(value.data.msg);
                        }
                        this.roledata.rids = []
                        this.roledata.user_id = null
                        // this.addForm = {};
                        // location.reload();
                    });
        }
    }
};
</script>

<style>
</style>