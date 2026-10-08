// 仅传固定事件名，不传答案、分型、设备 ID 或联系方式。
const EVENTS = new Set([
  'page_view', 'quiz_start', 'quiz_complete', 'share_image_requested',
  'share_link_intent', 'share_link_copied', 'goodwen_click',
])

export function createTracker(config = {}) {
  // 默认不发送。生产环境填同源的事件接收地址，如 /api/sbti-events。
  const endpoint = config?.endpoint
  if (typeof endpoint !== 'string' || !/^\/(?!\/)/.test(endpoint)) return () => {}
  return (event) => {
    if (!EVENTS.has(event)) return
    const body = JSON.stringify({ event, source: 'sbti', version: 1 })
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(endpoint, new Blob([body], { type: 'text/plain' }))
      } else {
        fetch(endpoint, { method: 'POST', body, keepalive: true,
          headers: { 'Content-Type': 'text/plain' } }).catch(() => {})
      }
    } catch { /* 统计失败不影响答题 */ }
  }
}
