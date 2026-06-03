import { useRef, useState, useEffect, useCallback } from 'react'
import { useInView } from 'framer-motion'

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

const CountUp = ({ end, duration = 1.2, suffix = '', prefix = '' }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const [count, setCount] = useState(0)
  const hasAnimated = useRef(false)

  const animate = useCallback(() => {
    if (hasAnimated.current) return
    hasAnimated.current = true

    const startTime = performance.now()
    const durationMs = duration * 1000

    const tick = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / durationMs, 1)
      const easedProgress = easeOutCubic(progress)

      setCount(easedProgress * end)

      if (progress < 1) {
        requestAnimationFrame(tick)
      } else {
        setCount(end)
      }
    }

    requestAnimationFrame(tick)
  }, [end, duration])

  useEffect(() => {
    if (isInView) {
      animate()
    }
  }, [isInView, animate])

  return (
    <span ref={ref}>
      {prefix}{Math.round(count)}{suffix}
    </span>
  )
}

export default CountUp
