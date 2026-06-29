/**
 * 主动安全模块 - 本地 Mock 数据
 * 该文件定义了事件管理、工单管理、系统设置所需的静态数据
 */

// 事件管理 - 筛选面板树形结构数据
export const filterTreeData = {
  regions: [
    { id: 'r1', label: '陵水县', children: [
      { id: 'r1-1', label: '新村镇' },
      { id: 'r1-2', label: '黎安镇' },
      { id: 'r1-3', label: '椰林镇' }
    ]},
    { id: 'r2', label: '三亚市', children: [
      { id: 'r2-1', label: '海棠区' }
    ]}
  ],
  groups: [
    { id: 'g1', label: '第一网格巡检组' },
    { id: 'g2', label: '第二网格巡检组' },
    { id: 'g3', label: '港口安全管理组' }
  ],
  tags: [
    { id: 't1', label: '非法捕捞' },
    { id: 't2', label: '船只越界' },
    { id: 't3', label: '防溺水告警' },
    { id: 't4', label: '环境污染监测' }
  ]
}

// 事件管理 - 主动安全事件列表
export const activeSafetyEvents = [
  {
    id: 'E001',
    time: '2026-06-28 10:20:30',
    status: '正在处理',
    location: '陵水新村港湾 1号浮标旁',
    type: '非法捕捞',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&auto=format&fit=crop', // 潜水/捕捞示意图
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    deviceName: '高清球机-新村01',
    deviceSn: 'SN-VLS928172',
    description: '疑似小型渔船在禁渔区范围内下网捕捞',
    tag: '非法捕捞',
    finishTime: ''
  },
  {
    id: 'E002',
    time: '2026-06-28 09:15:00',
    status: '已完成',
    location: '黎安湾潟湖 2号监控点',
    type: '船只越界',
    image: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?w=500&auto=format&fit=crop', // 游船/越界示意图
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    deviceName: '高清枪机-黎安02',
    deviceSn: 'SN-VLS839102',
    description: '游艇超出核定航行区域，进入生态保护核心区',
    tag: '船只越界',
    finishTime: '2026-06-28 10:45:00'
  },
  {
    id: 'E003',
    time: '2026-06-28 08:30:12',
    status: '正在处理',
    location: '清水湾沙滩 3号红外对射区',
    type: '防溺水告警',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop', // 海滩示意图
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    deviceName: '热成像云台-清水湾03',
    deviceSn: 'SN-VLS749321',
    description: '检测到夜间/非开放时段有游客跨越警戒线试图下水',
    tag: '防溺水告警',
    finishTime: ''
  },
  {
    id: 'E004',
    time: '2026-06-27 16:45:22',
    status: '已完成',
    location: '香水湾入海口 监测站',
    type: '环境污染监测',
    image: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=500&auto=format&fit=crop', // 垃圾/污染示意图
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    deviceName: '环保多目一体机-香水湾01',
    deviceSn: 'SN-VLS629381',
    description: '水面大面积白色漂浮垃圾聚集',
    tag: '环境污染监测',
    finishTime: '2026-06-27 18:20:10'
  },
  {
    id: 'E005',
    time: '2026-06-27 11:10:05',
    status: '已完成',
    location: '新村港红树林 保护区',
    type: '非法捕捞',
    image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=500&auto=format&fit=crop', // 浅滩捕捞示意图
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    deviceName: '高清球机-红树林05',
    deviceSn: 'SN-VLS510293',
    description: '红树林保护核心区内有捕鸟网以及地笼网具投放',
    tag: '非法捕捞',
    finishTime: '2026-06-27 14:15:30'
  }
]

// 工单管理 - 模拟工单数据
export const workOrdersData = {
  my: [
    {
      id: 1,
      code: 'WO-202606280001',
      title: '关于新村港非法捕捞事件的核查工单',
      source: '主动安全事件',
      version: 'v1.2',
      creator: '系统自动派单',
      status: '处理中',
      submitTime: '2026-06-28 10:21:00'
    },
    {
      id: 2,
      code: 'WO-202606280002',
      title: '清水湾沙滩防溺水劝导工单',
      source: '主动安全事件',
      version: 'v1.0',
      creator: '系统自动派单',
      status: '处理中',
      submitTime: '2026-06-28 08:31:00'
    },
    {
      id: 3,
      code: 'WO-202606270005',
      title: '香水湾水面漂浮物清理确认工单',
      source: '主动安全事件',
      version: 'v1.1',
      creator: '巡检员自建',
      status: '已关闭',
      submitTime: '2026-06-27 16:47:00'
    }
  ],
  pending: [
    {
      id: 1,
      code: 'WO-202606280001',
      title: '关于新村港非法捕捞事件的核查工单',
      category: '非法捕捞核查',
      source: '主动安全事件',
      version: 'v1.2',
      creator: '系统自动派单',
      submitTime: '2026-06-28 10:21:00'
    },
    {
      id: 2,
      code: 'WO-202606280002',
      title: '清水湾沙滩防溺水劝导工单',
      category: '防溺水响应',
      source: '主动安全事件',
      version: 'v1.0',
      creator: '系统自动派单',
      submitTime: '2026-06-28 08:31:00'
    }
  ],
  completed: [
    {
      id: 1,
      code: 'WO-202606280003',
      title: '黎安湾生态保护区船只越界驱离工单',
      category: '越界驱离',
      source: '主动安全事件',
      version: 'v1.0',
      creator: '系统自动派单',
      status: '已归档',
      receiveTime: '2026-06-28 09:16:00'
    },
    {
      id: 2,
      code: 'WO-202606270005',
      title: '香水湾水面漂浮物清理确认工单',
      category: '水面保洁',
      source: '主动安全事件',
      version: 'v1.1',
      creator: '巡检员自建',
      status: '已归档',
      receiveTime: '2026-06-27 16:48:00'
    }
  ],
  claimable: [
    {
      id: 1,
      code: 'WO-202606280004',
      title: '黎安湾海滩临时违规搭建核查工单',
      category: '临时违规搭建',
      source: '视频智能抓拍',
      version: 'v1.0',
      creator: '值班话务员',
      receiveTime: '2026-06-28 09:50:00'
    },
    {
      id: 2,
      code: 'WO-202606280005',
      title: '新村港渔船乱停乱放整治协查工单',
      category: '渔业管理',
      source: '网格化自报',
      version: 'v1.0',
      creator: '网格员A',
      receiveTime: '2026-06-28 10:10:00'
    }
  ]
}

// 系统设置 - 默认派单策略配置
export const defaultDispatchSettings = [
  { key: 'region', label: '区域 自动派单', enabled: true },
  { key: 'group', label: '分组 自动派单', enabled: false },
  { key: 'tag', label: '标签 自动派单', enabled: true }
]

// 系统设置 - 默认工单模型
export const defaultWorkOrderModels = [
  {
    id: 1,
    name: '环保模型',
    description: '针对垃圾漂浮、水面排污、垃圾堆放等环保类事件自动分派与闭环的工单模型配置',
    version: 'v2.1',
    creator: '系统内置',
    updateTime: '2026-06-28 12:00:00'
  }
]
