import Axios from 'axios'; // 此处引入axios官方文件
import { ElNotification } from 'element-plus'

// 返回结果处理
// 自定义约定接口返回{code: xxx, data: xxx, msg:'err message'}
const responseHandle = {
    200: response => {
        return response.data.data;
    },
    401: response => {
        ElNotification({
            title: '认证异常',
            message: '登录状态已过期，请重新登录！',
            type: 'error'
        });
        window.location.href = window.location.origin;
    },
    default: response => {
        ElNotification({
            title: '操作失败',
            message: response.data.msg,
            type: 'error'
        });
        return Promise.reject(response);
    }
};

const axios = Axios.create({
    baseURL: '/api', //VUE_BASEURL
    timeout: 50000
});

// 添加请求拦截器
axios.interceptors.request.use(
    function(config) {
        
        // 请求头用于接口token 认证
         (config.headers['X-Auth-Token'] = window.token);
        //!这块倒是有意思,直接传递一个参数,简化了好多
        if (config.method.toLocaleLowerCase() === 'post' || config.method.toLocaleLowerCase() === 'put') {
            // 参数统一处理，请求都使用data传参
            config.data = config.data;
        } else if (config.method.toLocaleLowerCase() === 'get' || config.method.toLocaleLowerCase() === 'delete') {
            // 参数统一处理
            config.params = config.data; //处理git请求
        } else {
            alert('不允许的请求方法：' + config.method);
        }
       
        return config;
    },
    function(error) {
        return Promise.reject(error);
    }
);

// 添加响应拦截器
axios.interceptors.response.use(
    response => {        
        // 响应正常时候就从pendingRequest对象中移除请求
        return responseHandle[response.status || 'default'](response);
    },
    error => {
        // 从pending 列表中移除请求
        
        return Promise.reject(error);
    }
);


export default axios;

