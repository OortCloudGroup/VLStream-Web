import request from '@/utils/request'

/**
 * 分页查询接口权限范围列表
 * @param {Object} params 包含 current, size, scopeName, resourceCode 等参数
 * @returns {Promise} 返回接口权限分页列表
 */
export function getApiScopeList(params) {
  return request({ url: '/blade-system/api-scope/list', method: 'get', params })
}

/**
 * 获取指定接口权限的详细信息
 * @param {Object} params 过滤参数，需包含 id
 * @returns {Promise} 返回接口权限详情的 Promise 对象
 */
export function getApiScopeDetail(params) {
  return request({ url: '/blade-system/api-scope/detail', method: 'get', params })
}

/**
 * 创建或更新接口权限配置
 * @param {Object} data 接口权限配置对象
 * @returns {Promise} 返回操作结果的 Promise 对象
 */
export function submitApiScope(data) {
  return request({ url: '/blade-system/api-scope/submit', method: 'post', data })
}

/**
 * 批量或单个删除接口权限配置
 * @param {String} ids 逗号分隔的接口权限ID
 * @returns {Promise} 返回操作结果的 Promise 对象
 */
export function removeApiScopes(ids) {
  return request({ url: '/blade-system/api-scope/remove', method: 'post', params: { ids } })
}
