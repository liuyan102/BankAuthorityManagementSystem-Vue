<template>
	<el-card class="box-card">
		<div slot="header" class="clearfix" style="height: 40px;">
			<el-input placeholder="请输入关键词" prefix-icon="el-icon-search" v-model="searchKey"
				style="width: 200px;float:left;">
			</el-input>
			<el-button @click="handleSearch(searchKey,searchBusinessType,searchBusinessStatus)" type="primary"
				icon="el-icon-search"
				style="float: left; padding: 3px 0;width: 70px;height: 30px; margin-left: 10px;margin-top: 5px;">查询
			</el-button>
			<span style="float:left;margin-left: 30px;margin-top: 10px;">业务类型</span>
			<el-select v-model="searchBusinessType"
				@change="handleSearch(searchKey,searchBusinessType,searchBusinessStatus)" placeholder="请选择业务类型"
				style="width: 200px;float:left;margin-left: 10px;">
				<el-option v-for="(item, index) in typeOptions" :key="index" :value="item.value" :label="item.label">
				</el-option>
			</el-select>
			<span style="float:left;margin-left: 30px;margin-top: 10px;">业务编码状态</span>
			<el-select v-model="searchBusinessStatus"
				@change="handleSearch(searchKey,searchBusinessType,searchBusinessStatus)" placeholder="请选择业务编码状态"
				style="width: 200px;float:left;margin-left: 10px;">
				<el-option v-for="(item, index) in statusOptions" :key="index" :value="item.value" :label="item.label">
				</el-option>
			</el-select>
			<el-button @click="handleDeleteAll()" type="danger" icon="el-icon-delete"
				style="float: right; padding: 3px 0;width: 100px;height: 30px;">批量删除</el-button>
			<el-button @click="handleNew()" type="primary" icon="el-icon-plus"
				style="float: right; padding: 3px 0;width: 70px;height: 30px;margin-right: 0.625rem;">新建</el-button>
		</div>
		<el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" :row-key="getRowKey"
			@selection-change="handleSelect" v-loading="loading" style="width: 100%;height: 500px;"
			:row-class-name="tableRowClassName">
			<el-table-column type="selection" :reserve-selection="true" width="100">
			</el-table-column>
			<el-table-column prop="businessCode" label="业务编码" width="180">
			</el-table-column>
			<el-table-column prop="businessName" label="业务编码名称" width="180">
			</el-table-column>
			<el-table-column prop="businessDescription" label="业务编码描述" width="250">
			</el-table-column>
			<el-table-column prop="businessType" label="业务类型" width="180" :formatter="typeFormatter">
			</el-table-column>
			<el-table-column prop="businessStatus" label="业务编码状态" width="180" :formatter="statusFormatter">
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="180">
				<template slot-scope="scope">
					<el-button @click="handleEdit(scope.row)" type="primary" icon="el-icon-edit" size="mini">编辑
					</el-button>
					<el-button @click="handleDelete(scope.row)" type="danger" icon="el-icon-delete" size="mini">删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
			:page-sizes="[5, 10, 20, 40]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper"
			:total="tableData.length">，
		</el-pagination>
	</el-card>

</template>

<script>
	export default {
		mounted: function() {
			this.getAllBusiness();
		},
		methods: {
			getAllBusiness(){
				this.$axios({
						headers: {
							'Content-Type': 'application/json'
						},
						method: 'post',
						url: '/api/queryAllBusiness',
						transformRequest: [function(data) {
							return JSON.stringify(data);
						}]
					})
					.then(
						(result) => {
							if (result.data.code == 1) {
								this.tableData = result.data.object;
								console.log(result.data.object);
								this.loading = false;
							}
						})
					.catch((err) => {
						console.log(err);
					})
			},
			handleNew() {
				this.$router.push({
					path: '/AdminMain/NewOrEditBusiness',
					query: {
						operation: 1
					},
				});
			},
			handleEdit(row) {
				this.$router.push({
					path: '/AdminMain/NewOrEditBusiness',
					query: {
						row,
						operation: 0
					},
				});
			},
			handleDelete(row) {
				this.$confirm('此操作将永久删除该业务, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$axios({
							headers: {
								'Content-Type': 'application/json'
							},
							method: 'post',
							url: '/api/deleteBusiness',
							transformRequest: [function(data) {
								return JSON.stringify(data);
							}],
							data: row
						})
						.then(
							(result) => {
								console.log(result.data);
								if (result.data.code == 1) {
									this.getAllBusiness();
								}
							})
						.catch((err) => {
							console.log(err);
						})
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			handleSelect(val) {
				this.selectBusiness = val;
			},
			handleDeleteAll() {
				const length = this.selectBusiness.length;
				for (let i = 0; i < length; i++) {
					this.deleteBusiness.push(this.selectBusiness[i].businessCode)
				}
				console.log(this.deleteBusiness);
				this.$confirm('此操作将永久删除该渠道, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$axios({
							headers: {
								'Content-Type': 'application/json'
							},
							method: 'post',
							url: '/api/deleteAllBusiness',
							transformRequest: [function(data) {
								return JSON.stringify(data);
							}],
							params: {},
							data: this.deleteBusiness
						})
						.then(
							(result) => {
								console.log(result.data);
								if (result.data.code == 1) {
									this.getAllBusiness();
								}
							})
						.catch((err) => {
							console.log(err);
						})
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			handleSearch(searchKey, searchBusinessType, searchBusinessStatus) {
				this.$axios({
						headers: {
							'Content-Type': 'application/json'
						},
						method: 'post',
						url: '/api/queryBusinessByKTS',
						transformRequest: [function(data) {
							return JSON.stringify(data);
						}],
						params: {
							key: searchKey,
							businessType: searchBusinessType,
							businessStatus: searchBusinessStatus,
						},
					})
					.then(
						(result) => {
							if (result.data.code == 1) {
								this.tableData = result.data.object;
								console.log(result.data.object);
							}
						})
					.catch((err) => {
						console.log(err);
					})
			},
			handleSizeChange: function(size) {
				this.pagesize = size;
				console.log(this.pagesize) //每页下拉显示数据
			},
			handleCurrentChange: function(currentPage) {
				this.currentPage = currentPage;
				console.log(this.currentPage) //点击第几页
			},
			tableRowClassName({
				row
			}) {
				if (row.businessStatus == 0) {
					return 'warning-row';
				} else if (row.businessStatus == 1) {
					return 'success-row';
				}
				return '';
			},
			typeFormatter(row, column) {
				const businessType = row.businessType;
				if (businessType == 2) {
					return "财务类";
				} else if (businessType == 1) {
					return "维护类";
				} else {
					return "查询类";
				}
			},
			statusFormatter(row, column) {
				const businessStatus = row.businessStatus;
				if (businessStatus == 1) {
					return "启用";
				} else {
					return "禁用";
				}
			},
			getRowKey(row) {
				return row.businessCode;
			},
		},
		data() {
			return {
				currentPage: 1, //初始页
				pagesize: 5, //    每页的数据
				searchKey: '',
				searchBusinessStatus: 2,
				searchBusinessType: 3,
				tableData: [],
				deleteBusiness: [], //存放删除的数据
				selectBusiness: [], //多选的数据
				typeOptions: [{
						value: 3,
						label: '全部'
					},
					{
						value: 2,
						label: '财务类'
					},
					{
						value: 1,
						label: '维护类'
					},
					{
						value: 0,
						label: '查询类'
					}
				],
				statusOptions: [{
						value: 2,
						label: '全部'
					},
					{
						value: 1,
						label: '启用'
					},
					{
						value: 0,
						label: '禁用'
					}
				],
				loading: true,
			}
		}
	}
</script>

<style>
	.searchInput {
		float: left;
		width: 100px;
	}

	.el-table .warning-row {
		background: oldlace;
	}

	.el-table .success-row {
		background: #f0f9eb;
	}
</style>
