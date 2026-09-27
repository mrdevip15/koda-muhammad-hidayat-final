// Perulangan (looping) menjalankan blok kode berulang kali selama
// kondisi yang ditentukan masih terpenuhi.

// for: cocok jika jumlah pengulangan sudah diketahui.
// Sintaks: for (inisialisasi; kondisi; perubahan) { ... }
for (let angka = 1; angka <= 3; angka++) {
  console.log(`for: ${angka}`);
}

// while: kondisi diperiksa sebelum blok kode dijalankan.
// Sintaks: while (kondisi) { ... }
let angkaWhile = 1;
while (angkaWhile <= 3) {
  console.log(`while: ${angkaWhile}`);
  angkaWhile++;
}

// do while: blok kode dijalankan sekali sebelum kondisinya diperiksa.
// Sintaks: do { ... } while (kondisi);
let angkaDoWhile = 1;
do {
  console.log(`do while: ${angkaDoWhile}`);
  angkaDoWhile++;
} while (angkaDoWhile <= 3);
