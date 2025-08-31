const DATA_URL = "https://script.google.com/macros/s/AKfycbwUB1t_7tftbSocO9CX8NOsuMoxBaoMn0E5U9ZsTz_jN9vY5isRP69dtBH1CRW3jT9b/exec";

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


// Fetch semua data dari Google Sheet
async function fetchAllData() {
    try {
        showLoading(true);
        const res = await fetch(DATA_URL);
        const data = await res.json();
        allData = Array.isArray(data) ? data : [];
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
    const nisnInput = document.getElementById("nisn").value.trim();
    if(!nisnInput){ 
        showToast("❌ NISN/NIS Tidak Boleh Kosong", "error"); 
        return; 
    }


    // Tampilkan loading saat pencarian
    showLoading(true);

    // Simulasi delay kecil supaya spinner terlihat
    setTimeout(() => {
        const data = allData.find(d => d["NISN"] === nisnInput || d["NIS"] === nisnInput);

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

            // klik overlay
            modal.onclick = (e) => { if(e.target === modal) modal.classList.remove("show-modal"); };

        } else {
            showToast("❌ Rapor tidak ditemukan atau NISN/NIS salah", "error");
        }
    }, 200); // delay 200ms supaya spinner muncul
}


// Inisialisasi
window.onload = async () => {
    // Load data dari cache jika ada
    const cachedData = JSON.parse(localStorage.getItem("allRaporData") || "[]");
    if(cachedData.length) allData = cachedData;

    // Fetch data terbaru di background
    await fetchAllData();

    // Refresh tiap 5 menit
    setInterval(fetchAllData, 2 * 60 * 1000);

    // Tombol cari
    const cariBtn = document.querySelector(".form-submit");
    if(cariBtn) cariBtn.onclick = cariRapor;
};



