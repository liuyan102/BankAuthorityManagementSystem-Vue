<template>
	<el-card class="box-card">
		<div slot="header" class="clearfix" style="height: 40px;">
			<el-input placeholder="请输入关键词" prefix-icon="el-icon-search" v-model="searchKey"
				style="width: 200px;float:left;">
			</el-input>
			<el-button @click="handleSearch(searchKey,searchResponseType)" type="primary" icon="el-icon-search"
				style="float: left; padding: 3px 0;width: 70px;height: 30px; margin-left: 10px;margin-top: 5px;">查询
			</el-button>
			<span style="float:left;margin-left: 30px;margin-top: 10px;">响应类型</span>
			<el-select v-model="searchResponseType" @change="handleSearch(searchKey,searchResponseType)"
				placeholder="请选择响应类型" style="width: 200px;float:left;margin-left: 10px;">
				<el-option v-for="(item, index) in typeOptions" :key="index" :value="item.value" :label="item.label">
				</el-option>
			</el-select>
			<el-button @click="handleDeleteAll()" type="danger" icon="el-icon-delete"
				style="float: right; padding: 3px 0;width: 100px;height: 30px;">批量删除</el-button>
			<el-button @click="handleNew()" type="primary" icon="el-icon-plus"
				style="float: right; padding: 3px 0;width: 70px;height: 30px;margin-right: 0.625rem;">新建</el-button>
		</div>
		<el-table :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
			@selection-change="handleSelect" v-loading="loading" style="width: 100%;height: 500px;"
			:row-class-name="tableRowClassName" :row-key="getRowKey">
			<el-table-column type="selection" :reserve-selection="true" width="100">
			</el-table-column>
			<el-table-column prop="responseCode" label="响应码" width="180">
			</el-table-column>
			<el-table-column prop="responseDescription" label="响应信息" width="550">
			</el-table-column>
			<el-table-column prop="responseType" label="响应类型" width="180" :formatter="typeFormatter">
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
			this.getAllResponse();
		},
		methods: {
			getAllResponse(){
				this.$axios({
						headers: {
							'Content-Type': 'application/json'
						},
						method: 'post',
						url: '/api/queryAllResponse',
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
					path: '/AdminMain/NewOrEditResponse',
					query: {
						operation: 1
					},
				});
			},
			handleEdit(row) {
				this.$router.push({
					path: '/AdminMain/NewOrEditResponse',
					query: {
						row,
						operation: 0
					},
				});
			},
			handleDelete(row) {
				this.$confirm('此操作将永久删除该响应码, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$axios({
							headers: {
								'Content-Type': 'application/json'
							},
							method: 'post',
							url: '/api/deleteResponse',
							transformRequest: [function(data) {
								return JSON.stringify(data);
							}],
							data: row
						})
						.then(
							(result) => {
								console.log(result.data);
								if (result.data.code == 1) {
									this.getAllResponse();
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
				this.selectResponse = val;
			},
			handleDeleteAll() {
				const length = this.selectResponse.length;
				for (let i = 0; i < length; i++) {
					this.deleteResponse.push(this.selectResponse[i].responseCode)
				}
				console.log(this.deleteResponse);
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
							url: '/api/deleteAllResponse',
							transformRequest: [function(data) {
								return JSON.stringify(data);
							}],
							params: {},
							data: this.deleteResponse
						})
						.then(
							(result) => {
								console.log(result.data);
								if (result.data.code == 1) {
									this.getAllResponse();
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
			handleSearch(searchKey, searchResponseType) {
				this.$axios({
						headers: {
							'Content-Type': 'application/json'
						},
						method: 'post',
						url: '/api/queryResponseByKT',
						transformRequest: [function(data) {
							return JSON.stringify(data);
						}],
						params: {
							key: searchKey,
							responseType: searchResponseType,
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
				if (row.responseType == 0) {
					return 'warning-row';
				} else if (row.responseType == 1) {
					return 'success-row';
				}
				return '';
			},
			typeFormatter(row, column) {
				const responseType = row.responseType;
				if (responseType == 1) {
					return "成功类";
				} else {
					return "失败类";
				}
			},
			getRowKey(row){
			   return row.responseCode;
			}, 
		},
		data() {
			return {
				currentPage: 1, //初始页
				pagesize: 5, //每页的数据
				searchKey: '',
				searchResponseType: 2,
				tableData: [],
				deleteResponse: [], //存放删除的数据
				selectResponse: [], //多选的数据
				typeOptions: [{
						value: 2,
						label: '全部'
					},
					{
						value: 1,
						label: '成功类'
					},
					{
						value: 0,
						label: '失败类'
					}
				],
				loading: true
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
