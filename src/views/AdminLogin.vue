<template>
	<div class="login-container">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>系统登录</span>
			</div>
			<el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" label-width="100px"
				class="demo-ruleForm">
				<el-form-item label="用户名:" prop="username">
					<el-input type="text" v-model="loginForm.username" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="密码:" prop="password">
					<el-input type="password" v-model="loginForm.password" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('loginForm')" style="width: 350px;">登录</el-button>
				</el-form-item>
				<el-form-item>
					<el-button @click="resetForm('loginForm')" style="width: 350px;">重置</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
	<div>
		
	</div>
</template>

<script>
	export default {
		data() {
			return {
				loginForm: {
					username: '',
					password: ''
				},
				rules: {
					username: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur',
					}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur',
					}]
				}

			};
		},
		methods: {
			submitForm(formName) {
				this.$refs. [formName].validate((valid) => {
					if (valid) {
						this.$axios({
								headers: {
									'Content-Type': 'application/json'
								},
								method: 'post',
								url: '/api/adminLogin',
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
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.login-container {
		background: url(../assets/login.jpg);
		width: 100%;
		height: 100%;
		position: fixed;
		background-size: 100% 100%;
	}

	.el-card {
		width: 500px;
		height: 400px;
		margin: auto;
		margin-top: 9.375rem;
	}
</style>
