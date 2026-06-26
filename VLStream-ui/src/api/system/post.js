import request from '@/utils/request'

/**
 * 分页查询岗位列表
 * @param {Object} params 包含 current, size, postCode, postName 等参数
 * @returns {Promise} 返回岗位分页数据
 */
export function getPostList(params) {
  return request({ url: '/blade-system/post/list', method: 'get', params })
}

/**
 * 获取用于下拉框选择的岗位列表 (通常不分页)
 * @param {Object} params 查询参数，可包含 tenantId
 * @returns {Promise} 返回岗位选项数据
 */
export function getPostSelect(params) {
  return request({ url: '/blade-system/post/select', method: 'get', params })
}

/**
 * 新增或修改岗位数据
 * @param {Object} data 岗位实体对象
 * @returns {Promise} 返回请求响应的 Promise 对象
 */
export function submitPost(data) {
  return request({ url: '/blade-system/post/submit', method: 'post', data })
}

/**
 * 批量或单个删除岗位
 * @param {String} ids 逗号分隔的岗位ID
 * @returns {Promise} 返回请求响应的 Promise 对象
 */
export function removePosts(ids) {
  return request({ url: '/blade-system/post/remove', method: 'post', params: { ids } })
}
