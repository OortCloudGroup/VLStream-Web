import request from '@/utils/request'

/**
 * 获取所有菜单与按钮扁平列表 (前端可自行转换为树)
 * @param {Object} params 查询过滤参数
 * @returns {Promise} 返回请求响应的 Promise 对象
 */
export function getMenuList(params) {
  return request({ url: '/blade-system/menu/list', method: 'get', params })
}

/**
 * 仅获取菜单分类的列表 (不含按钮)
 * @param {Object} params 查询过滤参数
 * @returns {Promise} 返回请求响应的 Promise 对象
 */
export function getMenuOnlyList(params) {
  return request({ url: '/blade-system/menu/menu-list', method: 'get', params })
}

/**
 * 获取菜单树形结构数据
 * @param {Object} params 查询过滤参数
 * @returns {Promise} 返回请求响应的 Promise 对象
 */
export function getMenuTree(params) {
  return request({ url: '/blade-system/menu/tree', method: 'get', params })
}

/**
 * 获取给角色授权所用的完整权限树结构 (包含菜单树、数据权限树、接口权限树)
 * @param {Object} params 查询过滤参数
 * @returns {Promise} 返回权限授权树的 Promise 对象
 */
export function getGrantTree(params) {
  return request({ url: '/blade-system/menu/grant-tree', method: 'get', params })
}

/**
 * 获取指定角色当前拥有的已选中权限ID列表
 * @param {String} roleIds 逗号分隔的角色ID
 * @returns {Promise} 返回已选中的 key 列表
 */
export function getRoleTreeKeys(roleIds) {
  return request({ url: '/blade-system/menu/role-tree-keys', method: 'get', params: { roleIds } })
}

/**
 * 新增或更新菜单、按钮项
 * @param {Object} data 菜单实体数据
 * @returns {Promise} 返回操作结果的 Promise 对象
 */
export function submitMenu(data) {
  return request({ url: '/blade-system/menu/submit', method: 'post', data })
}

/**
 * 批量或单个删除菜单
 * @param {String} ids 逗号分隔的菜单ID字符串
 * @returns {Promise} 返回操作结果的 Promise 对象
 */
export function removeMenus(ids) {
  return request({ url: '/blade-system/menu/remove', method: 'post', params: { ids } })
}
