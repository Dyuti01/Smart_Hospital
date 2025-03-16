import type React from "react"
import { useEffect, useRef } from "react"

interface BeamBackgroundProps {
  children: React.ReactNode
}

export const BeamBackground: React.FC<BeamBackgroundProps> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    // Draw the beams
    const drawBeams = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#f8fafc")
      gradient.addColorStop(1, "#f1f5f9")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw beams
      const beamCount = 8
      const beamWidth = canvas.width * 2
      const beamHeight = canvas.height * 0.7

      for (let i = 0; i < beamCount; i++) {
        const angle = (i * Math.PI) / beamCount
        const x = canvas.width / 2
        const y = canvas.height / 2

        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(angle)
        ctx.translate(-x, -y)

        const beamGradient = ctx.createLinearGradient(x - beamWidth / 2, y, x + beamWidth / 2, y)
        beamGradient.addColorStop(0, "rgba(224, 242, 254, 0)")
        beamGradient.addColorStop(0.5, "rgba(186, 230, 253, 0.1)")
        beamGradient.addColorStop(1, "rgba(224, 242, 254, 0)")

        ctx.fillStyle = beamGradient
        ctx.fillRect(x - beamWidth / 2, y - beamHeight / 2, beamWidth, beamHeight)

        ctx.restore()
      }
    }

    drawBeams()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <div className="relative min-h-screen">
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-10" />
      {children}
    </div>
  )
}

