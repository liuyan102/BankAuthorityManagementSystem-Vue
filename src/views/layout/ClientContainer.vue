<template>
	<div style="height: 100%;width: 100%;">
		<el-container style="height: 100%">
			<el-aside width="200px" style="background-color: rgb(238, 241, 246)">
				<el-row>
					<el-menu class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
						background-color="#304156" text-color="#fff" active-text-color="#ffd04b">
						<el-menu-item index="1" @click="gotoLinkWithdraw()">
							<i class="el-icon-edit-outline"></i>
							<span slot="title">取款</span>
						</el-menu-item>
						<el-menu-item index="2" @click="gotoLinkGetMoney()">
							<i class="el-icon-s-finance"></i>
							<span slot="title">查询账户余额</span>
						</el-menu-item>
					</el-menu>
				</el-row>
			</el-aside>
			<el-container>
				<el-header style="text-align: right; font-size: 15px">
					<span>客户交易模拟</span>
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
			gotoLinkWithdraw(){
				this.$router.push({
					path: '/ClientMain',
				});
			},
			gotoLinkGetMoney(){
				this.$router.push({
					path: '/ClientMain/GetMoney',
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
