import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'

// カスタムCSSをインポート
import './scss/style.scss'
// BootstrapのJSをすべてインポート
// import * as bootstrap from 'bootstrap'

createApp(App).mount('#app')

export const ab = (): void => {
  console.log('aa')
}
