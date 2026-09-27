// Tampilkan segitiga angka menurun sebanyak jumlah baris yang diminta.
function triangle(jumlahBaris) {
  if (!Number.isInteger(jumlahBaris) || jumlahBaris <= 0) {
    console.log("Parameter harus bertipe data nomor dan harus nomor positif");
    return;
  }

  for (let baris = 1; baris <= jumlahBaris; baris++) {
    const angka = [];

    for (let nilai = baris; nilai >= 1; nilai--) {
      angka.push(nilai);
    }

    console.log(angka.join(""));
  }
}

// Contoh pemanggilan sesuai soal.
triangle("abc");
triangle(-1);
triangle(1);
triangle(2);
triangle(5);
