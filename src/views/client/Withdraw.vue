<template>
	<el-card class="box-card">
		<div slot="header" class="clearfix">
			<span>取款</span>
		</div>
		<el-form :model="clientForm" :rules="rules" ref="clientForm" label-width="120px" class="demo-ruleForm">
			<el-form-item label="当前渠道" prop="channelCode">
				<el-select v-model="clientForm.channelCode" placeholder="请选择渠道"
					style="width: 200px;float:left;margin-left: 10px;">
					<el-option v-for="(item, index) in channelOptions" :key="index" :value="item.channelCode"
						:label="item.channelName">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="当前业务" prop="businessCode">
				<el-select v-model="clientForm.businessCode" placeholder="请选择业务编码"
					style="width: 200px;float:left;margin-left: 10px;">
					<el-option v-for="(item, index) in businessOptions" :key="index" :value="item.value"
						:label="item.label">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="银行卡号" prop="bankCard">
				<el-input v-model="clientForm.bankCard" oninput="value=value.replace(/\D/g,'')"></el-input>
			</el-form-item>
			<el-form-item label="交易密码" prop="bankPassword">
				<el-input v-model="clientForm.bankPassword" type="password"></el-input>
			</el-form-item>
			<el-form-item label="取款金额" prop="money">
				<el-input v-model="clientForm.money" oninput="value=value.replace(/\D/g,'')"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitForm('clientForm')">提交</el-button>
			</el-form-item>
		</el-form>
	</el-card>
</template>

<script>
	export default {
		mounted: function() {
			this.getAllChannel();
		},
		data() {
			return {
				clientForm: {
					channelCode: '',
					businessCode: 'service005',
					bankCard: '',
					bankPassword: '',
					money: '',
				},
				channelOptions: [],
				businessOptions: [{
					value: 'service005',
					label: '取款',
				}],
				rules: {
					channelCode: [{
						required: true,
						message: '请选择渠道',
						trigger: 'change'
					}],
					bankCard: [{
						required: true,
						message: '请输入银行卡号',
						trigger: 'change'
					}],
					bankPassword: [{
						required: true,
						message: '请输入交易密码',
						trigger: 'change'
					}],
					money: [{
						required: true,
						message: '请输入取款金额',
						trigger: 'change'
					}],
				}
			};
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
							}
						})
					.catch((err) => {
						console.log(err);
					})
			},
			submitForm(formName) {
				this.$confirm('是否确认提交？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$refs[formName].validate((valid) => {
						if (valid) {
							this.$axios({
									headers: {
										'Content-Type': 'application/json'
									},
									method: 'post',
									url: '/api/clientWithdraw',
									transformRequest: [function(data) {
										return JSON.stringify(data);
									}],
									data: this.[formName]
								})
								.then(
									(result) => {
										console.log(result.data);
										this.$alert(result.data.object.responseDescription, '交易响应码' +
											result.data.object.responseCode, {
												confirmButtonText: '确定',
											});
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
		}
	}
</script>

<style>
</style>
