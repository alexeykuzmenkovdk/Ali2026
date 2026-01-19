import Image from "next/image"

type LogoSize = "small" | "medium" | "large"

interface LogoProps {
  width?: number
  height?: number
  size?: LogoSize
  className?: string
}

const sizeMap: Record<LogoSize, { width: number; height: number }> = {
  small: { width: 120, height: 40 },
  medium: { width: 180, height: 60 },
  large: { width: 240, height: 80 },
}

function Logo({ width, height, size = "small", className }: LogoProps) {
  const resolvedSize = sizeMap[size]
  const resolvedWidth = width ?? resolvedSize.width
  const resolvedHeight = height ?? resolvedSize.height
  return (
    <div className={`flex items-center ${className ?? ""}`.trim()}>
      <Image
        src="/logo.png"
        alt="Alipayfast Logo"
        width={resolvedWidth}
        height={resolvedHeight}
        className="h-auto w-auto"
        priority={size === "large"}
      />
    </div>
  )
}

export { Logo }
export default Logo
