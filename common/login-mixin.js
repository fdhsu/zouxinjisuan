/**
 * Login pages shared mixin
 * Common data, methods, and styles for login.vue (one-click login) and login2.vue (password login)
 */
import { setUserInfo, setToken } from "@/utils/auth";

export default {
	data() {
		return {
			isReadChk: false,
			isCanUse: uni.getStorageSync('isCanUse'),
			mobile: '',
			password: '',
			avatarUrl: '',
			bgImg: ['', ''],
			imgTime: '',
			imgIndex: 0,
			codeName: '验证码',
			isCode: true,
			smscode: '',
			wxcode: '',
			showSmsLogin: false,
			openid: '',
			unionid: '',
			userinfowx: '',
			idfd: 1,
			fxpid: 0,
			islogin: false,
			isdl: false,
			code: '',
			anonymousCode: '',
			gender: 0,
			nickName: '',
			btnDisbe: false,
			autoLogin: false,
			secret: 'b2EyMHF6ZDExMTExMTAwMA==',
			os: ''
		};
	},
	onLoad() {
		this.os = uni.getSystemInfoSync().uniPlatform;
		console.log("os:" + this.os);
	},
	methods: {
		// ========== Agreement checkbox ==========
		checkboxChange(e) {
			this.isReadChk = e.detail.value.length > 0;
		},

		// ========== One-click login (univerify) ==========
		openAutoLogin() {
			if (!this.isReadChk) {
				uni.showToast({
					title: '请先同意协议',
					icon: 'none'
				});
				return;
			}
			if (!this.autoLogin) {
				uni.showToast({ title: '请打开数据流量', icon: "none" });
				return;
			}
			let _self = this;
			uni.login({
				provider: 'univerify',
				univerifyStyle: {
					"icon": {
						"path": "static/logo/144-144.png",
						"width": "60px",
						"height": "60px"
					},
				},
				success(res) {
					console.log(res);
					uniCloud.callFunction({
						name: 'toolautologin',
						data: res.authResult
					}).then(res => {
						if (res.result.code === 0) {
							uniCloud.callFunction({
								name: 'applogreg',
								data: {
									mobile: res.result.phoneNumber,
									password: "aaaaaa"
								}
							}).then(res => {
								console.log(res.result);
								if (res.result.code === 200) {
									setToken(res.result.data.token);
									setUserInfo(res.result.data);
									uni.showToast({
										title: '登陆成功'
									});
									uni.closeAuthView();
									uni.switchTab({
										url: '/pages/index/me',
										success: () => {
											console.log('跳转成功');
										},
										fail: (err) => {
											console.log('跳转失败', err);
										}
									});
								} else {
									uni.showToast({
										title: res.result.message,
										icon: 'none'
									});
								}
								uni.hideLoading();
							}).catch(err => {
								console.error(err);
								uni.showToast({
									title: err.message,
									icon: 'none'
								});
								uni.hideLoading();
							});
						} else {
							uni.showToast({ title: '登录失败', icon: "none" });
						}
					}).catch(err => {
						console.log("获取错误：" + err);
					});
				},
				fail(res) {
					console.log(res);
					if (res.errCode == 30002) {
						uni.closeAuthView();
					} else {
						uni.showToast({ title: res.errMsg, icon: "none" });
					}
				}
			});
		},

		// ========== Navigation methods ==========
		toCommonLogin() {
			uni.navigateTo({
				url: '/pages/login/login2'
			});
		},
		navigateToRegister() {
			uni.navigateTo({
				url: '/pages/login/register'
			});
		},
		navigateToAgreement() {
			uni.navigateTo({
				url: '/pages/me/agreement'
			});
		},
		navTo(url) {
			uni.navigateTo({
				url: url,
				animationType: 'slide-in-bottom',
			});
		},

		// ========== WeChat login ==========
		getUserInfo() {
			let _this = this;
			uni.getUserInfo({
				provider: 'weixin',
				success: function(infoRes) {
					console.log(infoRes);
					let form = { code: _this.wxcode, userInfo: infoRes.userInfo };
					_this.request('/v1/login/weixin', form, 'POST').then(res => {
						console.log("login: ", res);
						_this.setData({
							mobile: infoRes.userInfo.mobile,
							avatarUrl: infoRes.userInfo.avatarUrl
						});
						setToken(res.data.token);
						setUserInfo(infoRes.userInfo);
						try {
							uni.setStorageSync('isCanUse', 1);
							uni.switchTab({
								url: '/pages/views/tabBar/home'
							});
						} catch (e) {
							console.log('缓存失败');
						}
					});
				},
				fail(res) {}
			});
		},

		// ========== Password login ==========
		onlogin() {
			if (!this.isReadChk) {
				uni.showToast({
					title: '请先同意用户协议',
					icon: 'none'
				});
				return;
			}
			if (!this.mobile) {
				uni.showToast({ title: '手机号不能为空', icon: "none" });
				return false;
			}
			const regex = /^1[3-9]\d{9}$/;
			if (!regex.test(this.mobile)) {
				uni.showToast({ title: '输入正确手机号', icon: "none" });
				return false;
			}
			if (!this.password) {
				uni.showToast({ title: '密码不能为空', icon: "none" });
				return false;
			}
			uni.showLoading({
				title: '登录中...'
			});
			uniCloud.callFunction({
				name: 'applogin',
				data: {
					mobile: this.mobile,
					password: this.password
				}
			}).then(res => {
				console.log(res.result);
				if (res.result.code === 200) {
					setToken(res.result.data.token);
					setUserInfo(res.result.data);
					uni.showToast({
						title: '登陆成功'
					});
					uni.switchTab({
						url: '/pages/index/me',
						success: () => {
							console.log('跳转成功');
						},
						fail: (err) => {
							console.log('跳转失败', err);
						}
					});
				} else {
					uni.showToast({
						title: res.result.message,
						icon: 'none'
					});
				}
				uni.hideLoading();
			}).catch(err => {
				console.error(err);
				uni.showToast({
					title: err.message,
					icon: 'none'
				});
				uni.hideLoading();
			});
		},

		// ========== SMS verification code ==========
		getCode() {
			if (this.isCode == false) {
				return;
			}
			if (this.tel == '') {
				uni.showToast({
					title: '请输入手机号',
					icon: 'none'
				});
				return;
			}
			if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.tel)) {
				uni.showToast({
					title: '请填写正确手机号码',
					icon: 'none'
				});
				return false;
			}
			this.getPhoneCode();
		},
		getPhoneCode() {
			let timer = '';
			let date = 120;
			let that = this;
			if (that.isCode == true) {
				uni.showToast({
					title: '验证码发送成功~',
					icon: 'none'
				});
				clearInterval(timer);
				setInterval(() => {
					if (date >= 1) {
						date--;
						that.codeName = date + '秒重试';
						that.isCode = false;
					} else {
						that.isCode = true;
						that.codeName = '验证码';
						clearInterval(timer);
					}
				}, 1000);
			}
		},

		// ========== WeChat helpers ==========
		wxlogin() {
			let _this = this;
			uni.login({
				provider: 'weixin',
				success: function(loginRes) {
					console.log('这是用户的code', loginRes);
					_this.setData({
						wxcode: loginRes.code
					});
				}
			});
		},
		onAuthorize() {
			uni.showToast({
				title: '对接你的公众号登录方法',
				icon: "none"
			});
		}
	}
};
