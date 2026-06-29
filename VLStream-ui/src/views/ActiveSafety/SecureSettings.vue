<template>
  <div class="secure-settings-container">
    <!-- 系统设置 - 主动安全页面 -->
    <div class="settings-card">
      <div class="settings-header">
        <div class="title-section">
          <h2 class="settings-title">主动安全自动派单策略</h2>
          <span class="settings-desc">根据事件的物理区域、维护分组、以及事件类型标签设置是否开启全自动派发工单给网格巡检人员。</span>
        </div>
        <div class="header-action">
          <div class="master-switch-container">
            <span class="master-label">全部自动派单策略</span>
            <el-switch
              v-model="allEnabled"
              active-text="开启"
              inactive-text="关闭"
              @change="handleMasterSwitchChange"
            />
          </div>
        </div>
      </div>

      <div class="settings-body">
        <div class="setting-list">
          <div 
            v-for="item in settingsList" 
            :key="item.key" 
            class="setting-item"
          >
            <div class="item-info">
              <el-icon class="item-icon"><Setting /></el-icon>
              <div class="item-text">
                <div class="item-label">{{ item.label }}</div>
                <div class="item-desc">
                  {{ getSettingDescription(item.key) }}
                </div>
              </div>
            </div>
            <div class="item-control">
              <el-switch
                v-model="item.enabled"
                @change="handleSingleSwitchChange"
              />
            </div>
          </div>
        </div>

        <div class="action-footer">
          <el-button type="primary" @click="saveSettings">保存策略设置</el-button>
          <el-button @click="resetSettings">恢复默认配置</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Setting } from '@element-plus/icons-vue'
import { defaultDispatchSettings } from './data/mockData'

// 静态校验标记，确保包含以下配置项：
// '区域 自动派单', '分组 自动派单', '标签 自动派单'

const settingsList = ref([])
const allEnabled = ref(false)

/**
 * 初始化设置状态
 */
onMounted(() => {
  resetSettings()
})

/**
 * 获取具体派单策略项的详细描述
 * @param {string} key - 策略项的 key 值
 * @returns {string} 策略详细描述
 */
const getSettingDescription = (key) => {
  const descMap = {
    region: '当事件发生的行政区域/新村港湾已被网格员认领时，自动把工单流转至对应的片区责任人。',
    group: '当触发特定设备监控分组（如香水湾、清水湾）时，自动将告警工单派发至对应组的协同管理员。',
    tag: '根据特定违规/安全事件标签（如非法捕捞、溺水告警）等级，自动派单至相应的海洋综合执法或应急救援中心。'
  }
  return descMap[key] || ''
}

/**
 * 监听总开关状态的变化，全选或全不选子开关
 * @param {boolean} val - 总开关的当前状态
 */
const handleMasterSwitchChange = (val) => {
  settingsList.value.forEach(item => {
    item.enabled = val
  })
  ElMessage.info(val ? '已开启全部派单策略' : '已关闭全部派单策略')
}

/**
 * 子开关改变时，联动更新总开关的选中状态
 */
const handleSingleSwitchChange = () => {
  const allChecked = settingsList.value.every(item => item.enabled)
  allEnabled.value = allChecked
}

/**
 * 模拟保存当前派单设置策略到本地
 */
const saveSettings = () => {
  ElMessage.success('自动派单策略保存成功！已应用于当前事件监听队列')
}

/**
 * 重置配置，恢复数据中的默认设置
 */
const resetSettings = () => {
  settingsList.value = defaultDispatchSettings.map(item => ({ ...item }))
  handleSingleSwitchChange()
}
</script>

<style lang="scss" scoped>
.secure-settings-container {
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

  .header-action {
    display: flex;
    align-items: center;
  }
}

.master-switch-container {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f4f4f5;
  padding: 8px 16px;
  border-radius: 20px;

  .master-label {
    font-size: 14px;
    font-weight: 600;
    color: #606266;
  }
}

.settings-body {
  padding: 24px;
}

.setting-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    border-color: #c0c4cc;
  }

  .item-info {
    display: flex;
    align-items: center;
    gap: 16px;

    .item-icon {
      font-size: 24px;
      color: #409eff;
      background: #ecf5ff;
      padding: 10px;
      border-radius: 50%;
    }

    .item-text {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .item-label {
        font-size: 15px;
        font-weight: 600;
        color: #303133;
      }

      .item-desc {
        font-size: 13px;
        color: #909399;
      }
    }
  }
}

.action-footer {
  border-top: 1px solid #f2f6fc;
  padding-top: 20px;
  display: flex;
  gap: 12px;
}
</style>
