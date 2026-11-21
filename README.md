# Taman Senja — Cari Perbedaannya

[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/stfu-onad/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/stfu-onad/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

Game cari perbedaan (*spot the difference*) orisinal untuk bounty [best-spot-the-difference-game-20261121-0451](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451) di make.fun. Dua gambar nyaris identik berdampingan — temukan 8 perbedaan di setiap level sebelum waktu habis.

## Cara main

- **Mouse:** klik perbedaan di gambar kiri atau kanan. Lingkaran hijau + centang menandai yang sudah ketemu.
- **Keyboard:** tombol panah menggerakkan penanda, **Enter** memeriksa, **H** petunjuk (−25 poin), **R** ulang, **M** suara.
- **Aturan:** tiap temuan +100 poin, klik salah −5 poin, sisa waktu jadi bonus (+10/detik). 3 petunjuk per level.

## Level

1. **Taman Senja** — rumah, kolam, kucing, dan kupu-kupu di senja hari (120 detik)
2. **Pantai Senja** — perahu, palem, kepiting, dan payung di tepi laut (105 detik)
3. **Pasar Malam** — warung, lampion, dan gerobak di bawah bulan (90 detik)

## Menjalankan

```sh
node serve.ts   # lalu buka http://localhost:8080
```

Game statis tanpa build step: `game/index.html` + modul ES di bawah `game/`, tanpa library dan tanpa request network. Semua gambar, suara (WebAudio), dan adegan digambar prosedural dari kode — tanpa aset eksternal.

## Entri

`main.ts` di root menyalin `game/` dan `screenshots/` ke `/output` dan menulis `/output/dossier.json` dengan `buildDossier` dari `vendor/makefun-game.ts`.
