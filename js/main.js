async function cariRapor() {
  let nisn = document.getElementById("nisn").value.trim();
  if (!nisn) {
    alert("Masukkan NISN atau NIS");
    return;
  }

  let apiURL = "https://script.google.com/macros/s/AKfycbzh-MV7VnhDHJh6dqp9utKw-cLy0BXLZhS-XHTpbMHWPdK623MpNGxfN3LWu_rdlVY6/exec?nisn=" + encodeURIComponent(nisn);

  try {
    document.getElementById("floating-loading").style.display = "block";
    let res = await fetch(apiURL);
    let data = await res.json();
    document.getElementById("floating-loading").style.display = "none";

    if (data && data["NISN"]) {
      // simpan data dan tampilkan modal
      localStorage.setItem("raporData", JSON.stringify(data));

      const modal = document.getElementById("modal");
      modal.classList.add("show-modal"); // tampilkan modal (display:flex via class)
      document.getElementById("modal-info").innerText =
        "Rapor atas nama " + (data["Nama Peserta Didik"] || "") + " ditemukan!";

      // tombol lihat
      document.getElementById("lihatBtn").onclick = () => {
        modal.classList.remove("show-modal");
        window.location.href = "rapor.html";
      };

      // Tombol unduh (langsung PDF)
      document.getElementById("unduhBtn").onclick = () => {
        window.location.href = "rapor.html?dl=1";
      };
        // 🔹 Tombol Cetak → langsung unduh PDF (bukan print preview)
      document.getElementById("cetakBtn").onclick = () => {
        window.location.href = "rapor.html?dl=1";
      };


      // tombol close
      document.getElementById("closeBtn").onclick = () => {
        modal.classList.remove("show-modal");
      };

      // tutup modal kalau klik overlay (di luar #modal-content)
      modal.onclick = (e) => {
        if (e.target === modal) modal.classList.remove("show-modal");
      };

    } else {
      alert("Data tidak ditemukan. Periksa kembali NISN/NIS.");
    }
  } catch (err) {
    document.getElementById("floating-loading").style.display = "none";
    alert("Gagal mengambil data: " + err);
  }
}


