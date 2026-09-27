// Function dibuat dengan kata kunci function, diikuti nama, parameter dalam
// tanda kurung, lalu isi perintah dalam kurung kurawal. Comment seperti ini
// menjelaskan kode dan tidak dijalankan oleh JavaScript.

// Menerima nama, lalu menampilkan sapaan ke console.
// console.log mengembalikan undefined, jadi nilai return salam juga undefined.
function salam(nama) {
  return console.log("Halo " + nama + ", selamat pagi!");
}

// Menerima dua angka dan mengembalikan hasil penjumlahannya.
function penjumlahan(angkaPertama, angkaKedua) {
  return angkaPertama + angkaKedua;
}

// Contoh pemanggilan kedua function.
salam("Hidayat");
console.log(penjumlahan(2, 3));
