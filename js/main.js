// 🌐 Variabel Global untuk URL Apps Script
const BASE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxNuV2WaPEsn3M0UzvQiLdX0kqLEKS1Jxg4_oSvMwjOeoS25UZWqUg0jms6Zp0viVfL/exec";
let pdfUrl = "";  // Variabel untuk menyimpan URL PDF

async function cariRapor() {
    const nisn = document.getElementById("nisn").value.trim();
    const loadingScreen = document.getElementById("floating-loading");
//    const pesan = document.getElementById("pesan");
    
    if (!nisn) {
        showToast("❌ NISN Tidak Boleh Kosong.");
        return;
    }
    
    loadingScreen.style.display = "block"; // Tampilkan floating loading
    
    try {
        console.log("📡 Mengirim request ke Apps Script...");
        const response = await fetch(`${BASE_SCRIPT_URL}?nisn=${encodeURIComponent(nisn)}`);
        const result = await response.json();  // Parsing JSON
        
        console.log("✅ Response diterima:", result);
        
        if (result.log) {
            console.log("📝 Log dari Apps Script:");
            result.log.forEach(log => console.log(log));
        
            // 🛠️ Tambahkan Log ke Halaman Web
            const logContainer = document.getElementById("log");
            logContainer.innerHTML = "<h4>Log:</h4><pre>" + result.log.join("\n") + "</pre>";
        }

        loadingScreen.style.display = "none"; // Sembunyikan floating loading setelah selesai
        
        if (result.status === "success" && result.data && result.data.url) {
            pdfUrl = result.data.url;  // Simpan URL PDF
            document.getElementById("modal").style.display = "flex";  // Tampilkan modal
        } else {
            showToast("❌ Rapor tidak di temukan atau NISN salah.");
        }
    } catch (error) {
        loadingScreen.style.display = "none"; // Sembunyikan floating loading setelah selesai
        showToast("❌ Terjadi Kesalahan, coba lagi.");
        console.error("❌ Terjadi error:", error);
    }
}

// Tombol "Unduh"
document.getElementById("unduhBtn").onclick = () => {
    document.getElementById("modal").style.display = "none";
    window.open(pdfUrl, "_blank");  // Buka URL PDF di tab baru
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
