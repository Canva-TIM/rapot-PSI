const DATA_URL = "https://script.google.com/macros/s/AKfycbxqC-ryQgdeSkKH4nTgTTO5rz-j377sbK0MUa36zbooy_q9r8zSR_7BmxTOHtOuROUL/exec";

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
function normalisasiNISN(nisn) {
    if(!nisn) return "";
    nisn = String(nisn).trim();
    if (nisn.length === 9) {
        nisn = "0" + nisn;
    }
    return nisn;
}

// Cari rapor per NISN/NIS langsung fetch ke server
async function cariRapor() {
    let nisnInput = document.getElementById("nisn").value.trim();
    if(!nisnInput){ 
        showToast("❌ NISN/NIS tidak boleh kosong", "error"); 
        return; 
    }

    // Normalisasi input
    nisnInput = normalisasiNISN(nisnInput);

    try {
        showLoading(true);

        // Fetch hanya data sesuai NISN
        const res = await fetch(`${DATA_URL}?nisn=${encodeURIComponent(nisnInput)}`);
        const data = await res.json();

        showLoading(false);

        if(data && data.length > 0){
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
