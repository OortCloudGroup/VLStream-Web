<template>
  <div class="secure-events-container">
    <!-- 左侧筛选面板 -->
    <div class="left-filter-panel">
      <h3 class="panel-title">事件筛选</h3>
      <el-tabs v-model="activeFilterTab" class="filter-tabs" @tab-change="handleFilterTabChange">
        <!-- 区域 Tab -->
        <el-tab-pane label="区域" name="regions">
          <el-tree
            :data="filterTreeData.regions"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            @node-click="handleRegionClick"
            highlight-current
            class="filter-tree"
          />
        </el-tab-pane>
        
        <!-- 分组 Tab -->
        <el-tab-pane label="分组" name="groups">
          <div class="list-filter-container">
            <div 
              v-for="group in filterTreeData.groups" 
              :key="group.id" 
              class="list-filter-item"
              :class="{ active: selectedGroupId === group.id }"
              @click="handleGroupClick(group.id)"
            >
              <el-icon><User /></el-icon>
              <span>{{ group.label }}</span>
            </div>
            <div v-if="selectedGroupId" class="clear-filter" @click="clearGroupFilter">
              清除选择
            </div>
          </div>
        </el-tab-pane>
        
        <!-- 标签 Tab -->
        <el-tab-pane label="标签" name="tags">
          <div class="list-filter-container">
            <div 
              v-for="tag in filterTreeData.tags" 
              :key="tag.id" 
              class="list-filter-item"
              :class="{ active: selectedTagName === tag.label }"
              @click="handleTagClick(tag.label)"
            >
              <el-icon><PriceTag /></el-icon>
              <span>{{ tag.label }}</span>
            </div>
            <div v-if="selectedTagName" class="clear-filter" @click="clearTagFilter">
              清除选择
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 右侧内容区域 -->
    <div class="right-content-panel">
      <!-- 过滤操作栏 -->
      <div class="toolbar">
        <div class="left-actions">
          <el-button 
            type="danger" 
            :disabled="selectedRows.length === 0" 
            @click="handleBatchDelete"
          >
            <el-icon><Delete /></el-icon> 批量删除
          </el-button>
        </div>
        <div class="right-actions">
          <el-radio-group v-model="statusFilter" @change="handleStatusFilterChange">
            <el-radio-button label="全部" />
            <el-radio-button label="正在处理" />
            <el-radio-button label="已完成" />
          </el-radio-group>
        </div>
      </div>

      <!-- 表格区域 -->
      <div class="table-container">
        <el-table
          :data="pagedEvents"
          border
          stripe
          v-loading="loading"
          @selection-change="handleSelectionChange"
          style="width: 100%"
          class="events-table"
        >
          <el-table-column type="selection" width="55" align="center" />
          
          <!-- 序号 -->
          <el-table-column label="序号" type="index" width="60" align="center">
            <template #default="scope">
              {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
            </template>
          </el-table-column>

          <!-- 事件时间 -->
          <el-table-column prop="time" label="事件时间" width="160" align="center" />

          <!-- 状态 -->
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template #default="scope">
              <el-tag :type="scope.row.status === '已完成' ? 'success' : 'warning'">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>

          <!-- 事件位置 -->
          <el-table-column prop="location" label="事件位置" min-width="180" show-overflow-tooltip />

          <!-- 事件类型 -->
          <el-table-column prop="type" label="事件类型" width="120" align="center" />

          <!-- 抓拍照片 -->
          <el-table-column label="抓拍照片" width="100" align="center">
            <template #default="scope">
              <el-image
                v-if="scope.row.image"
                :src="scope.row.image"
                :preview-src-list="[scope.row.image]"
                preview-teleported
                fit="cover"
                class="event-thumbnail"
                @click.stop
              />
              <span v-else class="text-placeholder">-</span>
            </template>
          </el-table-column>

          <!-- 录制视频 -->
          <el-table-column label="录制视频" width="100" align="center">
            <template #default="scope">
              <el-button
                v-if="scope.row.video"
                type="primary"
                link
                @click="playVideo(scope.row)"
              >
                <el-icon class="video-btn-icon"><VideoPlay /></el-icon> 播放
              </el-button>
              <span v-else class="text-placeholder">-</span>
            </template>
          </el-table-column>

          <!-- 设备名称 -->
          <el-table-column prop="deviceName" label="设备名称" width="140" show-overflow-tooltip />

          <!-- 设备编号 -->
          <el-table-column prop="deviceSn" label="设备编号" width="140" align="center" />

          <!-- 事件描述 -->
          <el-table-column prop="description" label="事件描述" min-width="180" show-overflow-tooltip />

          <!-- 标签 -->
          <el-table-column prop="tag" label="标签" width="120" align="center">
            <template #default="scope">
              <el-tag type="info" size="small">{{ scope.row.tag }}</el-tag>
            </template>
          </el-table-column>

          <!-- 完成时间 -->
          <el-table-column prop="finishTime" label="完成时间" width="160" align="center">
            <template #default="scope">
              {{ scope.row.finishTime || '-' }}
            </template>
          </el-table-column>

          <!-- 操作 -->
          <el-table-column label="操作" width="120" align="center" fixed="right">
            <template #default="scope">
              <el-button type="primary" link @click="showDetails(scope.row)">详情</el-button>
              <el-button type="danger" link @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页区域 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 20]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredEvents.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 视频播放弹窗 -->
    <el-dialog
      v-model="videoDialogVisible"
      title="录制视频播放"
      width="600px"
      destroy-on-close
      @close="handleVideoDialogClose"
    >
      <div class="mock-video-player">
        <video 
          ref="videoPlayer" 
          controls 
          autoplay 
          style="width: 100%; border-radius: 4px; background: #000;"
        >
          <source :src="activeVideoUrl" type="video/mp4">
          您的浏览器不支持 HTML5 video 标签。
        </video>
      </div>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="detailsDialogVisible"
      title="事件详细信息"
      width="650px"
    >
      <div v-if="activeEvent" class="event-details-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="事件编号">{{ activeEvent.id }}</el-descriptions-item>
          <el-descriptions-item label="事件时间">{{ activeEvent.time }}</el-descriptions-item>
          <el-descriptions-item label="事件类型">{{ activeEvent.type }}</el-descriptions-item>
          <el-descriptions-item label="事件状态">
            <el-tag :type="activeEvent.status === '已完成' ? 'success' : 'warning'">
              {{ activeEvent.status }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="设备名称" :span="2">{{ activeEvent.deviceName }}</el-descriptions-item>
          <el-descriptions-item label="设备编号">{{ activeEvent.deviceSn }}</el-descriptions-item>
          <el-descriptions-item label="事件位置">{{ activeEvent.location }}</el-descriptions-item>
          <el-descriptions-item label="关联标签" :span="2">
            <el-tag type="info">{{ activeEvent.tag }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="完成时间" :span="2">{{ activeEvent.finishTime || '暂无' }}</el-descriptions-item>
          <el-descriptions-item label="事件描述" :span="2">{{ activeEvent.description }}</el-descriptions-item>
        </el-descriptions>
        
        <div class="media-preview-section">
          <div class="media-preview-box">
            <span class="box-label">抓拍照片</span>
            <el-image 
              :src="activeEvent.image" 
              :preview-src-list="[activeEvent.image]" 
              preview-teleported 
              fit="contain" 
              class="media-preview-img"
            />
          </div>
          <div class="media-preview-box" v-if="activeEvent.video">
            <span class="box-label">录制视频</span>
            <div class="video-preview-trigger" @click="playVideoFromDetails">
              <el-icon class="play-icon"><VideoPlay /></el-icon>
              <span>播放录像视频</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  User, 
  PriceTag, 
  Delete, 
  VideoPlay
} from '@element-plus/icons-vue'
import { filterTreeData, activeSafetyEvents } from './data/mockData'

// 事件列表本地可变状态
const eventsList = ref([])
const loading = ref(false)

// 选中的行
const selectedRows = ref([])

// 筛选状态
const activeFilterTab = ref('regions')
const selectedRegionId = ref('')
const selectedGroupId = ref('')
const selectedTagName = ref('')
const statusFilter = ref('全部')

// 分页状态
const currentPage = ref(1)
const pageSize = ref(10)

// 弹窗状态
const videoDialogVisible = ref(false)
const activeVideoUrl = ref('')
const videoPlayer = ref(null)

const detailsDialogVisible = ref(false)
const activeEvent = ref(null)

/**
 * 初始化加载 Mock 事件数据
 */
onMounted(() => {
  eventsList.value = [...activeSafetyEvents]
})

/**
 * 过滤后的事件列表
 */
const filteredEvents = computed(() => {
  return eventsList.value.filter(item => {
    // 状态过滤
    if (statusFilter.value !== '全部' && item.status !== statusFilter.value) {
      return false
    }
    
    // 区域过滤 (新村镇/黎安镇/椰林镇等，若是父级区域不设严格匹配)
    if (selectedRegionId.value) {
      // 简单根据地址或描述中是否包含节点名称做过滤
      const targetNode = findTreeNode(filterTreeData.regions, selectedRegionId.value)
      if (targetNode && targetNode.label) {
        const keyword = targetNode.label.substring(0, 2) // 比如 "新村", "黎安"
        if (!item.location.includes(keyword) && !item.description.includes(keyword)) {
          return false
        }
      }
    }
    
    // 分组过滤 (模拟第一网格巡检组等过滤规则)
    if (selectedGroupId.value) {
      // 简单模拟映射：g1 -> 非法捕捞/防溺水; g2 -> 船只越界/环境污染; 其他 -> 全部
      if (selectedGroupId.value === 'g1' && !['非法捕捞', '防溺水告警'].includes(item.type)) return false
      if (selectedGroupId.value === 'g2' && !['船只越界', '环境污染监测'].includes(item.type)) return false
    }
    
    // 标签过滤
    if (selectedTagName.value && item.type !== selectedTagName.value) {
      return false
    }
    
    return true
  })
})

/**
 * 当前页显示的事件数据
 */
const pagedEvents = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredEvents.value.slice(start, end)
})

/**
 * 递归查找树形结构节点以获取名称
 * @param {Array} list - 树节点数组
 * @param {string} id - 需要查找的节点ID
 * @returns {Object|null} 找到的节点对象
 */
const findTreeNode = (list, id) => {
  for (const node of list) {
    if (node.id === id) return node
    if (node.children && node.children.length > 0) {
      const result = findTreeNode(node.children, id)
      if (result) return result
    }
  }
  return null
}

/**
 * 左侧 Filter Tab 切换时的回调，重置各 Tab 的过滤值
 * @param {string} tabName - 当前选中的 Tab 名称
 */
const handleFilterTabChange = (tabName) => {
  // 切换Tab时清除其他Tab的过滤条件，仅保留当前Tab
  selectedRegionId.value = ''
  selectedGroupId.value = ''
  selectedTagName.value = ''
  currentPage.value = 1
}

/**
 * 点击左侧区域树节点过滤右侧表格
 * @param {Object} node - 选中的树节点对象
 */
const handleRegionClick = (node) => {
  selectedRegionId.value = node.id
  currentPage.value = 1
  ElMessage.info(`已按区域【${node.label}】筛选`)
}

/**
 * 点击左侧分组过滤右侧表格
 * @param {string} groupId - 分组ID
 */
const handleGroupClick = (groupId) => {
  selectedGroupId.value = groupId
  currentPage.value = 1
  const group = filterTreeData.groups.find(g => g.id === groupId)
  ElMessage.info(`已按分组【${group?.label}】筛选`)
}

/**
 * 清除左侧分组过滤条件
 */
const clearGroupFilter = () => {
  selectedGroupId.value = ''
  currentPage.value = 1
}

/**
 * 点击左侧标签过滤右侧表格
 * @param {string} tagName - 标签名称
 */
const handleTagClick = (tagName) => {
  selectedTagName.value = tagName
  currentPage.value = 1
  ElMessage.info(`已按标签【${tagName}】筛选`)
}

/**
 * 清除左侧标签过滤条件
 */
const clearTagFilter = () => {
  selectedTagName.value = ''
  currentPage.value = 1
}

/**
 * 改变右侧状态筛选Tab
 * @param {string} val - 选中的状态值
 */
const handleStatusFilterChange = (val) => {
  currentPage.value = 1
}

/**
 * 表格多选变化回调
 * @param {Array} val - 选中的行数据列表
 */
const handleSelectionChange = (val) => {
  selectedRows.value = val
}

/**
 * 分页大小改变回调
 * @param {number} size - 分页大小
 */
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

/**
 * 页码改变回调
 * @param {number} page - 当前页码
 */
const handleCurrentChange = (page) => {
  currentPage.value = page
}

/**
 * 点击列表中的播放视频按钮
 * @param {Object} row - 行对象
 */
const playVideo = (row) => {
  activeVideoUrl.value = row.video
  videoDialogVisible.value = true
}

/**
 * 视频弹窗关闭时停止播放
 */
const handleVideoDialogClose = () => {
  if (videoPlayer.value) {
    videoPlayer.value.pause()
  }
}

/**
 * 在详情弹窗中播放视频
 */
const playVideoFromDetails = () => {
  if (activeEvent.value) {
    playVideo(activeEvent.value)
  }
}

/**
 * 查看事件详情
 * @param {Object} row - 行对象
 */
const showDetails = (row) => {
  activeEvent.value = row
  detailsDialogVisible.value = true
}

/**
 * 单条删除事件处理
 * @param {Object} row - 行对象
 */
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确认删除该事件【编号: ${row.id}】吗？删除后不可恢复。`,
    '系统提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    eventsList.value = eventsList.value.filter(item => item.id !== row.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

/**
 * 批量删除选中事件处理
 */
const handleBatchDelete = () => {
  const count = selectedRows.value.length
  ElMessageBox.confirm(
    `确认批量删除选中的 ${count} 个事件吗？删除后不可恢复。`,
    '系统提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    const selectedIds = selectedRows.value.map(row => row.id)
    eventsList.value = eventsList.value.filter(item => !selectedIds.includes(item.id))
    selectedRows.value = []
    ElMessage.success('批量删除成功')
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
.secure-events-container {
  display: flex;
  height: calc(100vh - 100px);
  padding: 16px;
  background-color: #f5f7fa;
  box-sizing: border-box;
}

.left-filter-panel {
  width: 260px;
  background: #ffffff;
  border-radius: 6px;
  padding: 16px;
  margin-right: 16px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  border: 1px solid #e4e7ed;

  .panel-title {
    margin: 0 0 12px 0;
    font-size: 16px;
    font-weight: 600;
    color: #303133;
  }

  .filter-tabs {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    
    :deep(.el-tabs__content) {
      flex: 1;
      overflow-y: auto;
      margin-top: 10px;
    }
  }

  .filter-tree {
    background: transparent;
  }
}

.list-filter-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.list-filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #606266;
  transition: all 0.3s;

  &:hover {
    background-color: #f0f2f5;
    color: #409eff;
  }

  &.active {
    background-color: #ecf5ff;
    color: #409eff;
    font-weight: bold;
  }
}

.clear-filter {
  margin-top: 8px;
  text-align: center;
  font-size: 12px;
  color: #909399;
  cursor: pointer;
  padding: 6px;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  transition: all 0.3s;

  &:hover {
    color: #f56c6c;
    border-color: #f56c6c;
  }
}

.right-content-panel {
  flex: 1;
  background: #ffffff;
  border-radius: 6px;
  padding: 16px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  border: 1px solid #e4e7ed;
  overflow: hidden;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.table-container {
  flex: 1;
  overflow: hidden;
  margin-bottom: 16px;
}

.events-table {
  height: 100%;
}

.event-thumbnail {
  width: 50px;
  height: 38px;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.video-btn-icon {
  font-size: 16px;
  vertical-align: middle;
}

.text-placeholder {
  color: #c0c4cc;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
}

.mock-video-player {
  padding: 10px;
  background: #000;
  border-radius: 4px;
}

.event-details-content {
  padding: 10px 0;
}

.media-preview-section {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.media-preview-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: #f8f9fa;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #e4e7ed;

  .box-label {
    font-size: 13px;
    font-weight: 500;
    color: #606266;
  }
}

.media-preview-img {
  width: 100%;
  height: 150px;
  border-radius: 4px;
}

.video-preview-trigger {
  width: 100%;
  height: 150px;
  background: #2c3e50;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #ffffff;
  gap: 8px;
  transition: all 0.3s;

  &:hover {
    background: #34495e;
    transform: scale(1.02);
  }

  .play-icon {
    font-size: 36px;
  }
}
</style>
