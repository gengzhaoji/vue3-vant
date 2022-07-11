# Schema 配置说明

在 schemas 文件夹下新建 js 文件， 一个实体用一个文件表示。 可以再建文件夹细分。 文件格式如下：

```
module.exports = {
  name: '实体中文名称', // 生成代码注释用到
  model: {
    disabled: false, // 是否禁用该模型
    pathPrefix:'', // 请求地址前缀
    name:'', // 请求函数的名称后缀
    path: '/api/users', // 接口地址路径，必须
    title: '接口描述信息', // 生成代码注释用到
    methods: [], // 生成请求方法，默认全部
    options: {}, // ajax 配置参数选项，可选
  }
}

```

ajax 参数选项 [options](/static/utils/module-utils_axios.html)
