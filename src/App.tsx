import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import bgImage from './assets/bg.jpg'

const LOCBOX_SCHEME = 'locbox://'
const IOS_DOWNLOAD_URL = 'https://apps.apple.com/vn/app/locbox/idXXXXXXXX'
const ANDROID_FALLBACK_URL = 'https://download.locbox.vn/locbox-latest.apk'

/** 尝试唤起 App，若未安装则跳转下载页 */
function openApp(downloadUrl: string) {
  let timer: ReturnType<typeof setTimeout> | null = null

  const handleBlur = () => {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
    window.removeEventListener('blur', handleBlur)
  }

  window.addEventListener('blur', handleBlur)

  // 尝试唤起 App
  window.location.href = LOCBOX_SCHEME

  // 2秒后若页面仍未失焦，说明 App 未安装
  timer = setTimeout(() => {
    window.removeEventListener('blur', handleBlur)
    window.location.href = downloadUrl
  }, 2000)
}

function App() {
  const [androidUrl, setAndroidUrl] = useState(ANDROID_FALLBACK_URL)

  useEffect(() => {
    axios
      .post<{ data: { url: string } }>(
        'https://test.locbox.vn/api/system/GetAppVersion',
        { app_name: 'android' },
        { headers: { token: 'A20260330135549381179xdso' } }
      )
      .then(({ data }) => {
        if (data?.data?.url) {
          setAndroidUrl(data.data.url)
        }
      })
      .catch(() => {
        // 接口失败时使用兜底链接
      })
  }, [])

  return (
    <div
      className="app-container"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="btn-group">
        <a
          className="download-btn"
          onClick={() => openApp(IOS_DOWNLOAD_URL)}
        >
          {/* iOS 下载 */}
        </a>
        <a
          className="download-btn"
          onClick={() => openApp(androidUrl)}
        >
          {/* Android 下载 */}
        </a>
      </div>
    </div>
  )
}

export default App
