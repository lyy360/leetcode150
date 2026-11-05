import Taro from '@tarojs/taro'

/**
 * 复制文本到剪贴板（三处复制按钮共用）。
 * 基础库 3.x 起 setClipboardData 属于隐私 API，若《用户隐私保护指引》
 * 未声明「写入剪贴板」权限，调用会失败并报 errno 112
 * （setClipboardData:fail api scope is not declared in the privacy agreement）。
 * 此时降级为弹窗说明根因，避免静默失败。
 */
export function copyText(data: string, okMsg = '已复制', onSuccess?: () => void) {
  Taro.setClipboardData({
    data,
    success: () => {
      Taro.showToast({ title: okMsg, icon: 'success' })
      onSuccess?.()
    },
    fail: (err) => {
      const msg = err?.errMsg ?? ''
      if (msg.includes('not declared') || msg.includes('privacy')) {
        Taro.showModal({
          title: '无法自动复制',
          content: '当前小程序的《用户隐私保护指引》未声明「写入剪贴板」权限，请在微信公众平台后台补充声明后重试。',
          showCancel: false
        })
      } else {
        Taro.showToast({ title: '复制失败', icon: 'none' })
      }
    }
  })
}
