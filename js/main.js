const DATA_URL = "https://script.google.com/macros/s/AKfycbxqC-ryQgdeSkKH4nTgTTO5rz-j377sbK0MUa36zbooy_q9r8zSR_7BmxTOHtOuROUL/exec";

let allData = [];

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

// Fetch semua data dari Google Sheet
async function fetchAllData() {
    try {
        showLoading(true);
        const res = await fetch(DATA_URL);
        const data = await res.json();
        
        // Normalisasi semua NISN & NIS
        allData = (Array.isArray(data) ? data : []).map(d => {
            return {
                ...d,
                "NISN": normalisasiNISN(d["NISN"]),
                "NIS": normalisasiNISN(d["NIS"])
            };
        });

        localStorage.setItem("allRaporData", JSON.stringify(allData));
        showLoading(false);
        console.log("Data rapor ter-update:", allData.length, "siswa");
        showToast("✅ Data siap! Silakan masukkan NISN atau NIS.", "success");
    } catch(err) {
        showLoading(false);
        console.error("Gagal fetch data:", err);
    }
}

// Cari rapor per NISN/NIS
function cariRapor() {
    let nisnInput = document.getElementById("nisn").value.trim();
    if(!nisnInput){ 
        showToast("❌ NISN/NIS Tidak Boleh Kosong", "error"); 
        return; 
    }

    // Normalisasi input
    nisnInput = normalisasiNISN(nisnInput);

    // Tampilkan loading saat pencarian
    showLoading(true);

    setTimeout(() => {
        const data = allData.find(d => 
            normalisasiNISN(d["NISN"]) === nisnInput || 
            normalisasiNISN(d["NIS"]) === nisnInput
        );

        showLoading(false);

        if(data){
            localStorage.setItem("raporData", JSON.stringify(data));

            const modal = document.getElementById("modal");
            modal.classList.add("show-modal");
            document.getElementById("modal-info").innerText =
                "Rapor atas nama " + (data["Nama Peserta Didik"] || "") + " ditemukan!";

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
    }, 200);
}

// Inisialisasi
window.onload = async () => {
    const cachedData = JSON.parse(localStorage.getItem("allRaporData") || "[]");
    if(cachedData.length) allData = cachedData;

    await fetchAllData();

    // Refresh tiap 2 menit
    setInterval(fetchAllData, 2 * 60 * 1000);

    // Tombol cari
    const cariBtn = document.querySelector(".form-submit");
    if(cariBtn) cariBtn.onclick = cariRapor;
};
