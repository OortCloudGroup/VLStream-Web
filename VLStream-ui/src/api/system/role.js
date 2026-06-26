import request from '@/utils/request'

/**
 * 分页或条件查询角色列表
 * @param {Object} params 查询参数，包含 roleName (角色名称), roleAlias (角色别名), tenantId (租户ID) 等
 * @returns {Promise} 返回请求响应的 Promise 对象
 */
export function getRoleList(params) {
  return request({ url: '/blade-system/role/list', method: 'get', params })
}

/**
 * 查询角色树形结构
 * @param {Object} params 查询参数，可包含 tenantId
 * @returns {Promise} 返回请求响应的 Promise 对象
 */
export function getRoleTree(params) {
  return request({ url: '/blade-system/role/tree', method: 'get', params })
}

/**
 * 获取指定角色下的角色树
 * @param {String|Number} roleId 角色ID
 * @returns {Promise} 返回请求响应的 Promise 对象
 */
export function getRoleTreeById(roleId) {
  return request({ url: '/blade-system/role/tree-by-id', method: 'get', params: { roleId } })
}

/**
 * 创建或修改角色数据
 * @param {Object} data 角色实体数据
 * @returns {Promise} 返回操作结果的 Promise 对象
 */
export function submitRole(data) {
  return request({ url: '/blade-system/role/submit', method: 'post', data })
}

/**
 * 批量或单个删除角色
 * @param {String} ids 逗号分隔的角色ID字符串
 * @returns {Promise} 返回操作结果的 Promise 对象
 */
export function removeRoles(ids) {
  return request({ url: '/blade-system/role/remove', method: 'post', params: { ids } })
}

/**
 * 给角色分配权限 (支持菜单权限、数据权限、接口权限)
 * @param {Object} data 授权请求体，通常包含 roleIds, menuIds, dataScopeIds, apiScopeIds 等字段
 * @returns {Promise} 返回操作结果的 Promise 对象
 */
export function grantRole(data) {
  return request({ url: '/blade-system/role/grant', method: 'post', data })
}
