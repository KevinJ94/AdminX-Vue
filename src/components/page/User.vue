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
                            layout="total, prev, pager, next"
                            :current-page="query.pageIndex"
                            :page-size="query.pageSize"
                            :total="pageTotal"
                            @current-change="handlePageChange"
                        ></el-pagination>
                    </div>
                </div>

                <!-- 编辑弹出框 -->
                <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
                    <el-form ref="form" :model="form" label-width="70px">
                        <el-form-item label="用户名">
                            <el-input v-model="form.name" 
                            :disabled="true"></el-input>
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
                       
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="roleVisible = false">取 消</el-button>
                        <el-button type="primary" >确 定</el-button>
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
            query: {
                address: '',
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            addVisible: false,
            roleVisible: false,
            pageTotal: 0,
            form: {},
            addForm:{},
            idx: -1,
            id: -1,
            radio: null
        };
    },
    created() {
        //this.getData();
        this.getMyData();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            fetchData(this.query).then(res => {
                console.log(res);
                this.tableData = res.list;
                this.pageTotal = res.pageTotal || 50;
            });
        },
        getMyData() {
            axios
                .get(global.serverAddress + '/user', {
                    headers: {
                        authorization: localStorage.getItem('token')
                    }
                })
                .then(value => {
                    console.log(value.data.data);
                    this.tableData = value.data.data;
                });
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        handleRole(index, row) {
            this.roleVisible = true;
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
            if(this.addForm.password != this.addForm.confirmPass){
                this.$message.error('输入的密码不一致')
                return
            }
            else{
                
                axios
                .post(global.serverAddress + '/user',qs.stringify(this.addForm), {
                    headers: {
                        authorization: localStorage.getItem('token')
                    }
                })
                .then(value => {
                    if(value.data.result){
                        this.addVisible = false
                        this.$message.success(value.data.msg)

                    }else{
                        this.$message.error(value.data.msg)
                    }
                    this.addForm = {}
                    location.reload()
                });
            }
            
        },
        // 保存编辑
        saveEdit() {
            this.addForm.enable = this.radio
            //console.log(this.addForm)
            this.editVisible = false;
            axios
                .put(global.serverAddress + '/user',qs.stringify(this.addForm), {
                    headers: {
                        authorization: localStorage.getItem('token')
                    }
                })
                .then(value => {
                    if(value.data.result){
                        this.addVisible = false
                        this.$message.success(value.data.msg)

                    }else{
                        this.$message.error(value.data.msg)
                    }
                    this.radio = null
                    this.addForm = {}
                    location.reload()
                });
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        }
    }
};
</script>

<style>
</style>