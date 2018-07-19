const env = process.env

const LOCAL_URL = {
  api: 'http://zantui-api.com'
}

const DEV_URL = {
  api: 'https://ws-api.jerryf.cn'
}

const TEST_URL = {
  api: 'https://ws-api.jkweixin.net'
}

const PROD_URL = {
  api: 'https://ws-api.jkweixin.com'
}

export const BASE_URL = env.NODE_ENV === 'production' ? PROD_URL : env.NODE_ENV === 'test' ? TEST_URL : env.NODE_ENV === 'dev' ? DEV_URL : LOCAL_URL

export const ERR_OK = 0
