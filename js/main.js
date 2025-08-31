// URL endpoint Google Apps Script
const API_ALL = "https://script.google.com/macros/s/AKfycbxiIfP0kPXezHWvJfh5qkTLaCu7aw9Y-JihQTOF2mO6hjhDSP7w1k-qllMJsuEOtdGi/exec"; // ganti dengan milikmu

// Fungsi preload data
async function preloadData() {
    try {
        const res = await fetch(API_ALL);
        const allData = await res.json();
        localStorage.setItem("allRaporData", JSON.stringify(allData));
        console.log("Data rapor diupdate:", new Date().toLocaleTimeString());
    } catch(err) {
        console.error("Gagal preload data:", err);
    }
}

// Jalankan preload pertama kali saat halaman dibuka
preloadData();

// Update otomatis setiap 5 menit
setInterval(preloadData, 5 * 60 * 1000);

// Fungsi pencarian cepat dari localStorage
function cariRapor() {
    let nisnInput = document.getElementById("nisn").value.trim();
    if (!nisnInput) { alert("Masukkan NISN atau NIS"); return; }

    const allData = JSON.parse(localStorage.getItem("allRaporData") || "[]");
    const data = allData.find(d => d["NISN"] == nisnInput || d["NIS"] == nisnInput);

    if(!data){
        alert("Data tidak ditemukan. Periksa kembali NISN/NIS.");
        return;
    }

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
        // langsung download di halaman utama
        downloadRaporPDF();
    };

    // Close modal
    document.getElementById("closeBtn").onclick = () => modal.classList.remove("show-modal");

    // klik overlay
    modal.onclick = (e) => { if(e.target === modal) modal.classList.remove("show-modal"); };
};
