import { defineStore } from 'pinia';
/**
 * actions方法名为 state字段前拼接GET
 */
// import { getDept } from '@a/public';

export default defineStore({
    id: 'com',
    state: () => ({
        deptTree: [],
    }),
    actions: {
        // 获取部门树
        GETdeptTree(deptId) {
            return new Promise((resolve, reject) => {
                if (this.deptTree.length > 0) {
                    resolve(this.deptTree);
                } else {
                    getDept({ deptId })
                        .then((res) => {
                            this.deptTree = treeDchildren(res.data);
                            resolve(this.deptTree);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                }
            });
        },
    },
});
