# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Installation Guide

Untuk menjalankan aplikasi di mesin lokal, ikuti langkah-langkah dibawah:
Clone repository dan install dependensi yang dibutuhkan. Saya menggunakan `npm` untuk mengelola package, jadi usahakan anda sudah melakukan instalasi Node.js.
```bash
git clone https://github.com/Raguna9/cwfund-dgtsign.git

cd cwfund-dgtsign
```
Install dependency pada root folder
```bash
npm install
```
Lakukan konfigurasi untuk file .env, jaringan yang digunakan secara default adalah sepolia pastikan anda mempunyai saldo sepETH, jika ingin mengganti jaringan bisa melalui file truffle-config.js
Deploy contract
```bash
truffle migrate --network sepolia
```

Selanjutnya jalankan aplikasi
```bash
cd client 

npm install

npm run dev
```
