import Vue from 'vue'
import VueRouter from 'vue-router'
//登录
import AdminLogin from '../views/AdminLogin.vue'
//管理员界面布局
import AdminContainer from '../views/layout/AdminContainer.vue'
//渠道
import Channel from '../views/channel/Channel.vue'
import NewOrEditChannel from '../views/channel/NewOrEditChannel.vue'
//业务
import Business from '../views/business/Business.vue'
import NewOrEditBusiness from '../views/business/NewOrEditBusiness.vue'
//权限
import Authority from '../views/authority/Authority.vue'
//响应码
import Response from '../views/response/Response.vue'
import NewOrEditResponse from '../views/response/NewOrEditResponse.vue'
//客户登录
import ClientLogin from '../views/client/ClientLogin.vue'
//客户界面布局
import ClientContainer from '../views/layout/ClientContainer.vue'
//模拟客户交易
import GetMoney from '../views/client/GetMoney.vue'
import Withdraw from '../views/client/Withdraw.vue'

const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'AdminLogin',
		component: AdminLogin
	},
	{
		path: '/AdminMain',
		name: 'AdminContainer',
		component: AdminContainer,
		children:[
			{
				path: '/',
				name: 'Channel',
				component: Channel,
			},
			{
				path: 'NewOrEditChannel',
				name: 'NewOrEditChannel',
				component: NewOrEditChannel,
			},
			{
				path: 'Business',
				name: 'Business',
				component: Business,
			},
			{
				path: 'NewOrEditBusiness',
				name: 'NewOrEditBusiness',
				component: NewOrEditBusiness,
			},
			{
				path: 'Authority',
				name: 'Authority',
				component: Authority,
			},
			{
				path: 'Response',
				name: 'Response',
				component: Response,
			},
			{
				path: 'NewOrEditResponse',
				name: 'NewOrEditResponse',
				component: NewOrEditResponse,
			},
		]
	},
	{
		path: '/ClientLogin',
		name: 'ClientLogin',
		component: ClientLogin
	},
	{
		path: '/ClientMain',
		name: 'ClientContainer',
		component: ClientContainer,
		children:[
			{
				path: '/',
				name: 'Withdraw',
				component: Withdraw,
			},
			{
				path: 'GetMoney',
				name: 'GetMoney',
				component: GetMoney,
			}
		]
	},
	
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
  routes
})

export default router
