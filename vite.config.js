import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
// html内容调整 插件
import { createHtmlPlugin } from 'vite-plugin-html';
// 压缩插件
import viteCompression from 'vite-plugin-compression';
// ui自动导入插件
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';
// setup name 增强
import VueSetupExtend from 'vite-plugin-vue-setup-extend';
// 自动导入composition api
import AutoImport from 'unplugin-auto-import/vite';
// vite首次打开界面加载慢问题/解决
import OptimizationPersist from 'vite-plugin-optimize-persist';
import PkgConfig from 'vite-plugin-package-config';

// https://vitejs.dev/config/
export default ({ command, mode }) => {
    // 环境变量
    const env = loadEnv(mode, process.cwd());
    // 生产环境判断
    const isEnvProduction = mode === 'production';
    // vite插件
    const plugins = [
        vue({
            script: {
                refSugar: true,
            },
        }),
        VueSetupExtend(),
        /**
         *  注入环境变量到html模板中
         *  如在  .env文件中有环境变量  VITE_APP_TITLE=admin
         *  则在 html模板中  可以这样获取  <%- VITE_APP_TITLE %>
         *  文档：  https://github.com/anncwb/vite-plugin-html
         */
        createHtmlPlugin({
            inject: {
                data: {
                    TITLE: 'MY-UI',
                    injectConfigScript: `<script src="/config.js?v=${new Date().getTime()}"></script>`,
                    ...env,
                },
            },
            minify: true,
        }),
        /**
         * ui按需加载(自动导入)自动导入Vite的按需组件
         */
        Components({
            resolvers: [VantResolver()],
            include: [/\.vue$/, /\.vue\?vue/],
            exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/],
        }),
        AutoImport({
            imports: ['vue', 'vue-router'], // 自动导入vue和vue-router相关函数
            dts: 'src/auto-import.d.js', // 生成 `auto-import.d.js` 全局声明
        }),
        PkgConfig(),
        OptimizationPersist(),
    ];
    if (isEnvProduction) {
        plugins.push(
            // gzip插件，打包压缩代码成gzip  文档： https://github.com/anncwb/vite-plugin-compression
            viteCompression()
        );
    }
    return defineConfig({
        // 基础路径，配合vue-router的createWebHashHistory使用
        base: isEnvProduction ? './' : '/',
        css: {
            // 消除vite2打包出现警告，"@charset" must be the first，
            preprocessorOptions: {
                scss: {
                    charset: false,
                },
            },
            // 消除vite2打包出现警告，"@charset" must be the first，
            postcss: {
                plugins: [
                    {
                        postcssPlugin: 'internal:charset-removal',
                        AtRule: {
                            charset: (atRule) => {
                                if (atRule.name === 'charset') {
                                    atRule.remove();
                                }
                            },
                        },
                    },
                ],
            },
        },
        plugins,
        server: {
            host: '0.0.0.0',
            port: 5000,
            open: true,
            proxy: {
                // 设置代理
                [env.VITE_APP_BASE_API]: {
                    target: env.VITE_APP_TARGET,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(env.VITE_APP_BASE_API, env.VITE_APP_TI),
                },
            },
        },
        // alias 现在会被传递给 @rollup/plugin-alias 并不再需要开始/结尾处的斜线了。
        // 此行为目前是一个直接替换，所以 1.0 风格的目录别名需要删除其结尾处的斜线：
        resolve: {
            alias: {
                // 如果报错__dirname找不到，需要安装node,执行yarn add @types/node --save-dev
                '@': resolve(__dirname, 'src'),
                '@a': resolve(__dirname, 'src/api'),
                '@c': resolve(__dirname, 'src/components'),
                '@s': resolve(__dirname, 'src/store'),
                '@u': resolve(__dirname, 'src/utils'),
            },
        },
        // 打包环境
        build: {
            outDir: 'dist',
            assetsInlineLimit: 1024,
            cssCodeSplit: true,
            chunkSizeWarningLimit: 1000,
            brotliSize: false, //关闭打包计算
            // Terser 相对较慢，但大多数情况下构建后的文件体积更小。ESbuild 最小化混淆更快但构建后的文件相对更大。
            minify: isEnvProduction ? 'terser' : 'esbuild',
            // 打包生产环境移除 console 和 debugger
            terserOptions: {
                compress: {
                    drop_console: true,
                    drop_debugger: true,
                },
            },
            rollupOptions: {
                output: {
                    chunkFileNames: 'js/[name]-[hash].js',
                    entryFileNames: 'js/[name]-[hash].js',
                },
            },
        },
    });
};
