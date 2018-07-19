import * as TYPES from './mutation-types'
import Utils from 'common/js/utils'

const mutations = {
  [TYPES.SET_TAB_MODE](state, tabMode) {
    state.tabMode = tabMode
  },
  [TYPES.SET_SIGNSTURE] (state, signature) {
    state.signature = signature
  },
  [TYPES.SET_LATELY_LIST](state, latelyList) {
    state.latelyList = latelyList
  },
  [TYPES.SET_CURRENT](state, current) {
    state.currentMsg = current
  },
  [TYPES.SET_UNREAD_COUNT](state, id) {
    state.latelyList = state.latelyList.map((item) => {
      if (item.sessionId === id) {
        item.unreadMsgCount = 0
      }
      return item
    })
  },
  [TYPES.SET_NEW_MSG](state, msg) {
    state.newMsg = msg
  },
  [TYPES.SET_CUSTOM_COUNT](state, type) {
    if (type === 'add') {
      state.customCount++
    } else if (type === 'clear') {
      state.customCount = 0
    }
  },
  [TYPES.ADD_LIST_COUNT](state, msg) {
    let hasArr = state.latelyList.filter((item) => {
      return item.sessionId === msg.fromAccount
    })
    if (hasArr.length) {
      if (state.currentMsg.nickName) {
        state.latelyList = state.latelyList.map((item) => {
          if (item.sessionId === msg.fromAccount) {
            item.unreadMsgCount = 0
          }
          return item
        })
      } else {
        state.latelyList = state.latelyList.map((item) => {
          if (item.sessionId === msg.fromAccount) {
            item.unreadMsgCount++
          }
          return item
        })
      }
    }
  },
  [TYPES.ADD_LIST_MSG](state, msg) {
    let hasIn = state.latelyList.filter((item) => {
      return item.sessionId === msg.fromAccount
    })
    let notIn = state.latelyList.filter((item) => {
      return item.sessionId !== msg.fromAccount
    })
    let inItem
    if (hasIn.length) {
      inItem = Object.assign({}, hasIn[0], {lastMsg: msg.text, msgTimeStamp: msg.msgTimeStamp, time: Utils.formatDate(msg.time).date})
    } else {
      let addMsg = {
        lastMsg: msg.text,
        msgTimeStamp: msg.msgTimeStamp ? msg.msgTimeStamp : msg.time,
        time: Utils.formatDate(msg.time).date,
        sessionId: msg.fromAccount,
        avatar: msg.avatar,
        nickName: msg.nickName ? msg.nickName : msg.fromAccountNick,
        unreadMsgCount: 1
      }
      inItem = Object.assign({}, addMsg)
    }
    state.latelyList = [inItem, ...notIn]
  },
  [TYPES.SET_IM_INFO](state, imInfo) {
    state.imInfo = imInfo
  },
  [TYPES.SET_NOW_CHAT](state, arr) {
    state.nowChat = arr
  },
  [TYPES.ADD_NOW_CHAT](state, msg) {
    let newMsg
    if (msg.type === 'chat') {
      newMsg = {
        from_account_id: msg.fromAccount,
        avatar: state.currentMsg.avatar,
        content: msg.text,
        time: msg.time,
        msgTimeStamp: msg.time,
        nickName: state.currentMsg.nickName,
        sessionId: msg.fromAccount,
        unreadMsgCount: 0,
        type: 1
      }
    } else {
      let data = JSON.parse(msg.data)
      newMsg = {
        from_account_id: msg.fromAccount,
        avatar: state.currentMsg.avatar,
        time: msg.time,
        url: data.url,
        title: data.title,
        msgTimeStamp: msg.time,
        nickName: state.currentMsg.nickName,
        sessionId: msg.fromAccount,
        unreadMsgCount: 0,
        type: 2
      }
    }
    state.nowChat = [...state.nowChat, newMsg]
  },
  [TYPES.SET_IM_ING](state, boolean) {
    state.imIng = boolean
  }
}

export default mutations
