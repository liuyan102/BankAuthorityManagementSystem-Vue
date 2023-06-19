<template>
	<el-card class="box-card">
		<div slot="header" class="clearfix">
			<span>编辑业务编码信息</span>
		</div>
		<el-form :model="businessForm" :rules="rules" ref="businessForm" label-width="120px" class="demo-ruleForm">
			<el-form-item label="业务编码" prop="businessCode">
				<el-input id="businessCodeInput" v-model="businessForm.businessCode" readonly></el-input>
			</el-form-item>
			<el-form-item label="业务编码名称" prop="businessName">
				<el-input v-model="businessForm.businessName"></el-input>
			</el-form-item>
			<el-form-item label="业务编码描述" prop="businessDescription">
				<el-input type="textarea" v-model="businessForm.businessDescription"></el-input>
			</el-form-item>
			<el-form-item label="业务类型" prop="businessType">
				<el-select v-model="businessForm.businessType" placeholder="请选择业务类型">
					<el-option v-for="(item, index) in typeOptions" :key="index" :value="item.value" :label="item.label">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="业务编码状态" prop="businessStatus">
				<el-select v-model="businessForm.businessStatus" placeholder="请选择业务编码状态">
					<el-option v-for="(item, index) in statusOptions" :key="index" :value="item.value" :label="item.label">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitForm('businessForm')">提交</el-button>
				<el-button @click="cancle()">取消</el-button>
			</el-form-item>
		</el-form>
	</el-card>
</template>

<script>
	export default {
		mounted: function(){
			if(this.$route.query.operation==1){
				this.$axios({
						headers: {
							'Content-Type': 'application/json'
						},
						method: 'post',
						url: '/api/getBusinessCode',
						transformRequest: [function(data) {
							return JSON.stringify(data);
						}],
					})
					.then(
						(result) => {
							console.log(result.data);
							if (result.data.code == 1) {
								this.businessForm.businessCode = result.data.object;
							}
						})
					.catch((err) => {
						console.log(err);
					})
			}else{
				this.businessForm = this.$route.query.row;
			}
		},
		data() {
			return {
				businessForm: {
					businessCode: '',
					businessName: '',
					businessDescription: '',
					businessType: '',
					businessStatus: '',
				},
				typeOptions: [{
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
						value: 1,
						label: '启用'
					},
					{
						value: 0,
						label: '禁用'
					}
				],
				rules: {
					businessName: [{
						required: true,
						message: '请输入业务编码名称',
						trigger: 'change'
					}],
					businessDescription: [{
						required: true,
						message: '请输入业务编码描述',
						trigger: 'change'
					}],
					businessType: [{
						required: true,
						message: '请选择业务类型',
						trigger: 'change'
					}],
					businessStatus: [{
						required: true,
						message: '请选择业务编码状态',
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
							if(this.$route.query.operation==1){
								url='/api/addBusiness';
							}else{
								url='/api/updateBusiness'
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
										if(result.data.code==1){
											this.$router.push({
												path: '/AdminMain/Business'
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
					path: '/AdminMain/Business',
				});
			}
		}
	}
</script>

<style>
</style>
