"use client"

import { cn } from "@/lib/utils"

interface SectionDividerProps {
  type?: "gradient" | "wave" | "curve" | "dots"
  fromColor?: string
  toColor?: string
  className?: string
  height?: string
  waveColor?: string
  waveOpacity?: string
  subtle?: boolean
}

export function SectionDivider({
  type = "gradient",
  fromColor = "from-orange-50",
  toColor = "to-white",
  className,
  height = "h-24",
  waveColor = "text-orange",
  waveOpacity = "opacity-100",
  subtle = false,
}: SectionDividerProps) {
  if (type === "gradient") {
    return <div className={cn(`w-full bg-gradient-to-b ${fromColor} ${toColor}`, height, className)} />
  }

  if (type === "wave") {
    return (
      <div className={cn("relative w-full overflow-hidden", height, className)}>
        <div className={`absolute inset-0 bg-gradient-to-b ${fromColor} ${toColor}`} />
        <svg
          className={cn("absolute bottom-0 w-full", subtle ? "h-1/2" : "h-full")}
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            className={cn("fill-current", waveColor, subtle ? "opacity-10" : "opacity-25")}
          />
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            className={cn("fill-current", waveColor, subtle ? "opacity-15" : "opacity-30")}
          />
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className={cn("fill-current", waveColor, subtle ? "opacity-20" : "opacity-40")}
          />
        </svg>
      </div>
    )
  }

  if (type === "curve") {
    return (
      <div className={cn("relative w-full overflow-hidden", height, className)}>
        <svg
          className={cn("absolute bottom-0 w-full", subtle ? "h-1/2" : "h-full")}
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            className={cn("fill-current", waveColor, waveOpacity)}
          />
        </svg>
      </div>
    )
  }

  if (type === "dots") {
    return (
      <div className={cn("relative w-full overflow-hidden", height, className)}>
        <div className={`absolute inset-0 bg-gradient-to-b ${fromColor} ${toColor}`} />
        <div className={cn("absolute inset-0", subtle ? "opacity-10" : "opacity-20")}>
          {Array.from({ length: subtle ? 25 : 50 }).map((_, i) => (
            <div
              key={i}
              className={cn("absolute w-2 h-2 rounded-full animate-pulse-soft", waveColor)}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  return null
}
