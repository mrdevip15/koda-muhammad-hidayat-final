// Periksa kelipatan 3 dan 5 lebih dahulu supaya 15 mencetak "fizzbuzz".
for (let angka = 18; angka >= 3; angka--) {
  if (angka % 3 === 0 && angka % 5 === 0) {
    console.log("fizzbuzz");
  } else if (angka % 3 === 0) {
    console.log("buzz");
  } else if (angka % 5 === 0) {
    console.log("fizz");
  } else {
    console.log(angka);
  }
}
