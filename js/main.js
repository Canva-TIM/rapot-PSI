// 🌐 Variabel Global untuk URL Apps Script
const BASE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyS3MYLwHGr1ivzFv5-20Jl3CfOJ9wxXleMrjNKpq3wXTHdOtrHhWTJvKOiJa36uvH2/exec";
let pdfUrl = "";  // Variabel untuk menyimpan URL PDF

let namaSiswa = "";  // Deklarasikan di sini agar bisa diakses di seluruh script

async function cariRapor() {
    const inputId = document.getElementById("nisn").value.trim();
    const loadingScreen = document.getElementById("floating-loading");

    if (!inputId) {
        showToast("❌ NISN/NIS Tidak Boleh Kosong.");
        return;
    }

    loadingScreen.style.display = "block";

    try {
        const response = await fetch(`${BASE_SCRIPT_URL}?nisn=${encodeURIComponent(inputId)}`);
        const result = await response.json();

        loadingScreen.style.display = "none";

        if (result.status === "success" && result.data && result.data.url) {
            pdfUrl = result.data.url;
            namaSiswa = result.data.nama || "-";  // Simpan nama siswa

            document.getElementById("modal-title").innerText = `Rapor Ananda ${namaSiswa} Ditemukan!`;
            document.getElementById("modal").style.display = "flex";
        } else {
            showToast("❌ Rapor tidak ditemukan atau NISN/NIS salah.");
        }
    } catch (error) {
        loadingScreen.style.display = "none";
        showToast("❌ Terjadi Kesalahan, coba lagi.");
    }
}


document.getElementById("unduhBtn").onclick = () => {
    try {
        document.getElementById("modal").style.display = "none";

        if (!pdfUrl) {
            showToast("❌ URL PDF tidak tersedia.");
            return;
        }

        // Pastikan pdfUrl sudah mengarah ke file PDF yang benar
        const a = document.createElement('a');
        a.href = pdfUrl;
        a.download = `Rapor-${namaSiswa.replace(/\s+/g, "_")}.pdf`; // Nama file dinamis
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } catch (error) {
        showToast("❌ Terjadi Kesalahan saat mengunduh.");
        console.error("Error saat klik Unduh:", error);
    }
};


// Tombol "unduh"
//document.getElementById("unduhBtn").onclick = () => {
//    document.getElementById("modal").style.display = "none";
    // const viewerUrl = `https://docs.google.com/viewerng/viewer?url=${encodeURIComponent(pdfUrl)}`;
//    window.open(pdfUrl, "_blank");
//};

// Tombol "lihat"
document.getElementById("lihatBtn").onclick = () => {
    document.getElementById("modal").style.display = "none";
    const viewerUrl = `https://docs.google.com/viewerng/viewer?url=${encodeURIComponent(pdfUrl)}`;
    window.open(viewerUrl, "_blank");
};

// Tombol "Close"
document.getElementById("closeBtn").onclick = () => {
    document.getElementById("modal").style.display = "none";  // Tutup modal
};

// Tutup Modal jika klik di luar konten modal
window.onclick = function(event) {
    const modal = document.getElementById("modal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

async function cekCache() {
    try {
        const response = await fetch(`${BASE_SCRIPT_URL}?checkCache=true`);
        const result = await response.json();
        
        if (result.status === "ready") {
            showToast("✅ Data siap! Silakan masukkan NISN.");
        } else {
            showToast("⚠️ Data sedang diperbarui, harap tunggu sebentar...");
        }
    } catch (error) {
        showToast("❌ Gagal mengecek cache, coba lagi nanti.");
        console.error("Error cek cache:", error);
    }
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.style.display = "block";
    
    setTimeout(() => {
        toast.style.display = "none";
    }, 5000);  // Sembunyikan setelah 5 detik
}

window.onload = cekCache;
