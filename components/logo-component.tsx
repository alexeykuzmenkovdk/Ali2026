import Image from "next/image"

interface LogoProps {
  width: number
  height: number
  size?: "small" | "large"
}

function Logo({ width, height, size = "small" }: LogoProps) {
  return (
    <div className="flex items-center">
      <Image
        src="/logo.png"
        alt="Alipayfast Logo"
        width={width}
        height={height}
        className="h-auto w-auto"
        priority={size === "large"}
      />
    </div>
  )
}

export { Logo }
export default Logo
