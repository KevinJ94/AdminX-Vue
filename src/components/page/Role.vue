<template>
    <div class="custom-tree-container">
        <div class="block">
            <p style="padding-bottom: 10px">角色管理</p>
            <!-- <el-button type="primary" @click="() => handleAdd()" style="margin-bottom: 10px">新增角色</el-button> -->
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
                        <el-button
                            type="text"
                            size="large"
                            icon="el-icon-menu"
                            @click="() => handleMenuDistrbute(data)"
                        >分配菜单</el-button>
                        <!-- <el-button type="text" size="large" @click="() => handleBan(data)">Delete</el-button> -->
                        <el-button type="text" size="large" icon="el-icon-delete" @click="open">删除角色</el-button>
                    </span>
                </span>
            </el-tree>
        </div>
        <div>
            <!-- 增加弹出框 -->
            <el-dialog title="增加角色" :visible.sync="addVisible" width="30%">
                <el-form ref="addForm" :model="addForm" label-width="70px">
                    <el-form-item label="父角色:">
                        <el-input v-model="addForm.desc_" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="父角色id:">
                        <el-input v-model="addForm.pid" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="名称:">
                        <el-input v-model="addForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="描述:">
                        <el-input v-model="addForm.desc"></el-input>
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
            <el-dialog title="修改角色" :visible.sync="editVisible" width="30%">
                <el-form ref="form" :model="form" label-width="70px">
                    <el-form-item label="名称:">
                        <el-input v-model="form.name" @input="change($event)"></el-input>
                    </el-form-item>
                    <el-form-item label="描述:">
                        <el-input v-model="form.desc" @input="change($event)"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                    <el-button @click="editVisible = false">取 消</el-button>
                </span>
            </el-dialog>
        </div>
        <div>
            <!-- 修改弹出框 -->
            <el-dialog title="编辑路由" :visible.sync="editRouterVisible" width="70%">
                <h3>已有路由</h3>
                <h3>新增路由</h3>
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
                    <el-table-column prop="desc" label="权限"></el-table-column>
                    <el-table-column prop="method" label="方法"></el-table-column>
                    <el-table-column prop="name" label="名称" align="center"></el-table-column>
                    <el-table-column prop="url" label="路由" align="center"></el-table-column>
                </el-table>
                <p style="padding-top: 10px">{{ "您已选择: "+ selected_data }}</p>
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
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary">确 定</el-button>
                    <el-button @click="editRouterVisible = false">取 消</el-button>
                </span>
            </el-dialog>
        </div>
        <div>
            <el-dialog title="分配菜单" :visible.sync="menuVisible" width="30%">
                <el-form ref="form" :model="form" label-width="70px">
                    <el-tree
                        :data="menudata"
                        :props="menu_defaultProps"
                        ref="tree"
                        show-checkbox
                        node-key="id"
                        default-expand-all
                        :expand-on-click-node="false"
                    >
                        <span class="custom-tree-node" slot-scope="{ node }">
                            <span>{{ node.label }}</span>
                        </span>
                    </el-tree>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="cancel">取 消</el-button>
                    <el-button type="primary" @click="getselectedid">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>



<script>
import axios from 'axios';
import bus from '../common/bus';
import global from '../common/Global';
import qs from 'qs';
export default {
    data() {
        return {
            data: [],
            defaultProps: {
                children: 'children',
                label: 'desc_',
                pid: 'pid',
                id: 'id',
                title: 'title'
            },
            menudata: [],
            menu_defaultProps: {
                children: 'children',
                label: 'title',
                pid: 'pid',
                id: 'id',
                title: 'title'
            },
            editVisible: false,
            addVisible: false,
            editRouterVisible: false,
            menuVisible: false,
            // banVisible: false,
            form: {},
            addForm: {},
            tableData: [],
            pageTotal: 10,
            currentPage: 1, //默认显示页面为1
            pagesize: 10, //    每页的数据条数
            total: 0,
            selected_data: [],
            selected_role_data:[]
        };
    },

    created() {
        this.retriveData();
    },

    methods: {
        append(data) {
            // console.log(data.title);
        },

        change(e) {
            this.$forceUpdate();
        },

        handleEditRouter(data) {
            this.editRouterVisible = true;
            this.handleDataGet();
            // console.log(pid)
        },

        retriveData() {
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

        handleAdd(data = null) {
            this.addVisible = true;

            if (data == null) {
                this.addForm.desc_ = '无';
                //this.form.id = data.id;
                //this.form.pid = data.pid;
            } else {
                this.addForm.desc_ = data.desc_;
                this.addForm.pid = data.id;
            }
            // console.log(data.desc_)
        },
        saveAdd() {
            //console.log(this.addForm)
            axios
                .post(global.serverAddress + '/role', qs.stringify(this.addForm), {
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

        handleEdit(data) {
            this.editVisible = true;
            this.form.id = data.id;
            this.form.desc = data.desc_;
            this.form.name = data.title;
            // console.log(pid)
        },

        saveEdit() {
            //console.log(this.form)
            axios
                .put(global.serverAddress + '/role', qs.stringify(this.form), {
                    headers: {
                        authorization: localStorage.getItem('token')
                    }
                })
                .then(value => {
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
        },

        handleEditRouter(data) {
            this.editRouterVisible = true;
            this.handleDataGet();
            // console.log(pid)
        },

        handleMenuDistrbute(data) {
            this.menuVisible = true;
            this.retriveMenuData();
        },

        PageAxios(pageNum, size) {
            axios
                .get(global.serverAddress + '/permission', {
                    headers: {
                        authorization: localStorage.getItem('token')
                    },
                    params: {
                        pageNum: pageNum,
                        size: size
                    }
                })
                .then(value => {
                    console.log(value.data.data);
                    this.tableData = value.data.data.data;
                    this.total = value.data.data.total;
                });
        },

        retriveMenuData() {
            axios
                .get(global.serverAddress + '/menu', {
                    headers: {
                        authorization: localStorage.getItem('token')
                    }
                })
                .then(value => {
                    // console.log(value.data.data);
                    this.menudata = JSON.parse(JSON.stringify(value.data.data));
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
            this.PageAxios(currentPage - 1, this.pagesize);
            /*console.log(this.currentPage) */
        },

        handleSelectionChange(val) {
            var id_list = [];
            var name_list = [];
            val.forEach((val, index) => {
                this.tableData.forEach((v, i) => {
                    // id 是每一行的数据id
                    if (val.id == v.id) {
                        // console.log(i);
                        id_list.push(v.id);
                        name_list.push(v.desc);
                    }
                });
            });
            console.log(id_list);
            console.log(name_list);
            this.selected_data = name_list;
        },

        // handleCheckChange(data, checked, indeterminate) {
        //     // console.log(data)
            
            
        //     // let arr = [];
        //     // res.forEach(item => {
        //     //     arr.push(item.id);
        //     // });
        //     console.log(res)
        // },

        getselectedid(){
            let res = this.$refs.tree.getCheckedKeys();
            this.selected_role_data = res
            console.log(this.selected_role_data)
        },

        cancel(){
            this.menuVisible = false
            console.log("closed")
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