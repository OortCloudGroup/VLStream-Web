import request from '@/utils/request'

/**
 * 分页查询用户列表
 * @param {Object} params 查询参数，包含 current (当前页), size (每页大小), account (账号), realName (真实姓名) 等
 * @returns {Promise} 返回请求响应的 Promise 对象
 */
export function getUserList(params) {
  return request({ url: '/blade-system/user/list', method: 'get', params })
}

/**
 * 查询指定ID的用户详情
 * @param {Object} params 请求参数，必须包含 id
 * @returns {Promise} 返回详情的 Promise 对象
 */
export function getUserDetail(params) {
  return request({ url: '/blade-system/user/detail', method: 'get', params })
}

/**
 * 创建或更新用户 (统一提交接口)
 * @param {Object} data 用户实体数据，对应后端的 User 实体字段
 * @returns {Promise} 返回操作结果的 Promise 对象
 */
export function submitUser(data) {
  return request({ url: '/blade-system/user/submit', method: 'post', data })
}

/**
 * 更新用户数据
 * @param {Object} data 包含更新内容的用户实体，必须包含用户 ID
 * @returns {Promise} 返回操作结果的 Promise 对象
 */
export function updateUser(data) {
  return request({ url: '/blade-system/user/update', method: 'post', data })
}

/**
 * 批量或单个删除用户
 * @param {String} ids 逗号分隔的用户ID字符串
 * @returns {Promise} 返回操作结果的 Promise 对象
 */
export function removeUsers(ids) {
  return request({ url: '/blade-system/user/remove', method: 'post', params: { ids } })
}

/**
 * 给用户分配角色
 * @param {String} userIds 逗号分隔的用户ID字符串
 * @param {String} roleIds 逗号分隔的角色ID字符串
 * @returns {Promise} 返回操作结果的 Promise 对象
 */
export function grantUserRoles(userIds, roleIds) {
  return request({ url: '/blade-system/user/grant', method: 'post', params: { userIds, roleIds } })
}

/**
 * 重置指定用户的密码
 * @param {String} userIds 逗号分隔的用户ID字符串
 * @returns {Promise} 返回操作结果 of the Promise 对象
 */
export function resetUserPassword(userIds) {
  return request({ url: '/blade-system/user/reset-password', method: 'post', params: { userIds } })
}

/**
 * 解锁锁定的用户账号
 * @param {String} userIds 逗号分隔的用户ID字符串
 * @returns {Promise} 返回操作结果的 Promise 对象
 */
export function unlockUsers(userIds) {
  return request({ url: '/blade-system/user/unlock', method: 'post', params: { userIds } })
}
