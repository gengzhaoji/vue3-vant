/**
 * 文件下载模块
 * @module $ui/utils/download
 */

/**
 * 文件类型枚举 文件后缀名 -> base64 data:前缀
 * @readonly
 * @enum {string}
 */
export const TYPE_MAP = {
    /**
     * data:image/jpg;base64,
     */
    jpg: 'data:image/jpg;base64,',

    /**
     * data:image/png;base64,
     */
    png: 'data:image/png;base64,',
    /**
     * data:text/csv;charset=utf-8,
     */
    csv: 'data:text/csv;charset=utf-8,',
};

/**
 * 将字符串转换成Blob数据
 * @param str 字符串
 * @example
 *  let json = {name: '张三'};
 *  downloadByData(null, 'name.json', stringToBlob(JSON.stringify(json)))
 */
export function stringToBlob(str) {
    return URL.createObjectURL(new Blob([str], { type: 'application/octet-stream' }));
}

/**
 * base64数据转文件下载
 * @param type 文件类型
 * @param [saveName] 保存文件名
 * @param data  base64 数据
 */
export function downloadByData(type, saveName, data) {
    const link = document.createElement('a');
    link.download = saveName;
    link.href = type === null ? data : (TYPE_MAP[type] || '') + data;
    link.click();
}

/**
 * 下载文件
 * @param src 文件资源src
 * @param {string} [outName] 下载保存文件名称，可选
 */
export function download(src, outName) {
    const link = document.createElement('a');
    link.download = outName;
    link.href = src;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * 下载二进制文件
 * @param {Blob} blob 文件流
 * @param {string} [outName] 下载保存文件名称，可选
 */
export function downloadBlob(blob, outName) {
    const reader = new FileReader();
    reader.onload = (e) => {
        download(e.target.result, outName);
    };
    reader.readAsDataURL(blob);
}

/**
 * post数据方式下载文件
 * @param {string} url 接口地址url
 * @param {object} [params] 发送的数据params
 * @param {string} [method=post] 请求方法：post / get
 */
export function downloadByPost(url, params = {}, method = 'post') {
    const form = document.createElement('form');
    form.style.display = 'none';
    form.action = url;
    form.method = method;
    form.target = '_blank';
    Object.keys(params).forEach((name) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = params[name];
        form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}

/**
 *base64文件转文件流
 */
export function base64ToFile(data, fileName = 'file') {
    let arr = data.split(',');
    let mime = arr[0].match(/:(.*?);/)[1];
    let suffix = mime.split('/')[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    // return new Blob([u8arr], `${fileName}.${suffix}`, { type: mime })();
    return (
        new File(u8arr),
        `${fileName}.${suffix}`,
        {
            type: mime,
        }
    );
}

/**
 * 判断base64的文件类型
 */
export function base64FileType(data) {
    let fileHeader = new Map();
    //获取不同文件的文件头前3个字作为判断依据
    fileHeader.set('/9j', 'jpg');
    fileHeader.set('iVB', 'png');
    fileHeader.set('Qk0', 'mbp');
    fileHeader.set('SUk', 'tiff');
    fileHeader.set('JVB', 'pdf');
    fileHeader.set('UEs', 'ofd');
    let res = '';
    //遍历map中所提及的文件头特征
    fileHeader.forEach((v, k) => {
        if (k == data.substr(0, 3)) {
            res = v;
        }
    });
    //如果不在map中返回unknown file
    if (res == '') {
        res = 'unknown file';
    }
    //否则返回map中的value值
    return res;
}
