async function cariRapor() {
  let nisn = document.getElementById("nisn").value.trim();
  if (!nisn) {
    alert("Masukkan NISN atau NIS");
    return;
  }

  let apiURL =
    "https://script.google.com/macros/s/AKfycbzh-MV7VnhDHJh6dqp9utKw-cLy0BXLZhS-XHTpbMHWPdK623MpNGxfN3LWu_rdlVY6/exec?nisn=" +
    nisn;

  try {
    document.getElementById("floating-loading").style.display = "block";
    let res = await fetch(apiURL);
    let data = await res.json();
    document.getElementById("floating-loading").style.display = "none";

    if (data && data["NISN"]) {
      // simpan data ke localStorage
      localStorage.setItem("raporData", JSON.stringify(data));

      // tampilkan modal
      document.getElementById("modal").style.display = "block";
      document.getElementById("modal-title").innerText = "Rapor Ditemukan!";
      document.getElementById("modal-info").innerText =
        "Data atas nama: " + data["Nama Peserta Didik"];

      // tombol lihat
      document.getElementById("lihatBtn").onclick = () => {
        window.location.href = "rapor.html";
      };

      // tombol unduh → auto print
      document.getElementById("unduhBtn").onclick = () => {
        window.open("rapor.html?print=1", "_blank");
      };

      // tombol close
      document.getElementById("closeBtn").onclick = () => {
        document.getElementById("modal").style.display = "none";
      };
    } else {
      alert("Data tidak ditemukan. Periksa kembali NISN/NIS.");
    }
  } catch (err) {
    document.getElementById("floating-loading").style.display = "none";
    alert("Gagal mengambil data: " + err);
  }
}
