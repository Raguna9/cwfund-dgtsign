import React from 'react';
import NavigationBar from '../components/NavigationBar'

const Home = () => {

    return (
        <>
            <NavigationBar />
            <div className="px-8 py-6 max-w-full mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-4">
                    <div className="text-center mb-2">
                        <h2 className="text-4xl font-bold mb-2">
                            Selamat Datang di Aplikasi Donasi Terdesentralisasi
                        </h2>
                        <img className='mx-auto' src="/donasi.png" title="Fundraisers" alt="Fundraisers" width="200" height="200" />
                    </div>
                    <div className="max-w-xl mx-auto text-center">
                        <p className="mb-2">
                            Aplikasi donasi terdesentralisasi ini merupakan aplikasi untuk membuat penggalangan dana dan melakukan donasi ke daftar penggalangan dana yang dipilih, semua aksi dan transaksi pada aplikasi ini berbasis pada jaringan blockchain Ethereum dan menggunakan ETH (mata uang ethereum) untuk melakukan donasi.
                        </p>
                        <p className="mb-2">
                            Sebagai pembuat penggalangan dana, anda dapat mengatur dana yang terkumpul serta memodifikasi rincian pada  penggalangan dana yang anda buat. Pengguna lain dapat melakukan donasi pada penggalangan dana, dan anda bertindak sebagai kustodian pada penggalangan dana ini. Anda dapat menarik dana yang sudah terkumpul ke akun penerima dana yang dipilih.
                        </p>
                        <p className="mb-2">
                            Lihat daftar penggalangan dana yang sudah dibuat di menu <strong>Donasi</strong> dan tekan tombol <strong>Buat</strong> untuk membuat penggalangan dana baru.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
