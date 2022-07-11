module.exports = {
    name: '系统管理模块',
    model: [
        {
            title: '菜单管理',
            name: 'menu',
            methods: ['add', 'edit', 'remove', 'list', 'info'],
            path: '/system/menu',
        },
    ],
};
