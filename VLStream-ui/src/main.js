import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
import './style.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import Avue from '@smallwei/avue';
import '@smallwei/avue/lib/index.css';
import crudCommon from '@/mixins/crud.js';
import axios from './utils/request';
import basicContainer from './components/basic-container/main.vue';

window.$crudCommon = crudCommon;

// 创建Vue应用
const app = createApp(App)

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.component('basicContainer', basicContainer);

app.use(ElementPlus, {
  locale: zhCn,
})
// 使用插件
app.use(ElementPlus)
app.use(createPinia())
app.use(router)
app.use(Avue, {
  axios,
  calcHeight: 10,
});
// 挂载应用
app.mount('#app') 