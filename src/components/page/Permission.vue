<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-warn"></i> 权限管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-button type="primary" @click="() => handleAdd()" style="margin-bottom: 10px">新增权限</el-button>
        <div class="container">
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="desc" label="权限"></el-table-column>
                <el-table-column prop="method" label="方法"></el-table-column>
                <el-table-column prop="name" label="名称" align="center"></el-table-column>
                <el-table-column prop="url" label="路由" align="center"></el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="pagesize"
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    style="text-align: center"
                ></el-pagination>
            </div>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="权限">
                    <el-input v-model="form.desc"></el-input>
                </el-form-item>
                <!-- <el-form-item label="状态">
                            <el-input v-model="form.enable"></el-input>
                </el-form-item>-->
                <el-form-item label="方法">
                    <el-select v-model="form.method"  placeholder="请选择">
                        <el-option label="GET" value="GET"></el-option>
                        <el-option label="POST" value="POST"></el-option>
                        <el-option label="PUT" value="PUT"></el-option>
                        <el-option label="DELETE" value="DELETE"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="路由">
                    <el-input v-model="form.url"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 添加弹出框 -->
        <el-dialog title="添加" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="addForm" label-width="70px">
               
                <!-- <el-form-item label="状态">
                            <el-input v-model="form.enable"></el-input>
                </el-form-item>-->
                <el-form-item label="方法">
                    
                    <el-select v-model="addForm.method"  placeholder="请选择">
                        <el-option label="GET" value="GET"></el-option>
                        <el-option label="POST" value="POST"></el-option>
                        <el-option label="PUT" value="PUT"></el-option>
                        <el-option label="DELETE" value="DELETE"></el-option>
                    </el-select>
                    
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="路由">
                    <el-input v-model="addForm.url"></el-input>
                </el-form-item>
                 <el-form-item label="描述">
                    <el-input v-model="addForm.desc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import global from '../common/Global';
import axios from 'axios';
import qs from 'qs';
export default {
    data: function() {
        return {
            // query: {
            //     address: '',
            //     name: '',
            //     pageIndex: 1,
            //     pageSize: 10
            // },
            tableData: [],
            pageTotal: 10,
            editVisible: false,
            addVisible: false,
            form: {},
            addForm: {},
            currentPage: 1, //默认显示页面为1
            pagesize: 10, //    每页的数据条数
            total: 0
        };
    },

    created() {
        // this.getMyData();
        this.handleDataGet();
    },

    methods: {
        PageAxios(pageNum, size) {

            axios
                .get(global.serverAddress + '/permission',{
                    headers: {
                        authorization: localStorage.getItem('token')
                    },
                    params:{
                        pageNum: pageNum,
                        size: size
                    }
                })
                .then(value => {
                    //console.log(value.data.data);
                    this.tableData = value.data.data.data;
                    this.total = value.data.data.total;
                });
        },

        // 编辑操作
        handleEdit(index, row) {
            this.form = row;
            this.editVisible = true;
        },
        saveEdit() {

             axios
                .put(global.serverAddress + '/permission',qs.stringify(this.form), {
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
                    this.form = {}
                    location.reload()
                });
        },

        handleAdd() {
            this.addVisible = true;
            
        },
        saveAdd() {
            axios
                .post(global.serverAddress + '/permission',qs.stringify(this.addForm), {
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
            
        },

        handleDataGet() {
            this.PageAxios(0, this.pagesize);
        },

        // 控制页面页数
        handleSizeChange: function(size) {
            this.pagesize = size;
            this.PageAxios(0, size);
            this.currentPage = 1;
            /*console.log(this.pagesize) */
        },
        //点击第几页
        handleCurrentChange: function(currentPage) {
            this.PageAxios(currentPage-1, this.pagesize)
            /*console.log(this.currentPage) */
        }
    }
};
</script>

<style scoped>
h1 {
    text-align: center;
    margin: 30px 0;
}
p {
    line-height: 30px;
    margin-bottom: 10px;
    text-indent: 2em;
}
.logout {
    color: #409eff;
}
</style>