import request from 'common/js/request'

export default {
  // im获取签名，应用信息
  getImInfo(imAccount, loading = true) {
    const url = `/api/employee/employee-im-signature`
    const data = {
      im_account: imAccount
    }
    return request.post(url, data, loading)
  },

  // 雷达消息（所有人）
  getRadarList(page = 1, limit = 30, id, loading = true) {
    const url = `/api/employee/ws-action-logs`
    const data = {
      page,
      limit,
      customer_id: 0,
      employee_id: id
    }
    return request.post(url, data, loading)
  },

  // 聊天记录
  getMsgList(data, loading = true) {
    const url = `/api/employee/ws-message-logs`
    return request.post(url, data, loading)
  },

  // 最近联系人最后一条聊天记录
  getLastMsgObj(data, loading = true) {
    const url = `/api/employee/ws-customers-newest-message`
    return request.post(url, data, loading)
  }
}
