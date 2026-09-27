// Mengembalikan hasil perkalian semua angka ganjil dalam array.
// Nilai awal 1 membuat hasilnya tetap 1 jika tidak ada angka ganjil.
function processNumbers(angka) {
  return angka
    .filter((nilai) => nilai % 2 !== 0)
    .reduce((hasil, nilai) => hasil * nilai, 1);
}

// Contoh pemanggilan sesuai soal.
console.log(processNumbers([1, 2, 3, 4, 5]));
console.log(processNumbers([2, 4, 6, 8]));
