async function cariRapor() {
    let nisn = document.getElementById("nisn").value.trim();
    if (!nisn) { alert("Masukkan NISN atau NIS"); return; }

    const apiURL = "https://script.google.com/macros/s/AKfycbzh-MV7VnhDHJh6dqp9utKw-cLy0BXLZhS-XHTpbMHWPdK623MpNGxfN3LWu_rdlVY6/exec?nisn=" + encodeURIComponent(nisn);

    try {
        document.getElementById("floating-loading").style.display = "block";
        const res = await fetch(apiURL);
        const data = await res.json();
        document.getElementById("floating-loading").style.display = "none";

        if(data && data["NISN"]) {
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
                window.open("rapor.html", "_blank"); // buka rapor.html → auto download
            };

            // Close modal
            document.getElementById("closeBtn").onclick = () => modal.classList.remove("show-modal");

            // klik overlay
            modal.onclick = (e) => { if(e.target === modal) modal.classList.remove("show-modal"); };

        } else {
            alert("Data tidak ditemukan. Periksa kembali NISN/NIS.");
        }
    } catch(err) {
        document.getElementById("floating-loading").style.display = "none";
        alert("Gagal mengambil data: " + err);
    }
}




