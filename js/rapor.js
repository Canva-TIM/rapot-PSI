function safeSet(id, val) {
  const el = document.getElementById(id);
  if(el) el.innerText = val || "";
}

function tambahBaris(tabelId, no, mapel, nilai, deskripsi) {
  const table = document.getElementById(tabelId);
  const row = table.insertRow(-1);
  row.innerHTML = `<td class="col-no">${no}</td>
                   <td class="col-mapel">${mapel}</td>
                   <td class="col-nilai text-center">${nilai}</td>
                   <td class="col-capai">${deskripsi}</td>`;
}

function normalizeFileName(name) {
  // Ganti semua karakter selain huruf dan angka dengan underscore
  return name.replace(/[^a-zA-Z0-9]/g,"_") + ".png";
}

function isiRapor(data) {
  // Identitas
  safeSet("nama_siswa", data["Nama Peserta Didik"]);
  safeSet("kelas", data["Kelas"]);
  safeSet("nisn", data["NISN"]);
  safeSet("nis", data["NIS"]);
  safeSet("fase", data["Fase"]);
  safeSet("semester", data["Semester"]);
  safeSet("tahun_ajaran", data["Tahun Ajaran"]);
  safeSet("tanggal", data["Tanggal"]);

  // Nilai Kelompok A
  const mapelA = [
    ["Pendidikan Agama Islam dan Budi Pekerti","Nilai PAI","Deskripsi PAI"],
    ["Pancasila","Nilai PKN","Deskripsi PKN"],
    ["Bahasa Inggris","Nilai B. Inggris","Deskripsi B. Inggris"],
    ["Ilmu Pengetahuan Alam dan Sosial","Nilai IPAS","Deskripsi IPAS"],
    ["Matematika","Nilai MTK","Deskripsi MTK"],
    ["Bahasa Arab","Nilai B. Arab","Deskripsi B. Arab"],
    ["Pendidikan Jasmani, Olahraga, dan Kesehatan","Nilai PJOK","Deskripsi PJOK"],
    ["Bahasa Indonesia","Nilai B.INDO","Deskripsi B.INDO"],
    ["TIK/Informatika","Nilai TIK","Deskripsi TIK"]
  ];
  mapelA.forEach((m,i)=> tambahBaris("tabelKelA", i+1, m[0], data[m[1]], data[m[2]]));

  // Nilai Kelompok B
  const mapelB = [
    ["Adab, Hadits dan Do'a (AHD)","Nilai AHD","Deskripsi AHD"],
    ["T2Q","Nilai T2Q","Deskripsi T2Q"],
    ["Sirah","Nilai SIROH","Deskripsi SIROH"]
  ];
  mapelB.forEach((m,i)=> tambahBaris("tabelKelB", i+1, m[0], data[m[1]], data[m[2]]));

  // Ekstrakurikuler
  for(let i=1;i<=3;i++){
    const ekskul = data[`Ekskul ${i}`] || data[`Ekstrakurikuler ${i}`] || "";
    const pred = data[`Predikat ${i}`] || "";
    const ket = data[`Keterangan ${i}`] || "";
    const table = document.getElementById("tabelEkskul");
    const row = table.insertRow(-1);
    row.innerHTML = `<td>${i}</td><td>${ekskul}</td><td class="text-center">${pred}</td><td class="text-center">${ket}</td>`;
  }

  // Catatan & ketidakhadiran
  safeSet("catatan_guru", data["Catatan Guru"]);
  safeSet("sakit", data["S"] || data["Sakit"] || "0");
  safeSet("izin", data["I"] || data["Izin"] || "0");
  safeSet("alpa", data["A"] || data["Alpa"] || "0");

  // Wali siswa tetap kosong
  document.getElementById("ttd_wali").style.display = "none";
  safeSet("nama_wali","................................");

  // Wali kelas → otomatis dari nama di database
  const waliKelas = data["Wali Kelas"] || "";
  document.getElementById("wali_kelas").innerText = waliKelas;

  // Ambil ttd wali kelas dari folder "images/" dengan nama file dinormalisasi
  const fileName = normalizeFileName(waliKelas);
  document.getElementById("ttd_wali_kelas").src = "images/" + fileName;

  // Kepala sekolah & cap
  document.getElementById("ttd_kepala").src = "images/ttd_kepala.png";
  document.getElementById("cap_sekolah").src = "images/cap_sekolah.png";
}


// Auto load data dari localStorage (contoh)
window.onload = () => {
  const data = JSON.parse(localStorage.getItem("raporData") || "{}");
  isiRapor(data);

  // Jika url ada ?dl=1 → otomatis download PDF
  if(window.location.search.includes("dl=1")){
    setTimeout(()=> {
      const el = document.getElementById('pdf-content');
      html2pdf().set({
        margin: [0.566,1,0.212,1], unit:'cm',
        filename:(document.getElementById('nama_siswa').innerText||'rapor')+'.pdf',
        image:{type:'jpeg',quality:0.98},
        html2canvas:{scale:4,useCORS:true},
        jsPDF:{unit:'cm', format:[21.59,33.02], orientation:'portrait'}
      }).from(el).save();
    },500);
  }
};
