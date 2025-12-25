"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Text, Float } from "@react-three/drei"
import * as THREE from "three"
import { motion } from "framer-motion"
import { MotionConfig } from "framer-motion"

// Компонент для символа рубля
function RubleSymbol(props: any) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (!hovered) {
      meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.05
    }
  })

  return (
    <mesh
      {...props}
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.1 : 1}
    >
      <Text
        font="/fonts/Inter-Bold.woff"
        fontSize={1.2}
        color="#FF3300"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#FF5500"
      >
        ₽
      </Text>
    </mesh>
  )
}

// Компонент для символа юаня
function YuanSymbol(props: any) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (!hovered) {
      meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3 + 1) * 0.1
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2 + 1) * 0.05
    }
  })

  return (
    <mesh
      {...props}
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.1 : 1}
    >
      <Text
        font="/fonts/Inter-Bold.woff"
        fontSize={1.2}
        color="#FF0000"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#FF3300"
      >
        ¥
      </Text>
    </mesh>
  )
}

// Компонент для создания формы логотипа
function LogoShape(props: any) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)

  // Создаем градиентный материал программно
  const createGradientMaterial = () => {
    const canvas = document.createElement("canvas")
    canvas.width = 256
    canvas.height = 256
    const context = canvas.getContext("2d")

    if (context) {
      // Создаем градиент
      const gradient = context.createLinearGradient(0, 0, 256, 256)
      gradient.addColorStop(0, "#FF5500")
      gradient.addColorStop(1, "#FF0000")

      context.fillStyle = gradient
      context.fillRect(0, 0, 256, 256)
    }

    const texture = new THREE.CanvasTexture(canvas)
    return new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide, // Делаем материал видимым с обеих сторон
      metalness: 0.5,
      roughness: 0.3,
    })
  }

  useFrame((state) => {
    if (!hovered) {
      meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1
    }
  })

  return (
    <group {...props} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      {/* Создаем форму логотипа из простых геометрических фигур */}
      <mesh ref={meshRef} scale={hovered ? 1.05 : 1}>
        {/* Основная форма логотипа - полукруг */}
        <mesh position={[0, 0, 0]} material={createGradientMaterial()}>
          <torusGeometry args={[1.5, 0.3, 16, 32, Math.PI]} />
        </mesh>

        {/* Дополнительная форма - волна */}
        <mesh position={[0, -0.5, 0]} material={createGradientMaterial()}>
          <torusGeometry args={[1.2, 0.2, 16, 32, Math.PI * 0.8]} rotation={[0, 0, Math.PI]} />
        </mesh>
      </mesh>
    </group>
  )
}

// Компонент для текста "ALIPAYFAST"
function LogoText(props: any) {
  return (
    <group {...props}>
      {/* Текст ALIPAYFAST - точно по центру */}
      <Text
        font="/fonts/Inter-Bold.woff"
        fontSize={0.5}
        position={[0, 0, 0]}
        color="#FF3300"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#FF5500"
        material-side={THREE.DoubleSide} // Делаем текст видимым с обеих сторон
      >
        ALIPAYFAST
      </Text>

      {/* Подзаголовок - точно по центру */}
      <Text
        font="/fonts/Inter-Regular.woff"
        fontSize={0.2}
        position={[0, -0.4, 0]}
        color="#333333"
        anchorX="center"
        anchorY="middle"
        material-side={THREE.DoubleSide} // Делаем текст видимым с обеих сторон
      >
        ОБМЕН РУБЛЕЙ НА ЮАНИ
      </Text>
    </group>
  )
}

// Компонент для создания волнистого фона
function WavyBackground() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const { viewport } = useThree()

  // Создаем градиентную текстуру
  const gradientTexture = new THREE.CanvasTexture(createGradientTexture())

  function createGradientTexture() {
    const canvas = document.createElement("canvas")
    canvas.width = 256
    canvas.height = 256

    const context = canvas.getContext("2d")
    if (context) {
      const gradient = context.createLinearGradient(0, 0, 0, 256)
      gradient.addColorStop(0, "#FF5500")
      gradient.addColorStop(1, "#FF0000")

      context.fillStyle = gradient
      context.fillRect(0, 0, 256, 256)
    }

    return canvas
  }

  useFrame((state) => {
    if (meshRef.current) {
      // Анимация волны
      meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime()
    }
  })

  // Шейдер для создания волнистого эффекта
  const waveShader = {
    uniforms: {
      uTime: { value: 0 },
      uTexture: { value: gradientTexture },
    },
    vertexShader: `
      uniform float uTime;
      varying vec2 vUv;
      
      void main() {
        vUv = uv;
        vec3 pos = position;
        pos.z += sin(pos.x * 2.0 + uTime) * 0.1;
        pos.z += sin(pos.y * 2.0 + uTime) * 0.1;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uTexture;
      varying vec2 vUv;
      
      void main() {
        vec4 color = texture2D(uTexture, vUv);
        gl_FragColor = color;
      }
    `,
  }

  return (
    <mesh ref={meshRef} position={[0, 0, -2]} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial attach="material" args={[waveShader]} transparent opacity={0.5} side={THREE.DoubleSide} />
    </mesh>
  )
}

// Компонент для автоматического вращения
function AutoRotate({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    // Очень медленное автоматическое вращение
    groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.1) * 0.2
  })

  return <group ref={groupRef}>{children}</group>
}

// Основная сцена
function Scene() {
  return (
    <>
      {/* Добавляем освещение с обеих сторон для видимости при вращении */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#ff5500" />
      <directionalLight position={[0, 0, -10]} intensity={0.7} /> {/* Свет сзади */}
      <WavyBackground />
      <AutoRotate>
        <group position={[0, 0.5, 0]}>
          <LogoShape />
          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <RubleSymbol position={[-0.7, 1.2, 0.5]} />
            <YuanSymbol position={[0.7, 1.2, 0.5]} />
          </Float>
          <LogoText position={[0, -1.2, 0]} />
        </group>
      </AutoRotate>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        // Ограничиваем вращение, чтобы модель всегда была видна
        minPolarAngle={Math.PI / 4} // Минимальный угол наклона (сверху)
        maxPolarAngle={Math.PI / 1.5} // Максимальный угол наклона (снизу)
        minAzimuthAngle={-Math.PI / 4} // Минимальный угол поворота (влево)
        maxAzimuthAngle={Math.PI / 4} // Максимальный угол поворота (вправо)
        rotateSpeed={0.5} // Уменьшаем скорость вращения
      />
    </>
  )
}

// Экспортируемый компонент
export function AlipayFastLogo() {
  const [mounted, setMounted] = useState(false)

  // Предотвращаем ошибки гидратации
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <MotionConfig transition={{ duration: 0.5 }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-[400px] md:h-[500px]">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <Scene />
        </Canvas>
      </motion.div>
    </MotionConfig>
  )
}

// Запасной вариант, если 3D не загрузится
export function FallbackLogo() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-[300px] h-[300px] flex items-center justify-center"
      >
        {/* Создаем логотип с помощью CSS */}
        <div className="relative flex flex-col items-center">
          {/* Основная форма логотипа */}
          <motion.div
            className="w-[200px] h-[100px] rounded-t-full border-t-[20px] border-l-[20px] border-r-[20px] border-orange-500"
            animate={{ rotate: [0, 5, 0, -5, 0] }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
          />

          {/* Символы валют */}
          <div className="absolute top-[20px] left-[40px] text-3xl font-bold text-red-600">₽</div>
          <div className="absolute top-[20px] right-[40px] text-3xl font-bold text-red-600">¥</div>

          {/* Название - точно по центру */}
          <div className="absolute bottom-[-50px] w-full text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              ALIPAYFAST
            </div>
            <div className="text-xs text-gray-700 mt-1">ОБМЕН РУБЛЕЙ НА ЮАНИ</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
