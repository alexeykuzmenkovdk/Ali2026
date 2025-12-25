"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Text } from "@react-three/drei"
import type { Mesh } from "three"
import { motion } from "framer-motion"
import { MotionConfig } from "framer-motion"
import * as THREE from "three"

function AlipayCard(props: any) {
  const meshRef = useRef<Mesh>(null!)
  const [hovered, setHovered] = useState(false)

  // Создаем материалы для карты вместо использования текстуры
  const frontMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#1677FF"), // Синий цвет Alipay
    metalness: 0.7,
    roughness: 0.2,
  })

  const backMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#FF5500"), // Оранжевый цвет
    metalness: 0.7,
    roughness: 0.2,
  })

  const sideMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#FFFFFF"),
    metalness: 0.5,
    roughness: 0.2,
  })

  // Создаем массив материалов для разных сторон карты
  const materials = [
    sideMaterial, // right
    sideMaterial, // left
    sideMaterial, // top
    sideMaterial, // bottom
    frontMaterial, // front
    backMaterial, // back
  ]

  useFrame((state) => {
    if (!hovered) {
      meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1
    }
  })

  return (
    <group {...props}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.1 : 1}
        material={materials}
      >
        <boxGeometry args={[3.4, 2.1, 0.1]} />
      </mesh>

      {/* Добавляем текст Alipay на карту */}
      <Text
        position={[0, 0, 0.06]} // Немного впереди карты
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
        userData={{ enableBloom: true }}
      >
        Alipay
      </Text>

      {/* Добавляем символ юаня */}
      <Text
        position={[1.2, -0.6, 0.06]} // В правом нижнем углу
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        ¥
      </Text>
    </group>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#ff5500" />
      <AlipayCard position={[0, 0, 0]} />
      <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 2} />
    </>
  )
}

export function AlipayModel() {
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
