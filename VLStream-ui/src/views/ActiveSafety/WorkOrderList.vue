<template>
  <div class="work-order-container">
    <!-- 头部卡片，包含搜索和页面标题 -->
    <div class="header-card">
      <div class="title-section">
        <h2 class="page-title">{{ pageTitle }}</h2>
        <span class="page-desc">管理并跟踪主动安全事件所触发的工单流转状态</span>
      </div>
      <div class="search-section">
        <el-input
          v-model="searchQuery"
          placeholder="请输入工单标题或编号"
          clearable
          class="search-input"
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
    </div>

    <!-- 表格内容卡片 -->
    <div class="content-card">
      <div class="table-container">
        <el-table
          :data="pagedOrders"
          border
          stripe
          v-loading="loading"
          style="width: 100%"
          class="work-order-table"
        >
          <!-- 序号 -->
          <el-table-column label="序号" type="index" width="60" align="center">
            <template #default="scope">
              {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
            </template>
          </el-table-column>

          <!-- 工单编号 -->
          <el-table-column prop="code" label="工单编号" width="160" align="center" />

          <!-- 工单标题 -->
          <el-table-column prop="title" label="工单标题" min-width="200" show-overflow-tooltip />

          <!-- 所属分类 (我的工单无此项) -->
          <el-table-column 
            v-if="pageType !== 'my'" 
            prop="category" 
            label="所属分类" 
            width="130" 
            align="center" 
          />

          <!-- 工单来源 -->
          <el-table-column prop="source" label="工单来源" width="130" align="center" />

          <!-- 流程版本 -->
          <el-table-column prop="version" label="流程版本" width="100" align="center" />

          <!-- 发起人 -->
          <el-table-column prop="creator" label="发起人" width="120" align="center" />

          <!-- 工单状态 (待办工单、可接工单无此项) -->
          <el-table-column 
            v-slot="scope"
            v-if="pageType === 'my' || pageType === 'completed'" 
            label="工单状态" 
            width="120" 
            align="center"
          >
            <el-tag :type="scope.row.status === '处理中' ? 'primary' : 'success'">
              {{ scope.row.status }}
            </el-tag>
          </el-table-column>

          <!-- 时间列 (不同页面展示不同时间) -->
          <el-table-column 
            v-if="pageType === 'my' || pageType === 'pending'" 
            prop="submitTime" 
            label="提交时间" 
            width="170" 
            align="center" 
          />
          <el-table-column 
            v-else 
            prop="receiveTime" 
            label="接收时间" 
            width="170" 
            align="center" 
          />

          <!-- 操作 -->
          <el-table-column label="操作" width="150" align="center" fixed="right">
            <template #default="scope">
              <el-button type="primary" link @click="viewDetails(scope.row)">查看</el-button>
              
              <!-- 待办工单的操作 -->
              <el-button 
                v-if="pageType === 'pending'" 
                type="success" 
                link 
                @click="handleWorkOrder(scope.row)"
              >
                处理
              </el-button>
              
              <!-- 可接工单的操作 -->
              <el-button 
                v-if="pageType === 'claimable'" 
                type="warning" 
                link 
                @click="claimWorkOrder(scope.row)"
              >
                接单
              </el-button>

              <!-- 我的工单支持删除 -->
              <el-button 
                v-if="pageType === 'my'" 
                type="danger" 
                link 
                @click="deleteWorkOrder(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 20]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredOrders.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 工单详情弹窗 -->
    <el-dialog
      v-model="detailsDialogVisible"
      title="工单详情信息"
      width="600px"
    >
      <div v-if="selectedOrder" class="order-details">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="工单编号" :span="2">{{ selectedOrder.code }}</el-descriptions-item>
          <el-descriptions-item label="工单标题" :span="2">{{ selectedOrder.title }}</el-descriptions-item>
          <el-descriptions-item label="发起人">{{ selectedOrder.creator }}</el-descriptions-item>
          <el-descriptions-item label="流程版本">{{ selectedOrder.version }}</el-descriptions-item>
          <el-descriptions-item label="工单来源">{{ selectedOrder.source }}</el-descriptions-item>
          <el-descriptions-item label="所属分类">{{ selectedOrder.category || '未分类' }}</el-descriptions-item>
          <slot v-if="selectedOrder.status">
            <el-descriptions-item label="工单状态" :span="2">
              <el-tag :type="selectedOrder.status === '处理中' ? 'primary' : 'success'">
                {{ selectedOrder.status }}
              </el-tag>
            </el-descriptions-item>
          </slot>
          <el-descriptions-item label="时间记录" :span="2">
            {{ selectedOrder.submitTime ? '提交时间：' + selectedOrder.submitTime : '接收时间：' + selectedOrder.receiveTime }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>

    <!-- 处理工单弹窗 -->
    <el-dialog
      v-model="handleDialogVisible"
      title="处理待办工单"
      width="500px"
    >
      <el-form :model="handleForm" ref="handleFormRef" label-width="80px">
        <el-form-item label="处理方式" required>
          <el-radio-group v-model="handleForm.action">
            <el-radio label="approve">确认并关闭</el-radio>
            <el-radio label="reject">驳回/无法处理</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理意见" required>
          <el-input 
            v-model="handleForm.comment" 
            type="textarea" 
            rows="4" 
            placeholder="请输入核查意见或处理描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitWorkOrderHandle">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { workOrdersData } from './data/mockData'

const route = useRoute()

// 页面类型和状态
const pageType = ref('my')
const pageTitle = ref('我的工单')
const searchQuery = ref('')
const loading = ref(false)

// 数据源状态
const localOrders = ref({
  my: [],
  pending: [],
  completed: [],
  claimable: []
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)

// 详情弹窗
const detailsDialogVisible = ref(false)
const selectedOrder = ref(null)

// 处理弹窗
const handleDialogVisible = ref(false)
const activeOrderToHandle = ref(null)
const handleForm = ref({
  action: 'approve',
  comment: ''
})

/**
 * 监听路由变化，动态初始化对应的工单列表数据
 */
watch(
  () => route.path,
  (path) => {
    loading.value = true
    currentPage.value = 1
    searchQuery.value = ''
    
    // 初始化一次本地模拟数据（如果在切换页面时数据不存在，则加载）
    if (localOrders.value.my.length === 0) {
      localOrders.value.my = [...workOrdersData.my]
      localOrders.value.pending = [...workOrdersData.pending]
      localOrders.value.completed = [...workOrdersData.completed]
      localOrders.value.claimable = [...workOrdersData.claimable]
    }
    
    // 解析子类型
    if (path.includes('/work-orders/my')) {
      pageType.value = 'my'
      pageTitle.value = '我的工单'
    } else if (path.includes('/work-orders/pending')) {
      pageType.value = 'pending'
      pageTitle.value = '待办工单'
    } else if (path.includes('/work-orders/completed')) {
      pageType.value = 'completed'
      pageTitle.value = '已办工单'
    } else if (path.includes('/work-orders/claimable')) {
      pageType.value = 'claimable'
      pageTitle.value = '可接工单'
    }
    
    setTimeout(() => {
      loading.value = false
    }, 200)
  },
  { immediate: true }
)

/**
 * 过滤后的工单数组
 */
const filteredOrders = computed(() => {
  const currentList = localOrders.value[pageType.value] || []
  if (!searchQuery.value) {
    return currentList
  }
  return currentList.filter(item => 
    item.title.includes(searchQuery.value) || 
    item.code.includes(searchQuery.value)
  )
})

/**
 * 分页截取后的工单数组
 */
const pagedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredOrders.value.slice(start, end)
})

/**
 * 搜索框键入防抖或输入回调
 */
const handleSearch = () => {
  currentPage.value = 1
}

/**
 * 改变分页大小的回调
 * @param {number} size - 页大小
 */
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

/**
 * 页码改变的回调
 * @param {number} page - 页码
 */
const handleCurrentChange = (page) => {
  currentPage.value = page
}

/**
 * 点击“查看”按钮，显示详情弹窗
 * @param {Object} row - 工单数据行
 */
const viewDetails = (row) => {
  selectedOrder.value = row
  detailsDialogVisible.value = true
}

/**
 * 领取工单 (仅在“可接工单”中使用)
 * @param {Object} row - 被领取的工单行
 */
const claimWorkOrder = (row) => {
  ElMessageBox.confirm(
    `确认接收并承接该工单【工单号: ${row.code}】吗？`,
    '接单确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 1. 从“可接工单”列表中移出
    localOrders.value.claimable = localOrders.value.claimable.filter(item => item.id !== row.id)
    
    // 2. 将其状态改为“处理中”并加入到“我的工单”和“待办工单”中
    const newOrder = {
      ...row,
      status: '处理中',
      submitTime: new Date().toLocaleString()
    }
    localOrders.value.my.unshift(newOrder)
    localOrders.value.pending.unshift(newOrder)
    
    ElMessage.success('接单成功！已添加至待办列表')
  }).catch(() => {})
}

/**
 * 点击“处理”按钮打开处理表单弹窗
 * @param {Object} row - 工单数据行
 */
const handleWorkOrder = (row) => {
  activeOrderToHandle.value = row
  handleForm.value.action = 'approve'
  handleForm.value.comment = ''
  handleDialogVisible.value = true
}

/**
 * 提交对待办工单的处理结果
 */
const submitWorkOrderHandle = () => {
  if (!handleForm.value.comment.trim()) {
    ElMessage.warning('请输入处理意见')
    return
  }
  
  const row = activeOrderToHandle.value
  
  // 1. 从“待办工单”列表中移除
  localOrders.value.pending = localOrders.value.pending.filter(item => item.id !== row.id)
  
  // 2. 更新“我的工单”里相应工单的状态为“已办结”
  const myIndex = localOrders.value.my.findIndex(item => item.code === row.code)
  if (myIndex !== -1) {
    localOrders.value.my[myIndex].status = handleForm.value.action === 'approve' ? '已关闭' : '退回处理'
  }
  
  // 3. 将工单加入“已办工单”列表中
  const completedOrder = {
    ...row,
    status: handleForm.value.action === 'approve' ? '已归档' : '驳回待修改',
    receiveTime: new Date().toLocaleString()
  }
  localOrders.value.completed.unshift(completedOrder)
  
  handleDialogVisible.value = false
  ElMessage.success('工单处理成功！')
}

/**
 * 删除工单（仅限“我的工单”页面）
 * @param {Object} row - 工单数据行
 */
const deleteWorkOrder = (row) => {
  ElMessageBox.confirm(
    `确认删除该工单【工单号: ${row.code}】吗？删除后此数据将从本地列表中被移除。`,
    '系统提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    localOrders.value.my = localOrders.value.my.filter(item => item.id !== row.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
.work-order-container {
  padding: 16px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 100px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.header-card {
  background: #ffffff;
  border-radius: 6px;
  padding: 16px 24px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid #e4e7ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;

  .title-section {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .page-title {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #303133;
    }

    .page-desc {
      font-size: 13px;
      color: #909399;
    }
  }

  .search-section {
    width: 280px;
  }
}

.content-card {
  flex: 1;
  background: #ffffff;
  border-radius: 6px;
  padding: 16px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.table-container {
  flex: 1;
  overflow: hidden;
  margin-bottom: 16px;
}

.work-order-table {
  height: 100%;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
}

.order-details {
  padding: 10px 0;
}
</style>
