<template>
  <div class="work-order-settings-container">
    <!-- 系统设置 - 工单设置页面 -->
    <div class="settings-card">
      <div class="settings-header">
        <div class="title-section">
          <h2 class="settings-title">工单模型管理</h2>
          <span class="settings-desc">通过流程模型配置针对不同事件流转的分派规则、超时时限以及考核评价指标</span>
        </div>
        <div class="header-action">
          <el-button type="primary" @click="openCreateDialog">
            <el-icon><Plus /></el-icon> 新建模型
          </el-button>
        </div>
      </div>

      <div class="settings-body">
        <div class="model-cards-grid">
          <div 
            v-for="model in modelList" 
            :key="model.id" 
            class="model-card"
          >
            <div class="card-header">
              <span class="model-name">{{ model.name }}</span>
              <el-tag size="small" type="success">{{ model.version }}</el-tag>
            </div>
            <div class="card-body">
              <p class="model-desc">{{ model.description }}</p>
              <div class="meta-row">
                <span class="meta-label">创建人：</span>
                <span class="meta-val">{{ model.creator }}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">更新时间：</span>
                <span class="meta-val">{{ model.updateTime }}</span>
              </div>
            </div>
            <div class="card-actions">
              <el-button type="primary" link @click="editModel(model)">编辑</el-button>
              <el-button type="danger" link @click="deleteModel(model)">删除</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新建/编辑模型弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑工单流程模型' : '新建工单流程模型'"
      width="500px"
    >
      <el-form :model="modelForm" ref="modelFormRef" label-width="90px">
        <el-form-item label="模型名称" required>
          <el-input v-model="modelForm.name" placeholder="请输入模型名称，如：环保模型" />
        </el-form-item>
        <el-form-item label="版本号" required>
          <el-input v-model="modelForm.version" placeholder="请输入版本，如：v1.0" />
        </el-form-item>
        <el-form-item label="模型描述" required>
          <el-input 
            v-model="modelForm.description" 
            type="textarea" 
            rows="3" 
            placeholder="请输入模型配置细则及适用告警类型描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitModelForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { defaultWorkOrderModels } from './data/mockData'

const modelList = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const activeModelId = ref(null)

const modelForm = ref({
  name: '',
  version: 'v1.0',
  description: ''
})

/**
 * 初始化加载默认模型数据
 */
onMounted(() => {
  modelList.value = defaultWorkOrderModels.map(item => ({ ...item }))
})

/**
 * 打开新建流程模型对话框，重置表单项
 */
const openCreateDialog = () => {
  isEdit.value = false
  activeModelId.value = null
  modelForm.value = {
    name: '',
    version: 'v1.0',
    description: ''
  }
  dialogVisible.value = true
}

/**
 * 打开编辑流程模型对话框并填充对应数据项
 * @param {Object} model - 需要编辑的模型数据对象
 */
const editModel = (model) => {
  isEdit.value = true
  activeModelId.value = model.id
  modelForm.value = {
    name: model.name,
    version: model.version,
    description: model.description
  }
  dialogVisible.value = true
}

/**
 * 校验并提交模型表单，支持新建与本地更新
 */
const submitModelForm = () => {
  if (!modelForm.value.name.trim()) {
    ElMessage.warning('请输入模型名称')
    return
  }
  if (!modelForm.value.version.trim()) {
    ElMessage.warning('请输入版本号')
    return
  }
  if (!modelForm.value.description.trim()) {
    ElMessage.warning('请输入模型描述')
    return
  }

  if (isEdit.value) {
    // 编辑逻辑
    const index = modelList.value.findIndex(item => item.id === activeModelId.value)
    if (index !== -1) {
      modelList.value[index] = {
        ...modelList.value[index],
        name: modelForm.value.name,
        version: modelForm.value.version,
        description: modelForm.value.description,
        updateTime: new Date().toLocaleString()
      }
      ElMessage.success('模型更新成功！')
    }
  } else {
    // 新建逻辑
    const newId = modelList.value.length > 0 ? Math.max(...modelList.value.map(m => m.id)) + 1 : 1
    const newModel = {
      id: newId,
      name: modelForm.value.name,
      version: modelForm.value.version,
      description: modelForm.value.description,
      creator: '自定义创建',
      updateTime: new Date().toLocaleString()
    }
    modelList.value.push(newModel)
    ElMessage.success('工单模型创建成功！')
  }
  
  dialogVisible.value = false
}

/**
 * 本地删除流程模型
 * @param {Object} model - 被删除的模型行数据
 */
const deleteModel = (model) => {
  ElMessageBox.confirm(
    `确认删除模型【${model.name}】吗？删除后对应派单监听可能失效。`,
    '系统提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    modelList.value = modelList.value.filter(item => item.id !== model.id)
    ElMessage.success('模型删除成功')
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
.work-order-settings-container {
  padding: 16px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 100px);
  box-sizing: border-box;
}

.settings-card {
  background: #ffffff;
  border-radius: 6px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.settings-header {
  padding: 24px;
  border-bottom: 1px solid #f2f6fc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;

  .title-section {
    display: flex;
    flex-direction: column;
    gap: 6px;

    .settings-title {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #303133;
    }

    .settings-desc {
      font-size: 13px;
      color: #909399;
    }
  }
}

.settings-body {
  padding: 24px;
}

.model-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.model-card {
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    border-color: #409eff;
    transform: translateY(-2px);
  }

  .card-header {
    padding: 16px 20px;
    border-bottom: 1px solid #f2f6fc;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .model-name {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }
  }

  .card-body {
    padding: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;

    .model-desc {
      margin: 0;
      font-size: 13px;
      color: #606266;
      line-height: 1.5;
      min-height: 40px;
    }

    .meta-row {
      display: flex;
      font-size: 12px;
      
      .meta-label {
        color: #909399;
      }
      
      .meta-val {
        color: #606266;
      }
    }
  }

  .card-actions {
    padding: 12px 20px;
    background: #fcfcfd;
    border-top: 1px solid #f2f6fc;
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }
}
</style>
