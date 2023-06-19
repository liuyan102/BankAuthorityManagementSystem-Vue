<template>
	<el-card class="box-card">
		<div slot="header" class="clearfix">
			<span>编辑渠道信息</span>
		</div>
		<el-form :model="channelForm" :rules="rules" ref="channelForm" label-width="100px" class="demo-ruleForm">
			<el-form-item label="渠道编码" prop="channelCode">
				<el-input id="channelCodeInput" v-model="channelForm.channelCode" readonly></el-input>
			</el-form-item>
			<el-form-item label="渠道名称" prop="channelName">
				<el-input v-model="channelForm.channelName"></el-input>
			</el-form-item>
			<el-form-item label="渠道描述" prop="channelDescription">
				<el-input type="textarea" v-model="channelForm.channelDescription"></el-input>
			</el-form-item>
			<el-form-item label="渠道类型" prop="channelType">
				<el-select v-model="channelForm.channelType" placeholder="请选择渠道类型">
					<el-option v-for="(item, index) in typeOptions" :key="index" :value="item.value"
						:label="item.label">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="渠道状态" prop="channelStatus">
				<el-select v-model="channelForm.channelStatus" placeholder="请选择渠道状态">
					<el-option v-for="(item, index) in statusOptions" :key="index" :value="item.value"
						:label="item.label">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitForm('channelForm')">提交</el-button>
				<el-button @click="cancle()">取消</el-button>
			</el-form-item>
		</el-form>
	</el-card>
</template>

<script>
	export default {
		mounted: function() {
			if (this.$route.query.operation == 1) {
				this.$axios({
						headers: {
							'Content-Type': 'application/json'
						},
						method: 'post',
						url: '/api/getChannelCode',
						transformRequest: [function(data) {
							return JSON.stringify(data);
						}],
					})
					.then(
						(result) => {
							console.log(result.data);
							if (result.data.code == 1) {
								this.channelForm.channelCode = result.data.object;
							}
						})
					.catch((err) => {
						console.log(err);
					})
			} else {
				this.channelForm = this.$route.query.row;
			}
		},
		data() {
			return {
				channelForm: {
					channelCode: '',
					channelName: '',
					channelDescription: '',
					channelType: '',
					channelStatus: '',
				},
				typeOptions: [{
						value: 1,
						label: '客户访问渠道'
					},
					{
						value: 0,
						label: '银行内部渠道'
					}
				],
				statusOptions: [{
						value: 1,
						label: '启用'
					},
					{
						value: 0,
						label: '禁用'
					}
				],
				rules: {
					channelName: [{
						required: true,
						message: '请输入渠道名称',
						trigger: 'change'
					}],
					channelDescription: [{
						required: true,
						message: '请输入渠道描述',
						trigger: 'change'
					}],
					channelType: [{
						required: true,
						message: '请选择渠道类型',
						trigger: 'change'
					}],
					channelStatus: [{
						required: true,
						message: '请选择渠道状态',
						trigger: 'change'
					}],
				}
			};
		},
		methods: {
			submitForm(formName) {
				this.$confirm('是否确认提交？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$refs[formName].validate((valid) => {
						if (valid) {
							var url;
							if (this.$route.query.operation == 1) {
								url = '/api/addChannel';
							} else {
								url = '/api/updateChannel';
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
									data: this. [formName]
								})
								.then(
									(result) => {
										console.log(result.data);
										if (result.data.code == 1) {
											this.$router.push({
												path: '/AdminMain'
											});
											this.$message({
												type: 'success',
												message: '提交成功'
											});
										}else{
											this.$message({
												type: 'error',
												message: '提交失败'
											});
										}
									})
								.catch((err) => {
									console.log(err);
								})
						} else {
							console.log('error submit!!');
							return false;
						}
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消提交'
					});
				});
			},
			cancle() {
				this.$router.push({
					path: '/AdminMain',
				});
			}
		}
	}
</script>

<style>
</style>
