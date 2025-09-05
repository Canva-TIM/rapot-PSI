const DATA_URL = "https://script.google.com/macros/s/AKfycbx6FLes1bzwa5MdNyn7wYhiyBPTpk1P4GyBWNE_rU-c3hE8r0pHfRNEm7NQ8I_Srzff/exec";

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
async function cariRapor() {
    let inputId = document.getElementById("nisn").value.trim();
    if (!inputId) { 
        showToast("❌ NISN/NIS Tidak Boleh Kosong", "error"); 
        return; 
    }

    try {
        showLoading(true);

        // 🚀 langsung kirim sebagai ?id=, server yang tentukan cocok ke NIS / NISN
        const res = await fetch(`${DATA_URL}?id=${encodeURIComponent(inputId)}`);
        const data = await res.json();

        showLoading(false);

        if (data && data.length > 0) {
            const siswa = data[0];
            localStorage.setItem("raporData", JSON.stringify(siswa));

            const modal = document.getElementById("modal");
            modal.classList.add("show-modal");
            document.getElementById("modal-info").innerText =
                "Rapor atas nama " + (siswa["Nama Peserta Didik"] || "") + " ditemukan!";

            document.getElementById("lihatBtn").onclick = () => {
                modal.classList.remove("show-modal");
                window.location.href = "rapor.html";
            };

            document.getElementById("unduhBtn").onclick = () => {
                modal.classList.remove("show-modal");
                window.open("rapor.html?dl=1", "_blank");
            };

            document.getElementById("closeBtn").onclick = () => modal.classList.remove("show-modal");
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



