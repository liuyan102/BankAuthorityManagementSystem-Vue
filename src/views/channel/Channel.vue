<template>
	<el-card class="box-card">
		<div slot="header" class="clearfix" style="height: 40px;">
			<el-input placeholder="请输入关键词" prefix-icon="el-icon-search" v-model="searchKey"
				style="width: 200px;float:left;">
			</el-input>
			<el-button @click="handleSearch(searchKey,searchChannelType,searchChannelStatus)" type="primary"
				icon="el-icon-search"
				style="float: left; padding: 3px 0;width: 70px;height: 30px; margin-left: 10px;margin-top: 5px;">查询
			</el-button>
			<span style="float:left;margin-left: 30px;margin-top: 10px;">渠道类型</span>
			<el-select v-model="searchChannelType"
				@change="handleSearch(searchKey,searchChannelType,searchChannelStatus)" placeholder="请选择渠道类型"
				style="width: 200px;float:left;margin-left: 10px;">
				<el-option v-for="(item, index) in typeOptions" :key="index" :value="item.value" :label="item.label">
				</el-option>
			</el-select>
			<span style="float:left;margin-left: 30px;margin-top: 10px;">渠道状态</span>
			<el-select v-model="searchChannelStatus"
				@change="handleSearch(searchKey,searchChannelType,searchChannelStatus)" placeholder="请选择渠道状态"
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
			<el-table-column prop="channelCode" label="渠道编码" width="180">
			</el-table-column>
			<el-table-column prop="channelName" label="渠道名称" width="180">
			</el-table-column>
			<el-table-column prop="channelDescription" label="渠道描述" width="250">
			</el-table-column>
			<el-table-column prop="channelType" label="渠道类型" width="180" :formatter="typeFormatter">
			</el-table-column>
			<el-table-column prop="channelStatus" label="渠道状态" width="180" :formatter="statusFormatter">
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
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
			:current-page="currentPage" :page-sizes="[5, 10, 20, 40]" 
			:page-size="pagesize"  layout="total, sizes, prev, pager, next, jumper"
			:total="tableData.length">，
		</el-pagination>
	</el-card>

</template>

<script>
	export default {
		mounted: function() {
			this.$axios({
					headers: {
						'Content-Type': 'application/json'
					},
					method: 'post',
					url: '/api/queryAllChannel',
					transformRequest: [function(data) {
						return JSON.stringify(data);
					}]
				})
				.then(
					(result) => {
						if (result.data.code == 1) {
							this.tableData = result.data.object;
							console.log(result.data);
							this.loading = false;
						}
					})
				.catch((err) => {
					console.log(err);
				})
		},
		methods: {
			handleNew() {
				this.$router.push({
					path: '/AdminMain/NewOrEditChannel',
					query: {
						operation: 1
					},
				});
			},
			handleEdit(row) {
				this.$router.push({
					path: '/AdminMain/NewOrEditChannel',
					query: {
						row,
						operation: 0
					},
				});
			},
			handleDelete(row) {
				console.log(row);
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
							url: '/api/deleteChannel',
							transformRequest: [function(data) {
								return JSON.stringify(data);
							}],
							data: row
						})
						.then(
							(result) => {
								console.log(result.data);
								if (result.data.code == 1) {
									location.reload();
									this.$message({
										type: 'success',
										message: '删除成功'
									});
								} else {
									this.$message({
										type: 'error',
										message: '删除失败'
									});
								}
							})
						.catch((err) => {
							console.log(err);
						})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			handleSelect(val) {
				this.selectChannel = val;
			},
			handleDeleteAll() {
				const length = this.selectChannel.length;
				for (let i = 0; i < length; i++) {
					this.deleteChannel.push(this.selectChannel[i].channelCode)
				}
				console.log(this.deleteChannel);
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
							url: '/api/deleteAllChannel',
							transformRequest: [function(data) {
								return JSON.stringify(data);
							}],
							params: {},
							data: this.deleteChannel
						})
						.then(
							(result) => {
								console.log(result.data);
								if (result.data.code == 1) {
									location.reload();
									this.$message({
										type: 'success',
										message: '删除成功'
									});
								} else {
									this.$message({
										type: 'error',
										message: '删除失败'
									});
								}
							})
						.catch((err) => {
							console.log(err);
						})

				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			handleSearch(searchKey, searchChannelType, searchChannelStatus) {
				this.$axios({
						headers: {
							'Content-Type': 'application/json'
						},
						method: 'post',
						url: '/api/queryChannelByKTS',
						transformRequest: [function(data) {
							return JSON.stringify(data);
						}],
						params: {
							key: searchKey,
							channelType: searchChannelType,
							channelStatus: searchChannelStatus,
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
				if (row.channelStatus == 0) {
					return 'warning-row';
				} else if (row.channelStatus == 1) {
					return 'success-row';
				}
				return '';
			},
			typeFormatter(row, column) {
				const channelType = row.channelType;
				if (channelType == 1) {
					return "客户访问渠道";
				} else {
					return "银行内部渠道";
				}
			},
			statusFormatter(row, column) {
				const channelStatus = row.channelStatus;
				if (channelStatus == 1) {
					return "启用";
				} else {
					return "禁用";
				}
			},
			getRowKey(row){
			   return row.channelCode;
			}, 
		},
		data() {
			return {
				currentPage: 1, //初始页
				pagesize: 5, //    每页的数据
				searchKey: '',
				searchChannelStatus: 2,
				searchChannelType: 2,
				tableData: [],
				deleteChannel: [], //存放删除的数据
				selectChannel: [], //多选的数据
				typeOptions: [{
						value: 2,
						label: '全部'
					},
					{
						value: 1,
						label: '客户访问渠道'
					},
					{
						value: 0,
						label: '银行内部渠道'
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
