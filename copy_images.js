import fs from 'fs';
import path from 'path';

const targetDir = 'public/images';
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const files = [
  {
    src: 'C:\\Users\\Amritansh\\.gemini\\antigravity-ide\\brain\\37977922-aa2c-4bf6-a930-8a5f84fbc5da\\activa_6g_1780393760605.png',
    dest: 'public/images/activa-6g.webp'
  },
  {
    src: 'C:\\Users\\Amritansh\\.gemini\\antigravity-ide\\brain\\37977922-aa2c-4bf6-a930-8a5f84fbc5da\\ather_450x_1780393775486.png',
    dest: 'public/images/ather-450x.webp'
  },
  {
    src: 'C:\\Users\\Amritansh\\.gemini\\antigravity-ide\\brain\\37977922-aa2c-4bf6-a930-8a5f84fbc5da\\ola_s1_pro_1780393790481.png',
    dest: 'public/images/ola-s1-pro.webp'
  },
  {
    src: 'C:\\Users\\Amritansh\\.gemini\\antigravity-ide\\brain\\37977922-aa2c-4bf6-a930-8a5f84fbc5da\\tvs_jupiter_1780393808262.png',
    dest: 'public/images/tvs-jupiter.webp'
  },
  {
    src: 'C:\\Users\\Amritansh\\.gemini\\antigravity-ide\\brain\\37977922-aa2c-4bf6-a930-8a5f84fbc5da\\royal_enfield_1780393825455.png',
    dest: 'public/images/royal-enfield-classic-350.webp'
  },
  {
    src: 'C:\\Users\\Amritansh\\.gemini\\antigravity-ide\\brain\\37977922-aa2c-4bf6-a930-8a5f84fbc5da\\bajaj_chetak_ev_1780393839988.png',
    dest: 'public/images/bajaj-chetak-ev.webp'
  }
];

files.forEach(f => {
  try {
    fs.copyFileSync(f.src, f.dest);
    console.log(`Copied ${path.basename(f.src)} to ${f.dest}`);
  } catch (err) {
    console.error(`Failed to copy ${f.src}: ${err.message}`);
  }
});
