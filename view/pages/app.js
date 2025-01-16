document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  console.log('Email:', email);
  console.log('Password:', password);

  // Di sini bisa tambahkan logika untuk mengirim data ke backend menggunakan fetch atau axios
});
