const DATA_URL = "https://script.google.com/macros/s/AKfycbyjjxtr3BEaipNC2dFz3nYDdveapw1B5dBIJBTwtJhjcuLdfORPtJgoic39irmG28Q/exec";

// Tampilkan loading
function showLoading(show=true) {
    const loading = document.getElementById("floating-loading");
    if(loading) loading.style.display = show ? "block" : "none";
}

// Fungsi untuk menampilkan toast
function showToast(message, type="success") {
    const toast = document.getElementById("toast");
    toast.className = "toast " + type; 
    toast.innerText = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000); // hilang setelah 3 detik
}

// Fungsi normalisasi NISN/NIS (pastikan 10 digit)
// Cari rapor per NISN/NIS langsung fetch ke server
async function cariRapor() {
    let input = document.getElementById("nisn").value.trim();
    if (!input) { 
        showToast("❌ NISN/NIS tidak boleh kosong", "error"); 
        return; 
    }

    try {
        showLoading(true);

        let data = [];

        // 1️⃣ Coba cari berdasarkan NISN
        let res = await fetch(`${DATA_URL}?nisn=${encodeURIComponent(input)}`);
        data = await res.json();

        // 2️⃣ Kalau tidak ketemu, coba pakai NIS
        if (!data || data.length === 0) {
            res = await fetch(`${DATA_URL}?nis=${encodeURIComponent(input)}`);
            data = await res.json();
        }

        showLoading(false);

        if (data && data.length > 0) {
            const siswa = data[0];
            localStorage.setItem("raporData", JSON.stringify(siswa));

            const modal = document.getElementById("modal");
            modal.classList.add("show-modal");
            document.getElementById("modal-info").innerText =
                "Rapor atas nama " + (siswa["Nama Peserta Didik"] || "") + " ditemukan!";

            // Tombol lihat
            document.getElementById("lihatBtn").onclick = () => {
                modal.classList.remove("show-modal");
                window.location.href = "rapor.html";
            };

            // Tombol unduh langsung PDF
            document.getElementById("unduhBtn").onclick = () => {
                modal.classList.remove("show-modal");
                window.open("rapor.html?dl=1", "_blank");
            };

            // Close modal
            document.getElementById("closeBtn").onclick = () => modal.classList.remove("show-modal");

            // Klik overlay
            modal.onclick = (e) => { if(e.target === modal) modal.classList.remove("show-modal"); };

        } else {
            showToast("❌ Rapor tidak ditemukan atau NISN/NIS salah", "error");
        }
    } catch (err) {
        showLoading(false);
        console.error("Gagal fetch data:", err);
        showToast("⚠️ Gagal mengambil data dari server", "error");
    }
}



// Inisialisasi
window.onload = () => {
    const cariBtn = document.querySelector(".form-submit");
    if(cariBtn) cariBtn.onclick = cariRapor;
};


