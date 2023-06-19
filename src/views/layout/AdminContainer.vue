<template>
	<div style="height: 100%;width: 100%;">
		<el-container style="height: 100%">
			<el-aside width="200px" style="background-color: rgb(238, 241, 246)">
				<el-row>
					<el-menu class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
						background-color="#304156" text-color="#fff" active-text-color="#ffd04b">
						<el-menu-item index="1" @click="gotoLinkChanel()">
							<i class="el-icon-location"></i>
							<span slot="title">渠道信息管理</span>
						</el-menu-item>
						<el-menu-item index="2" @click="gotoLinkBusiness()">
							<i class="el-icon-menu"></i>
							<span slot="title">业务编码信息管理</span>
						</el-menu-item>
						<el-menu-item index="3" @click="gotoLinkAuthority()">
							<i class="el-icon-document"></i>
							<span slot="title">渠道开通业务信息管理</span>
						</el-menu-item>
						<el-menu-item index="4" @click="gotoLinkResponse()">
							<i class="el-icon-setting"></i>
							<span slot="title">交易响应码信息管理</span>
						</el-menu-item>
					</el-menu>
				</el-row>
			</el-aside>

			<el-container>
				<el-header style="text-align: right; font-size: 15px">
					<span>银行渠道业务权限管理系统</span>
				</el-header>
				<el-main>
					<router-view></router-view>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
	export default {
		methods: {
			gotoLinkChanel(){
				this.$router.push({
					path: '/AdminMain'
				});
			},
			gotoLinkBusiness(){
				this.$router.push({
					path: '/AdminMain/Business'
				});
			},
			gotoLinkAuthority(){
				this.$router.push({
					path: '/AdminMain/Authority'
				});
			},
			gotoLinkResponse(){
				this.$router.push({
					path: '/AdminMain/Response'
				});
			},
			handleOpen(key, keyPath) {
				console.log(key, keyPath);
			},
			handleClose(key, keyPath) {
				console.log(key, keyPath);
			}
		}
	};
</script>

<style>
	body,
	html {
		margin: 0rem;
		height: 100%;
		background-color: #ececec;
	}

	.el-row {
		height: 100%;
	}

	.el-menu {
		height: 100%;
	}

	.el-header {
		background-color: #ffffff;
		color: #333;
		line-height: 60px;
	}

	.el-aside {
		color: #333;
	}
</style>
