import {tabMode} from 'common/js/constants'
import utils from 'common/js/utils'
const platform = utils.getPlatform()
const state = {
  tabMode: tabMode.show,
  signature: '',
  currentMsg: {}, // 当前聊天对象
  latelyList: [], // 最近联系人列表
  newMsg: {}, // 最新消息
  customCount: 0,
  imInfo: {},
  nowChat: [], // 当前会话
  platform, // 平台信息
  imIng: false
}

export default state
