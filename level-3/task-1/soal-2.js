// Ganti nilai huruf menjadi "b" untuk mencoba contoh huruf konsonan.
const huruf = "a";
const hurufKecil = huruf.toLowerCase();

if (["a", "i", "u", "e", "o"].includes(hurufKecil)) {
  console.log(`${huruf} adalah huruf vokal`);
} else {
  console.log(`${huruf} adalah huruf konsonan`);
}
