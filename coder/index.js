/**
 * 代码生成器
 * @author 耿朝继
 */
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const beautify = require('js-beautify').js_beautify;
const { pathToRegexp } = require('path-to-regexp');
const config = require('./config');

const templatePath = path.join(__dirname, config.templatesDir);
const apiRender = getRender('api.js');

/**
 * 读取模板渲染函数
 * @param file
 */
function getRender(file) {
    return require(path.join(templatePath, file));
}

/**
 * 转换成规范的js命名，如：sys_log.js 转换成 sysLog
 * @param name
 */
function toSchemaName(name) {
    return _.camelCase(name.replace('.js', ''));
}

/**
 * 获取架构配置文件列表
 * @param root 从那个路径开始查找
 * @param parent 当前的目录名称，可选
 * @returns {Array}
 */
function getSchemaFiles(root, parent) {
    let fileList = [];
    let files = fs.readdirSync(root);
    _.each(files, function (file) {
        let filePath = path.join(root, file);
        let stat = fs.lstatSync(filePath);
        if (stat.isDirectory()) {
            fileList = fileList.concat(getSchemaFiles(filePath, file));
        } else {
            if (file.indexOf('.js') > 0) {
                fileList.push({
                    name: toSchemaName(parent ? [parent, file].join('_') : file),
                    path: filePath,
                });
            }
        }
    });
    return fileList;
}

/**
 * 根据配置文件生成配置JSON
 * @param files
 * @returns {{}}
 */
function getSchemaInfo(files) {
    let models = {};
    _.each(files, function (file) {
        models[file.name] = require(file.path);
    });
    return models;
}

/**
 * 创建文件
 * @param path
 * @param fileName
 * @param content
 */
function writeFile(path, fileName, content) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
    fs.writeFileSync(path + toKebabCase(fileName) + '.js', content, { encoding: 'utf8' });
}

function toUpperCase(name) {
    return name.toUpperCase();
}

/**
 * Foo Bar | --foo-bar | __foo_bar__ => fooBar
 * @param name
 */
function toCamelCase(name) {
    return _.camelCase(name);
}

/**
 * Foo Bar | fooBar | --foo-bar => foo_bar
 * @param name
 */
function toSnakeCase(name) {
    return _.snakeCase(name);
}

/**
 * fooBar => foo-bar
 * @param name
 */
function toKebabCase(name) {
    return _.kebabCase(name);
}

function toUpperSnakeCaseName(name) {
    return toUpperCase(toSnakeCase(name));
}

/**
 * 格式化js代码
 * @param content
 * @returns {*}
 */
function beautifyJs(content) {
    content = content
        .replace(/(\r\n|\n)\s*/g, '\n')
        .replace(/\(\n/g, '(')
        .replace(/,\n/g, ',')
        .replace(/\/\*\*/g, '\n/**')
        .replace(/\n\/\//g, '\n\n//');

    return beautify(content, {
        indent_with_tabs: true,
        indent_size: 2,
        jslint_happy: false,
        end_with_newline: false,
        space_after_anon_function: true,
    });
}

/**
 * JSON转换成字符串，并把双引号转换成单引号
 * @param json
 */
function stringify(json) {
    let str = JSON.stringify(json);
    return str ? str.replace(/'/g, "\\'").replace(/"/g, "'") : '';
}

/**
 * 解析models
 * @param schemas
 * @returns {{}}
 */
function parseSchemas(schemas) {
    let result = {};
    _.each(schemas, function (schema, name) {
        result[name] = parseModel(schema.model, name);
    });
    return result;
}

function getTitle(name, item, info) {
    let methodComment = config.methodCommentMap[item.methodType] || item.title || '<%=cname%> ' + (item.upperSnakeCaseName || '');
    return _.template(methodComment)({ cname: item.title || info[name].name || name });
}

/**
 * 解析单个model
 * @param model
 * @param name
 * @returns {Array}
 */
function parseModel(model, name) {
    let result = [];
    if (_.isArray(model)) {
        _.each(model, function (item) {
            if (item.disabled !== true && item.path) {
                result = result.concat(parseModel(item, name));
            }
        });
    } else {
        if (model.disabled !== true && model.path) {
            // 生成请求方法，默认全部，如需要自定义
            let methods = model.methods || config.methods;

            // 转化为数组
            if (typeof methods === 'string') {
                methods = methods.split(',');
            }

            _.each(methods, function (method) {
                // ajax请求类型
                let httpMethod = config.methodTypeMap[method] || 'get';

                // axios options
                let options = _.extend({}, { method: httpMethod }, model.options || {});

                result.push({
                    path: model.path,
                    prefix: model.prefix || config.pathPrefix,
                    suffix: config.methodSuffixMap[method] || '',
                    options: options,
                    methodType: method,
                    httpMethod: httpMethod,
                    upperSnakeCaseName: toUpperSnakeCaseName(method + '_' + (model.name ?? '')),
                    camelCaseName: toCamelCase(method + '_' + (model.name ?? '')),
                    title: model.title,
                });
            });
        }
    }
    return result;
}

/**
 * 生成api文件
 */
function writeApi(json, info) {
    _.each(json, function (model, name) {
        let items = [],
            configKeys = [];
        _.each(model, function (item) {
            if (item.prefix) {
                configKeys.push(item.prefix);
            }
            // 是否已经写了后缀
            let url = `/${item.path.split('/').at(-1)}` == item.suffix ? item.path : item.path + item.suffix;
            let keys = [];
            pathToRegexp(url, keys);

            // 去重，在数组中已存在的URL不加进去
            if (!items.some((n) => n.URL === item.upperSnakeCaseName)) {
                items.push({
                    URL: item.upperSnakeCaseName,
                    url,
                    prefix: item.prefix,
                    params: keys.map((n) => n.name),
                    camelCaseName: item.camelCaseName,
                    options: item.options,
                    ajaxParam: 'data',
                    title: getTitle(name, item, info),
                });
            }
        });
        // 去重
        configKeys = _.uniq(configKeys);
        const outPath = path.join(__dirname, config.outApiPath);
        writeFile(
            outPath,
            name,
            beautifyJs(
                apiRender({
                    cname: info[name].name,
                    name: name,
                    configKeys: configKeys,
                    items: items,
                })
            )
        );
    });
}

const schemaFiles = getSchemaFiles(path.join(__dirname, config.schemasDir));
const schemaInfo = getSchemaInfo(schemaFiles);
const schemaJSON = parseSchemas(schemaInfo);

function build(dir) {
    console.log('开始生成代码.....');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    setTimeout(() => {
        // npm run coder
        writeApi(schemaJSON, schemaInfo);
        console.log('代码生成完成！');
    }, 100);
}

build(path.join(__dirname, '../src/api/'));
