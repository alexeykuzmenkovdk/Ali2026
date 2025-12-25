"use client"

import { motion } from "framer-motion"

export function FontTest() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold mb-6 font-portugal">ТЕСТ ШРИФТА SC PORTUGAL</h2>

      <div className="bg-gray-100 p-6 rounded-lg shadow-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-2xl font-portugal mb-4"
        >
          ТИШИНА МОРОЗОМ ПАХНЕТ, ПАДАЕТ ЛЕНИВО СНЕГ
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-2xl font-portugal"
        >
          ТИШИНА МОРОЗОМ ПАХНЕТ, ПАДАЕТ ЛЕНИВО СНЕГ
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="bg-orange-100 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 font-portugal">ПРИМЕРЫ ТЕКСТА</h3>
          <p className="font-portugal mb-2">ALIPAYFAST - ОБМЕН ВАЛЮТЫ</p>
          <p className="font-portugal mb-2">БЫСТРЫЕ ПЕРЕВОДЫ В КИТАЙ</p>
          <p className="font-portugal mb-2">ВЫГОДНЫЙ КУРС ОБМЕНА</p>
          <p className="font-portugal">БЕЗОПАСНЫЕ ТРАНЗАКЦИИ</p>
        </div>

        <div className="bg-red-100 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 font-portugal">СИМВОЛЫ И ЦИФРЫ</h3>
          <p className="font-portugal mb-2">1234567890</p>
          <p className="font-portugal mb-2">!@#$%^&*()</p>
          <p className="font-portugal mb-2">АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ</p>
          <p className="font-portugal">абвгдеёжзийклмнопрстуфхцчшщъыьэюя</p>
        </div>
      </div>
    </div>
  )
}
