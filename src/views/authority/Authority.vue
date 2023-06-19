<template>
	<el-card class="box-card">
		<div slot="header" class="clearfix" style="height: 40px;">
			<span style="float:left;margin-top: 10px;">渠道编码</span>
			<el-select v-model="searchChannelCode" @change="handleSearch(searchChannelCode,searchBusinessCode)"
				placeholder="请选择渠道编码" style="width: 200px;float:left;margin-left: 10px;">
				<el-option v-for="(item, index) in channelOptions" :key="index" :value="item.channelCode"
					:label="item.channelName+item.channelCode">
				</el-option>
			</el-select>
			<span style="float:left;margin-left: 30px;margin-top: 10px;">业务编码</span>
			<el-select v-model="searchBusinessCode" @change="handleSearch(searchChannelCode,searchBusinessCode)"
				placeholder="请选择业务编码" style="width: 200px;float:left;margin-left: 10px;">
				<el-option v-for="(item, index) in businessOptions" :key="index" :value="item.businessCode"
					:label="item.businessName+item.businessCode">
				</el-option>
			</el-select>
		</div>
		<el-table ref="multipleTable" :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
			@selection-change="handleSelect" v-loading="loading" style="width: 100%;height: 500px;"
			:row-class-name="tableRowClassName" :row-key="getRowKey">
			<el-table-column type="selection" :reserve-selection="true" width="90">
			</el-table-column>
			<el-table-column prop="businessCode" label="业务编码" width="180">
			</el-table-column>
			<el-table-column prop="businessName" label="业务编码名称" width="180">
			</el-table-column>
			<el-table-column prop="openMode" label="开通方式" width="200">
				<template v-slot="{row}">
					<el-radio-group v-model="row.openMode">
						<el-radio :label="1">每天</el-radio>
						<el-radio :label="2">固定期限</el-radio>
					</el-radio-group>
				</template>
			</el-table-column>
			<el-table-column prop="openTime" label="开始时间" width="300">
				<template v-slot="{row}">
					<el-date-picker v-model="row.openTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
						placeholder="选择开始时间">
					</el-date-picker>
				</template>
			</el-table-column>
			<el-table-column prop="endTime" label="结束时间" width="300">
				<template v-slot="{row}">
					<el-date-picker v-model="row.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
						placeholder="选择结束时间">
					</el-date-picker>
				</template>
			</el-table-column>
		</el-table>
		<el-button @click="handleSubmit()" type="primary" icon="el-icon-plus"
			style="float: right; padding: 3px 0;width: 70px;height: 30px;">提交
		</el-button>
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
			:page-sizes="[5, 10, 20, 40]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper"
			:total="tableData.length">，
		</el-pagination>
	</el-card>

</template>

<script>
	export default {
		mounted: function() {
			this.getAllChannel();
			this.getAllBusiness();
		},
		methods: {
			getAllChannel() {
				this.$axios({
						headers: {
							'Content-Type': 'application/json'
						},
						method: 'post',
						url: '/api/queryAllChannel',
						transformRequest: [function(data) {
							return JSON.stringify(data);
						}],
					})
					.then(
						(result) => {
							if (result.data.code == 1) {
								this.channelOptions = result.data.object;
								this.searchChannelCode = this.channelOptions[0].channelCode;
								this.handleSearch(this.searchChannelCode, this.searchBusinessCode)
							}
						})
					.catch((err) => {
						console.log(err);
					})
			},
			getAllBusiness() {
				this.$axios({
						headers: {
							'Content-Type': 'application/json'
						},
						method: 'post',
						url: '/api/queryAllBusiness',
						transformRequest: [function(data) {
							return JSON.stringify(data);
						}],
					})
					.then(
						(result) => {
							if (result.data.code == 1) {
								this.businessOptions = result.data.object;
								this.businessOptions.push({
									businessCode: '',
									businessName: '全部'
								});
							}
						})
					.catch((err) => {
						console.log(err);
					})
			},
			handleSearch(searchChannelCode, searchBusinessCode) {
				this.$axios({
						headers: {
							'Content-Type': 'application/json'
						},
						method: 'post',
						url: '/api/queryBusinessByChannel',
						transformRequest: [function(data) {
							return JSON.stringify(data);
						}],
						params: {
							channelCode: searchChannelCode,
							businessCode: searchBusinessCode,
						},
					})
					.then(
						(result) => {
							if (result.data.code == 1) {
								this.tableData = result.data.object;
								this.showOpenBusiness();
							}
						})
					.catch((err) => {
						console.log(err);
					})
			},
			showOpenBusiness() {
				this.$nextTick(() => {
					this.$refs.multipleTable.clearSelection();
					for(var i=0;i<this.tableData.length;i++){
						this.tableData[i].channelCode = this.searchChannelCode;
						if(this.tableData[i].openMode > 0){
							this.$refs.multipleTable.toggleRowSelection(this.tableData[i],true);
						}
					}
				})
				this.loading = false;
			},
			handleSelect(val) {
				this.selectBusiness = val;
			},
			handleSubmit() {
				console.log(this.selectBusiness);
				console.log(this.searchChannelCode);
				this.$confirm('是否确认提交？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var url, data, param;
					if (this.selectBusiness.length == 0) {
						url = '/api/deleteAuthority';
						param = {
							channelCode: this.searchChannelCode
						};
					} else {
						url = '/api/addAuthority';
						data = this.selectBusiness;
					}
					this.$axios({
							headers: {
								'Content-Type': 'application/json'
							},
							method: 'post',
							url: url,
							transformRequest: [function(data) {
								return JSON.stringify(data);
							}],
							params: param,
							data: data
						})
						.then(
							(result) => {
								console.log(result.data);
								if (result.data.code == 1) {
									this.loading = true;
									this.handleSearch(this.searchChannelCode, this.searchBusinessCode);
									this.$message({
										type: 'success',
										message: '权限修改成功'
									});
								} else {
									this.$message({
										type: 'error',
										message: '权限修改失败'
									});
								}
							})
						.catch((err) => {
							console.log(err);
						})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消提交'
					});
				});
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
				if (row.openMode == 0) {
					return 'warning-row';
				} else {
					return 'success-row';
				}
				return '';
			},
			getRowKey(row){
			   return row.id;
			}, 
		},
		data() {
			return {
				currentPage: 1, //初始页
				pagesize: 5, //每页的数据
				searchBusinessCode: '',
				searchChannelCode: '',
				tableData: [],
				channelOptions: [],
				businessOptions: [],
				selectBusiness: [],
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

	.bottom {
		height: 30px;
		margin-top: 5px;
	}
</style>
