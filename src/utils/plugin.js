/**
 * 全局插件配置资源（vue插件部分）
 * @module utils/plugin
 */
import { Toast, Dialog, Notify, ImagePreview } from 'vant';
// Toast
import 'vant/es/toast/style';
// Dialog
import 'vant/es/dialog/style';
// Notify
import 'vant/es/notify/style';
// ImagePreview
import 'vant/es/image-preview/style';

import hasPermi from './directives/hasPermi';
import { clone, cloneDeep } from '@u/convert';
const plugins = [Toast, Dialog, Notify, ImagePreview];
/**模块store数据 */
import Com from '@s/com';
import Dict from '@s/dict';
import Guarder from '@s/guarder';
import User from '@s/user';

export default {
    install: function (App, options) {
        plugins.forEach((plugin) => {
            App.use(plugin);
        });
        /**
         * 全局指令
         */
        App.directive('hasPermi', hasPermi);
        /**
         * 原型链全局挂载方法
         */
        App.config.globalProperties.msgSuccess = function (msg) {
            ElMessage({ showClose: true, message: msg, type: 'success' });
        };

        App.config.globalProperties.msgError = function (msg) {
            ElMessage({ showClose: true, message: msg, type: 'error' });
        };

        App.config.globalProperties.msgInfo = function (msg) {
            ElMessage.info(msg);
        };

        App.config.globalProperties.resetForm = function (refName) {
            if (refName) {
                // 不是公用的my-form标签的ref逻辑
                refName?.resetFields?.() || refName?.$refs?.refMyForm?.resetFields?.();
            }
        };

        App.config.globalProperties.$store = {
            com: Com(),
            dict: Dict(),
            guarder: Guarder(),
            user: User(),
        };

        App.config.globalProperties.clone = clone;

        App.config.globalProperties.cloneDeep = cloneDeep;

        /**
         * vite动态加载图片静态文件
         * @param {string} path 文件路径
         * @param {string} suffix 文件类型（后缀）只能为svg、png、jpg，默认为svg
         * @returns
         */
        App.config.globalProperties.getImgUrl = (path, suffix = 'svg') => {
            if (suffix === 'svg') return import.meta.globEager('../assets/**/*.svg')[path].default;
            if (suffix === 'png') return import.meta.globEager('../assets/**/*.png')[path].default;
            if (suffix === 'jpg') return import.meta.globEager('../assets/**/*.jpg')[path].default;
        };

        App.config.globalProperties.$$confirm = function (data) {
            let options = {};
            if (typeof data === 'string') {
                options.item = data;
            } else {
                options = { ...data };
            }

            let { item = '是否确认导出所有数据项？', title = '提示', confirmButtonText = '确定', cancelButtonText = '取消', type = 'warning' } = options;
            return new Promise((resolve, reject) => {
                ElMessageBox.confirm(item, title, {
                    showCancelButton: false,
                    confirmButtonText,
                    cancelButtonText,
                    draggable: true,
                    type,
                })
                    .then((res) => {
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        };
    },
};
