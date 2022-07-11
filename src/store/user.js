import { defineStore } from 'pinia';
// import { authLogin, authLogout, infoUserProfile } from '@a/public';
import router from '@/router';
import guarder from './guarder';

export default defineStore({
    id: 'user', // id必填，且需要唯一
    state: () => ({
        userInfo: {},
        token: '',
        avatar: '',
        permissions: [],
        roles: [],
    }),
    actions: {
        // 登录
        Login(data) {
            return new Promise((resolve, reject) => {
                authLogin(data)
                    .then((res) => {
                        this.token = res?.data?.tk;
                        resolve();
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },
        // 获取用户信息
        GetInfo() {
            return new Promise((resolve, reject) => {
                infoUserProfile()
                    .then((res) => {
                        const { user, roles: Roles, perms } = res?.data;
                        if (Roles.length) {
                            // 验证返回的roles是否是一个非空数组
                            this.roles = Roles;
                            // 按钮级权限数组
                            this.permissions = perms;
                        } else {
                            this.roles = ['ROLE_DEFAULT'];
                        }
                        this.userInfo = { userId: user.id, userName: user.userName, nickName: user.nickName, deptId: user.deptId };
                        this.avatar = user.avatar;
                        this.remark = user.remark;
                        resolve(res);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },
        // 退出系统
        LogOut() {
            return new Promise((resolve, reject) => {
                authLogout()
                    .then(() => {
                        this.LogOutSET();
                        resolve();
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },
        LogOutSET() {
            // 退出登录removeRoute删除动态添加的路由
            guarder().addRouter.forEach((item) => {
                router.removeRoute(item.name);
            });
            guarder().addRouter = [];
            this.token = '';
            this.roles = [];
            this.permissions = [];
        },
    },
    // 开启数据缓存
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'user',
                storage: localStorage,
                paths: ['token'],
            },
        ],
    },
});
