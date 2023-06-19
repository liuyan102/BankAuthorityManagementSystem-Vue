<template>
	<el-card class="box-card">
		<div slot="header" class="clearfix">
			<span>编辑响应码信息</span>
		</div>
		<el-form :model="responseForm" :rules="rules" ref="responseForm" label-width="120px" class="demo-ruleForm">
			<el-form-item label="响应码" prop="responseCode">
				<el-input id="responseCodeInput" oninput="value=value.replace(/\D/g,'')" v-model="responseForm.responseCode" readonly="readonly"></el-input>
			</el-form-item>
			<el-form-item label="响应信息" prop="responseDescription">
				<el-input type="textarea" v-model="responseForm.responseDescription"></el-input>
			</el-form-item>
			<el-form-item label="响应类型" prop="responseType">
				<el-select v-model="responseForm.responseType" placeholder="请选择响应类型">
					<el-option v-for="(item, index) in typeOptions" :key="index" :value="item.value" :label="item.label">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitForm('responseForm')">提交</el-button>
				<el-button @click="cancle()">取消</el-button>
			</el-form-item>
		</el-form>
	</el-card>
</template>

<script>
	export default {
		mounted: function(){
			if(this.$route.query.operation==1){
				responseCodeInput.readOnly=false;
			}else{
				responseCodeInput.readOnly=true;
				this.responseForm = this.$route.query.row;
			}
		},
		data() {
			return {
				responseForm: {
					responseCode: '',
					responseDescription: '',
					responseType: '',
				},
				typeOptions: [{
						value: 1,
						label: '成功类'
					},
					{
						value: 0,
						label: '失败类'
					}
				],
				rules: {
					responseCode: [{
						required: true,
						message: '请输入响应码',
						trigger: 'blur'
					},
					{ 	min: 6, 
						max: 6, 
						message: '长度必须为6个数字', 
						trigger: 'change' ,
					}],
					responseDescription: [{
						required: true,
						message: '请输入响应码描述',
						trigger: 'change'
					}],
					responseType: [{
						required: true,
						message: '请选择响应类型',
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
								url='/api/addResponse';
							}else{
								url='/api/updateResponse'
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
										if(result.data.code == 1){
											this.$router.push({
												path: '/AdminMain/Response'
											});
											this.$message({
												type: 'success',
												message: '提交成功'
											});
										}else if(result.data.code == 0){
											this.$message({
												type: 'error',
												message: '提交失败'
											});
										}
										else if(result.data.code == -1){
											this.$alert(result.data.message, '错误', {
											          confirmButtonText: '确定',
											          callback: action => {
											            this.$message({
											              type: 'error',
											              message: '提交失败'
											            });
											          }
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
					path: '/AdminMain/Response',
				});
			}
		}
	}
</script>

<style>
</style>
