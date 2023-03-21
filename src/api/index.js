import qs from 'qs'
import require from './require'
import { auto, network } from './geteway'

export const getDemo = function (params) { // Get接口请求示例
  return require({
    url: `${network}/${auto}/user/login`,
    method: 'get',
    params,
  })
}
// 用户的相关接口
export const userlogin = function (data) { // 登录接口
  return require({
    url: `${network}/${auto}/user/login`,
    method: 'post',
    data,
  })
}
export const upPassword = function (data) { // 修改密码
  return require({
    url: `${network}/${auto}/user/update-password`,
    method: 'post',
    data,
  })
}
export const outLogin = function (params) { // 退出登录
  return require({
    url: `${network}/${auto}/user/logout`,
    method: 'get',
    params,
  })
}
export const userInfo = function (params) { // 用户信息
  return require({
    url: `${network}/${auto}/user/get-user`,
    method: 'get',
    params,
  })
}

// Data Submission 数据提交服务
export const dataUpload = function (data) { // 上传文件，数据提交上传
  return require({
    url: `${network}/${auto}/data-submission/upload`,
    headers: { 'Content-Type': 'multipart/form-data;charset=UTF-8' },
    method: 'post',
    data,
  })
}
// export const listUpload = function (data) { // 数据提交请求历史记录
//   return require({
//     url: `${network}/${auto}/data-submission/list-upload`,
//     method: 'post',
//     data,
//   })
// }
export const dataSubmissionListUpload = function (data) { // 数据上传历史查询接口  /api/data-submission/list-upload
  return require({
    url: `${network}/${auto}/data-submission/list-upload`,
    method: 'post',
    data,
  })
}
// Data Correction 数据更正服务
export const CorrectionList = function (data) { // 上传文件，数据提交上传
  return require({
    url: `${network}/${auto}/data-correction/list`,
    method: 'post',
    data,
  })
}

// 通知模块
export const notificationDetailIncoming = function (data) { // 查询即将到期 通知详情  /api/notification/business/details-incoming
  return require({
    url: `${network}/${auto}/notification/business/details-incoming`,
    method: 'post',
    data,
  })
}
export const notificationDetailsUpload = function (data) { // 上传商家通知详情  /api/notification/business/details-upload
  return require({
    url: `${network}/${auto}/notification/business/details-upload`,
    method: 'post',
    data,
  })
}
export const notificationListIncoming = function (data) { // 查询传入业务通知列表  /api/notification/business/list-incoming
  return require({
    url: `${network}/${auto}/notification/business/list-incoming`,
    method: 'post',
    data,
  })
}
export const notificationListUpload = function (data) { // 上传业务通知列表 /api/notification/business/list-upload
  return require({
    url: `${network}/${auto}/notification/business/list-upload`,
    method: 'post',
    data,
  })
}
export const notificationUpload = function (data) { // 请求业务通知  /api/notification/business/upload
  return require({
    url: `${network}/${auto}/notification/business/upload`,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
export const notificationDetails = function (data) { // 到期通知详细信息 /api/notification/expiry/details
  return require({
    url: `${network}/${auto}/notification/expiry/details`,
    method: 'post',
    data,
  })
}
export const notificationListAll = function (data) { // 到期通知全部列表
  return require({
    url: `${network}/${auto}/notification/expiry/list-all`,
    method: 'post',
    data,
  })
}
export const notificationMarkCompleted = function (data) { //  到期通知详细信息  /api/notification/expiry/mark-completed
  return require({
    url: `${network}/${auto}/notification/expiry/mark-completed`,
    method: 'post',
    data,
  })
}
export const notificationEnquiry = function (data) { // 历史留言查询  /api/notification/message/enquiry
  return require({
    url: `${network}/${auto}/notification/message/enquiry`,
    method: 'post',
    data,
  })
}
export const notificationResend = function (data) { // 历史消息重新发送 /api/notification/message/resend
  return require({
    url: `${network}/${auto}/notification/message/resend`,
    method: 'post',
    data,
  })
}

// 数据提交接口开始
export const participantCRA_status = function (data) { // 信贷资料服务机构(CRA)查询 /api/participant/cra-status
  return require({
    url: `${network}/${auto}/participant/cra-status`,
    method: 'post',
    data,
  })
}
