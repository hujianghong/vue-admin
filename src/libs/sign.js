import store from '@/store'

/**
 * 生成随机字符串
 * @param {*} len 字符串长度
 */
export function randomString(len) {
  len = len || 32
  let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  let maxPos = chars.length
  let str = ''
  for (let i = 0; i < len; i++) {
    str += chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return str
}

/**
 * 按Acsii方式排序一个键值对
 * @param {*} params
 */
export function sortByAcsii(params){
  let data = new Array()

  for(let i in params){
    data.push(i);
  }

  data.sort()

  let result = {}
  for(let i in data){
    result[data[i]] = params[data[i]]
  }

  return result
}

/**
 * 生成QueryString字符串
 * @param {*} params 键值对
 */
export function httpBuildQuery(params){
  let query = ''
  for(let i in params){
    let value = params[i]

    if(typeof value == 'object'){
      if(null == value) return;
      value = JSON.stringify(value);
      if('{}' == value) return;
      if('{}' == value) return;
    }
    if('' != query) query += '&';
    query += i + '=' + encodeURIComponent(value)
  }

  return query
};

/**
 *
 * @param {*} params
 * @param {*} nonce_str
 * @param {*} device
 * @param {*} token
 */
export function sign(params, nonce_str){
  const md5 = require('js-md5');

  params['nonce_str'] = nonce_str
  params = sortByAcsii(params)

  let query = httpBuildQuery(params)
  query = query.replace(/\*/g, "%2A").replace(/\'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\!/g, "%21");
  let keys = 'f05903338f05b21d7bc35dedea5520d2'
  let token = store.state.user.token?store.state.user.token:''

  let db_token = ''
  let sign = ''

  db_token = md5(token + '' + keys).toUpperCase()
  sign = md5(query + db_token).toUpperCase()

  return sign;
}

/**
 * 生成需要提交的请求参数
 * @param {*} data
 * @param {*} device
 * @param {*} token
 */
export function buildParams(data){
  let nonce_str = randomString(6)
  let sign_str = sign(data, nonce_str)
  data['sign'] = sign_str
  return data
}
