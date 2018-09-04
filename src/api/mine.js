import request from '../common/js/request'

export default {
  /**
   * 更新个人微信二维码
   * @param data
   * @returns {*}
   */
  upLoadPerson (data) {
    let url = 'api/employee/update-personal-qrcode'
    return request.post(url, data)
  },
  /**
   * 更新机器人微信二维码
   * @param data
   * @returns {*}
   */
  upLoadRobot (data) {
    let url = 'api/employee/update-robot-qrcode'
    return request.post(url, data)
  },
  /**
   * 读取员工二维码
   * @param data
   * @returns {*}
   */
  getEmployeeCode (data) {
    let url = 'api/employee/employee-qrcode'
    return request.get(url, data)
  },
  /**
   * 开始模拟登录，生成模拟登录的微信二维码
   * @param data
   * @returns {*}
   */
  getWechatLogin (data) {
    let url = 'api/employee/start-mock-login'
    return request.get(url, data)
  },
  /**
   * 获取模拟登录的微信二维码
   * @param data
   * @returns {*}
   */
  getWechatLoginCode (data) {
    let url = 'api/employee/wx-mock-image'
    return request.get(url, data)
  }
}
