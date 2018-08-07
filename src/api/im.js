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
  getRadarList(from = 0, limit = 30, id, loading = true) {
    const url = `/api/employee/ws-action-logs`
    const data = {
      page: 0,
      limit,
      from,
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
  },

  // 最近联系人列表
  getContactList(data, loading = true) {
    const url = `/api/employee/ws-customers-recent-contacts`
    return request.post(url, data, loading)
  },

  // 推荐商品
  getGoodsList(data, loading = true) {
    const url = `/api/employee/goods`
    return request.get(url, data, loading)
  },

  // 推荐活动
  getActivityList(data, loading = true) {
    const url = `/api/employee/presell-activity`
    return request.get(url, data, loading)
  }
}
