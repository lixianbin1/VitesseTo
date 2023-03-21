import axios from 'axios'
import qs from 'qs'

// 设置超时
axios.defaults.timeout = 5000
// 表示跨域请求时是否需要使用凭证
axios.defaults.withCredentials = false
// 允许跨域
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
axios.defaults.headers.post['Access-Control-Allow-Origin-Type'] = '*'

// 请求拦截器
axios.interceptors.request.use((config) => {
  // 数据格式化
  // if (config.method === 'post' || config.method === 'put' || config.method === 'delete')
  //   config.data = qs.parse(config.data)

  // 添加身份验证
  if(config.headers.Authorization === undefined) {
    config.headers.Authorization = localStorage.getItem('token')
  }
  return config
}, (error) => {
  console.log(error.data.error.message) // 也可以通过组件的message抛出
  return Promise.reject(error.data.error.message)
})

// 响应拦截器 : 已移动至App.vue
// axios.interceptors.response.use((config) => {
//   console.log(2222222222)
//   if (config.status === 200 || config.status === 204)
//     return Promise.resolve(config)
//   else
//     return Promise.reject(config)
// }, (error) => {
//   console.log(error)
//   if (error.response.status) {
//     switch (error.response.status) {
//       case 400:
//         ElMessage({
//           grouping:true,
//           message: `${error.response.status}：发出的请求有错误，服务器没有进行新建或修改数据的操作！`,
//           type: 'error',
//         })
//         break
//       case 401: // 未登录 重定向，跳转登录页面
//         if(error.response.data.crpHttpStatus==200){
//           ElMessage({
//             grouping:true,
//             message: `${error.response.data.returnDesc}！`,
//             type: 'error',
//           })
//         }else{
//           ElMessage({
//             grouping:true,
//             message: `${error.response.data}`,
//             type: 'error',
//           })
//         }
//         localStorage.removeItem('token');
//         location.href="/login"
//         break
//       case 403: // token过期，清除本地token和清空vuex中token对象，跳转登录页面
//         ElMessage({
//           grouping:true,
//           message: `${error.response.status}：用户得到授权，但是访问是被禁止的！`,
//           type: 'error',
//         })
//         break
//       case 404: // 资源不存在
//         ElMessage({
//           grouping:true,
//           message: `${error.response.status}：网络请求不存在！`,
//           type: 'error',
//         })
//         break
//       case 406:
//         ElMessage({
//           grouping:true,
//           message: `${error.response.status}：请求的格式不可得！`,
//           type: 'error',
//         })
//         break
//       case 410:
//         ElMessage({
//           grouping:true,
//           message: `${error.response.status}：请求的资源被永久删除，且不会再得到的！`,
//           type: 'error',
//         })
//         break
//       case 422:
//         ElMessage({
//           grouping:true,
//           message: `${error.response.status}：当创建一个对象时，发生一个验证错误！`,
//           type: 'error',
//         })
//         break
//       case 500:
//         ElMessage({
//           grouping:true,
//           message: `${error.response.status}：服务器发生错误，请检查服务器！`,
//           type: 'error',
//         })
//         localStorage.removeItem('token');
//         // location.reload()
//         break
//       case 502:
//         ElMessage({
//           grouping:true,
//           message: `${error.response.status}：网关错误！`,
//           type: 'error',
//         })
//         break
//       case 503:
//         ElMessage({
//           grouping:true,
//           message: `${error.response.status}：服务不可用，服务器暂时过载或维护！`,
//           type: 'error',
//         })
//         break
//       case 504:
//         ElMessage({
//           grouping:true,
//           message: `${error.response.status}：网关超时！`,
//           type: 'error',
//         })
//         break
//       default:
//         ElMessage({
//           grouping:true,
//           message: `${error.response.status}：其他错误错误！`,
//           type: 'error',
//         })
//     }
//   }else {
//     ElMessage({
//       grouping:true,
//       message: `${error.code}：网络错误，请稍后再试！`,
//       type: 'error',
//     })
//   }
//   return Promise.reject(error)
// })
// 封装的require请求
export const require = (option) => {
  return new Promise((fulfill, reject) => {
    axios(option).then((res) => {
      fulfill(res)
    }).catch((rej) => {
      console.log(rej)
      if (rej.response)
        reject(rej.response)

      else if (rej.require)
        reject(rej.require)

      else
        reject(rej.message)
    })
  })
}

export default require
