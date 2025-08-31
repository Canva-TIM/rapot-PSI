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
    return name.replace(/[^a-zA-Z0-9]/g,"_")
               .replace(/_+/g,"_")
               .replace(/^_|_$/g,"")
               .toLowerCase() + ".png";
}

function formatTanggalIndo(dateString) {
    if(!dateString) return "";
    const bulanIndo = ["Januari","Februari","Maret","April","Mei","Juni",
                       "Juli","Agustus","September","Oktober","November","Desember"];
    const date = new Date(dateString);
    if(isNaN(date)) return dateString;
    return `${date.getDate()} ${bulanIndo[date.getMonth()]} ${date.getFullYear()}`;
}

function isiRapor(data) {
    if(!data || !data["NISN"]) return; // jika data kosong, hentikan

    // Identitas
    safeSet("nama_siswa", data["Nama Peserta Didik"]);
    safeSet("kelas", data["Kelas"]);
    safeSet("nisn", data["NISN"]);
    safeSet("nis", data["NIS"]);
    safeSet("fase", data["Fase"]);
    safeSet("semester", data["Semester"]);
    safeSet("tahun_ajaran", data["Tahun Ajaran"]);
    safeSet("tanggal", formatTanggalIndo(data["Tanggal"]));

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
        const ekskul = data[`Ekskul ${i}`] || "";
        const pred = data[`Predikat ${i}`] || "";
        const ket = data[`Keterangan ${i}`] || "";
        const table = document.getElementById("tabelEkskul");
        const row = table.insertRow(-1);
        row.innerHTML = `
            <td class="col-no text-center">${i}</td>
            <td>${ekskul}</td>
            <td class="col-nilai text-center">${pred}</td>
            <td class="col-capai text-center">${ket}</td>`;
    }

    // Catatan & ketidakhadiran
    safeSet("catatan_guru", data["Catatan Guru"]);
    safeSet("sakit", data["S"] || data["Sakit"] || "0");
    safeSet("izin", data["I"] || data["Izin"] || "0");
    safeSet("alpa", data["A"] || data["Alpa"] || "0");

    // Wali siswa tetap kosong
    document.getElementById("ttd_wali").style.display = "none";
    safeSet("nama_wali","................................");

    // Wali kelas
    const waliKelas = data["Wali Kelas"] || "";
    document.getElementById("wali_kelas").innerText = waliKelas;
    document.getElementById("ttd_wali_kelas").src = "images/" + normalizeFileName(waliKelas);

    // Kepala sekolah & cap
    document.getElementById("ttd_kepala").src = "images/ttd_kepala.png";
    document.getElementById("cap_sekolah").src = "images/cap_sekolah.png";
}

// Fungsi download PDF
function downloadPDF() {
    const el = document.getElementById('pdf-content');
    html2pdf().set({
        margin: [0.566,1,0,1], // atas, kanan, bawah, kiri → margin bawah 0
        filename: (document.getElementById('nama_siswa').innerText || 'rapor') + '.pdf',
        image: { type:'jpeg', quality:0.98 },
        html2canvas: { scale:4, useCORS:true },
        jsPDF: { unit:'cm', format:[21.59,33.02], orientation:'portrait' }
    }).from(el).save();
}

// Auto load
window.onload = () => {
    const data = JSON.parse(localStorage.getItem("raporData") || "{}");
    isiRapor(data);

    // Tombol cetak
    const cetakBtn = document.getElementById("cetakBtn");
    if(cetakBtn) cetakBtn.onclick = downloadPDF;

    // otomatis download jika ?dl=1
    if(window.location.search.includes("dl=1")) downloadPDF();
};
