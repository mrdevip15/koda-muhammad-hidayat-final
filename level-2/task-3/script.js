// Comment ini sepanjang satu baris
/*
 * JavaScript memiliki 8 tipe data:
 * 1. String: teks, misalnya "Halo".
 * 2. Number: angka biasa, misalnya 42 atau 3.14.
 * 3. BigInt: bilangan bulat yang sangat besar.
 * 4. Boolean: nilai benar (true) atau salah (false).
 * 5. Undefined: nilai variabel yang belum ditentukan.
 * 6. Null: nilai kosong yang sengaja diberikan.
 * 7. Symbol: nilai unik yang dapat dipakai sebagai penanda.
 * 8. Object: kumpulan data; array juga termasuk object.
 */

// Tipe data String
const namaDepan = "Rudi";
const jenisKelamin = "Laki-laki";
let alamat = "Jalan Raya";

// Tipe data Number
let umur = 20;
let saldo = 150000;
let beratBadan = 60.5;

// Tipe data BigInt
const jumlahBintang = 9007199254740993n;
const jumlahAtom = 1000000000000000000n;
let saldoSangatBesar = 999999999999999999n;

// Tipe data Boolean
let sedangOnline = true;
let sudahLulus = false;
let punyaTiket = true;

// Tipe data Undefined
let pilihanMenu = undefined;
let hasilPencarian = undefined;
let nomorAntrian = undefined;

// Tipe data Null
let nomorTelepon = null;
let tanggalKeluar = null;
let namaPendamping = null;

// Tipe data Symbol
const idPengguna = Symbol("pengguna");
const idProduk = Symbol("produk");
const idPesanan = Symbol("pesanan");

// Tipe data Object
let profil = { nama: "Rudi", umur: 20 };
let daftarHobi = ["membaca", "berenang"];
let alamatRumah = { jalan: "Jalan Raya", nomor: 10 };

// Variabel untuk operasi matematika
const bilanganKesatu = 2020;
const bilanganKedua = 8;
let hasilPerhitungan = 0;

// Penjumlahan
hasilPerhitungan = bilanganKesatu + bilanganKedua;
console.log(hasilPerhitungan);

// Pengurangan
hasilPerhitungan = bilanganKesatu - bilanganKedua;
console.log(hasilPerhitungan);

// Pembagian
hasilPerhitungan = bilanganKesatu / bilanganKedua;
console.log(hasilPerhitungan);

// Perkalian
hasilPerhitungan = bilanganKesatu * bilanganKedua;
console.log(hasilPerhitungan);
