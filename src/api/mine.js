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
   * 读取员工二维码
   * @param data
   * @returns {*}
   */
  getEmployeeCode (data) {
    let url = 'api/employee/employee-qrcode'
    return request.get(url, data)
  }
}
