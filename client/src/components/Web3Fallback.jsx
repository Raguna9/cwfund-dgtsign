import { useEffect } from "react";

function Web3Fallback() {
    useEffect(() => {
        const initializeWeb3 = async () => {
            if (typeof window.ethereum == "undefined") {
                window.location.reload();
            }
        };
        initializeWeb3();
    }, []);

    const handleRefreshClick = () => {
        window.location.reload();
    };

    return (
        <div className="bg-gray-50 h-screen flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold mb-4">
                Gagal terhubung ke Web3
            </h1>
            <p className="text-lg mb-8">
                Tolong hubungkan akun metamask anda untuk dapat melanjutkan, Klik "Refresh" jika anda sudah terhubung atau halaman pop up metamask belum muncul.
            </p>
            <button
                onClick={handleRefreshClick}
                className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
            >
                Refresh
            </button>
        </div>
    );
}

export default Web3Fallback;