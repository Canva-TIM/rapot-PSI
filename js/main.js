async function cariRapor() {
  let nisn = document.getElementById("nisn").value.trim();
  if (!nisn) {
    alert("Masukkan NISN atau NIS");
    return;
  }

  // Ganti URL ini dengan URL Web App Google Apps Script kamu
  let apiURL = "https://script.google.com/macros/s/AKfycbzh-MV7VnhDHJh6dqp9utKw-cLy0BXLZhS-XHTpbMHWPdK623MpNGxfN3LWu_rdlVY6/exec?nisn=" + nisn;

  try {
    document.getElementById("floating-loading").style.display = "block";
    let res = await fetch(apiURL);
    let data = await res.json();
    document.getElementById("floating-loading").style.display = "none";

    if (data && data["NISN"]) {
      localStorage.setItem("raporData", JSON.stringify(data));
      window.location.href = "rapor.html";
    } else {
      alert("Data tidak ditemukan. Periksa kembali NISN/NIS.");
    }
  } catch (err) {
    document.getElementById("floating-loading").style.display = "none";
    alert("Gagal mengambil data: " + err);
  }
}
