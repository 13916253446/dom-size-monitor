
import debounce from '../debounce'

export const createSensor = element => {
  // 感应器
  let sensor = null
  // callback
  let listeners = []

  /**
   * 统一触发 listeners
   */
  const resizeListener = debounce(() => {
    // 依次触发执行
    listeners.forEach(listener => {
      listener(element)
    })
  })

  const newSensor = () => {
    const sensor = new ResizeObserver(resizeListener)
    // 监听 element
    sensor.observe(element)

    // 直接触发一次
    resizeListener()
    return sensor
  }

  const bind = cb => {
    if (!sensor) {
      sensor = newSensor()
    }

    if (listeners.indexOf(cb) === -1) {
      listeners.push(cb)
    }
  }

  /**
   * 完全 destroy
   */
  const destroy = () => {
    sensor.disconnect()

    listeners = []
    sensor = undefined
  }

  const unbind = cb => {
    const idx = listeners.indexOf(cb)
    if (idx !== -1) {
      listeners.splice(idx, 1)
    }

    // 不存在 listener，并且存在 sensor object
    // 则移除 object
    if (listeners.length === 0 && sensor) {
      destroy()
    }
  }

  return {
    element,
    bind,
    destroy,
    unbind
  }
}
