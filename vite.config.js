import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Dynamic copying script for AI-generated vehicle photography
const targetDir = path.resolve('public/images')
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true })
}

const filesToCopy = [
  {
    src: 'C:\\Users\\Amritansh\\.gemini\\antigravity-ide\\brain\\37977922-aa2c-4bf6-a930-8a5f84fbc5da\\activa_6g_1780393760605.png',
    dest: path.join(targetDir, 'activa-6g.webp')
  },
  {
    src: 'C:\\Users\\Amritansh\\.gemini\\antigravity-ide\\brain\\37977922-aa2c-4bf6-a930-8a5f84fbc5da\\ather_450x_1780393775486.png',
    dest: path.join(targetDir, 'ather-450x.webp')
  },
  {
    src: 'C:\\Users\\Amritansh\\.gemini\\antigravity-ide\\brain\\37977922-aa2c-4bf6-a930-8a5f84fbc5da\\ola_s1_pro_1780393790481.png',
    dest: path.join(targetDir, 'ola-s1-pro.webp')
  },
  {
    src: 'C:\\Users\\Amritansh\\.gemini\\antigravity-ide\\brain\\37977922-aa2c-4bf6-a930-8a5f84fbc5da\\tvs_jupiter_1780393808262.png',
    dest: path.join(targetDir, 'tvs-jupiter.webp')
  },
  {
    src: 'C:\\Users\\Amritansh\\.gemini\\antigravity-ide\\brain\\37977922-aa2c-4bf6-a930-8a5f84fbc5da\\royal_enfield_1780393825455.png',
    dest: path.join(targetDir, 'royal-enfield-classic-350.webp')
  },
  {
    src: 'C:\\Users\\Amritansh\\.gemini\\antigravity-ide\\brain\\37977922-aa2c-4bf6-a930-8a5f84fbc5da\\bajaj_chetak_ev_1780393839988.png',
    dest: path.join(targetDir, 'bajaj-chetak-ev.webp')
  }
]

filesToCopy.forEach(f => {
  try {
    if (fs.existsSync(f.src)) {
      fs.copyFileSync(f.src, f.dest)
    }
  } catch (err) {
    console.error('Failed to copy vehicle image:', err)
  }
})

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  }
})

