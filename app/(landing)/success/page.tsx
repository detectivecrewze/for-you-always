import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-100">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-slate-800 mb-3">
          Pembayaran Berhasil!
        </h1>
        
        <p className="text-slate-600 mb-8 leading-relaxed">
          Terima kasih atas pesanan Anda. Kami sedang memproses transaksi ini dan mengirimkan <span className="font-semibold text-rose-600">Magic Link</span> ke email Anda. Silakan cek kotak masuk atau folder spam Anda dalam beberapa saat.
        </p>

        <Link
          href="/"
          className="inline-block w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02]"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
