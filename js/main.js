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
    let input = document.getElementById("nisn").value.trim();
    if (!input) { 
        showToast("❌ NISN/NIS tidak boleh kosong", "error"); 
        return; 
    }

    let queryParam = "";
    if (input.length >= 9) {
        // Anggap ini NISN
        input = normalisasiNISN(input);
        queryParam = `nisn=${encodeURIComponent(input)}`;
    } else {
        // Anggap ini NIS
        queryParam = `nis=${encodeURIComponent(input)}`;
    }

    try {
        showLoading(true);

        const res = await fetch(`${DATA_URL}?${queryParam}`);
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
            modal.onclick = (e) => { if (e.target === modal) modal.classList.remove("show-modal"); };

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

