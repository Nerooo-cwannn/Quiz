/* =============================================================
   script.js — PHP Quiz App
   Vanilla JavaScript murni (tanpa framework)
   
   Struktur:
   1. Data Soal (questions array)
   2. State Aplikasi
   3. Utility Functions
   4. LocalStorage (simpan/muat skor)
   5. Start Quiz
   6. Timer
   7. Dot Navigator
   8. Render Question
   9. Pilih Jawaban
   10. Navigasi (prev / next / jump)
   11. Modal Konfirmasi
   12. Selesai Quiz & Hitung Skor
   13. Review Jawaban
   14. Toggle Review
   15. Restart / Kembali ke Beranda
   16. Inisialisasi
============================================================= */


/* =============================================================
   1. DATA SOAL
   Setiap objek punya:
   - text    : teks soal (string)
   - options : array 5 pilihan [A, B, C, D, E]
   - answer  : index jawaban benar (0=A, 1=B, 2=C, 3=D, 4=E)
============================================================= */
const questions = [
  {
    text: "Apa output dari kode PHP berikut?\n<?php echo 10 + \"5 apples\"; ?>",
    options: ["Error", "5 apples", "15", "105", "10"],
    answer: 2 // C = 15 (PHP type juggling: "5 apples" dikonversi ke 5)
  },
  {
    text: "Fungsi PHP yang digunakan untuk menghitung panjang string adalah...",
    options: ["count()", "length()", "strlen()", "size()", "str_count()"],
    answer: 2 // C = strlen()
  },
  {
    text: "Manakah cara yang BENAR untuk mendeklarasikan variabel dalam PHP?",
    options: [
      "var name = \"John\";",
      "name = \"John\";",
      "$name = \"John\";",
      "string name = \"John\";",
      "dim name = \"John\";"
    ],
    answer: 2 // C = $name = "John";
  },
  {
    text: "Apa output dari: <?php $a = true; echo $a + $a; ?>",
    options: ["true", "2", "1", "error", "truetrue"],
    answer: 1 // B = 2 (true = 1 dalam aritmatika)
  },
  {
    text: "Metode HTTP mana yang digunakan untuk mengirim data formulir secara AMAN (tidak terlihat di URL)?",
    options: ["GET", "PUT", "HEAD", "POST", "FETCH"],
    answer: 3 // D = POST
  },
  {
    text: "Dalam PHP, superglobal manakah yang digunakan untuk mengakses data dari query string URL?",
    options: ["$_POST", "$_SESSION", "$_SERVER", "$_GET", "$_REQUEST"],
    answer: 3 // D = $_GET
  },
  {
    text: "Apa hasil dari fungsi PHP: array_merge([1,2], [3,4])?",
    options: ["[1,2,3,4]", "[[1,2],[3,4]]", "Error", "[1,2],[3,4]", "{1,2,3,4}"],
    answer: 0 // A = [1,2,3,4]
  },
  {
    text: "Konsep OOP yang memungkinkan sebuah class mewarisi properti dan method dari class lain disebut...",
    options: ["Encapsulation", "Polymorphism", "Abstraction", "Inheritance", "Interface"],
    answer: 3 // D = Inheritance
  },
  {
    text: "Fungsi PHP mana yang digunakan untuk mencegah SQL Injection dengan membersihkan input?",
    options: [
      "sanitize_input()",
      "clean_sql()",
      "strip_tags()",
      "mysqli_real_escape_string()",
      "htmlspecialchars()"
    ],
    answer: 3 // D = mysqli_real_escape_string()
  },
  {
    text: "Apa itu 'closure' dalam pemrograman?",
    options: [
      "Sebuah class yang tidak bisa diinstansiasi",
      "Fungsi anonim yang dapat mengakses variabel dari scope luarnya",
      "Sebuah loop yang tidak pernah berhenti",
      "Metode untuk menutup koneksi database",
      "Tipe data untuk menyimpan boolean"
    ],
    answer: 1 // B
  },
  {
    text: "Dalam PHP, operator '===' digunakan untuk...",
    options: [
      "Membandingkan nilai saja",
      "Melakukan assignment",
      "Membandingkan nilai DAN tipe data",
      "Membandingkan referensi objek",
      "Operasi bitwise"
    ],
    answer: 2 // C = strict comparison (nilai + tipe)
  },
  {
    text: "Manakah kode PHP yang benar untuk membuat koneksi ke database MySQL menggunakan PDO?",
    options: [
      "new MySQL($host, $db, $user, $pass)",
      "mysql_connect($host, $user, $pass)",
      "new PDO(\"mysql:host=$host;dbname=$db\", $user, $pass)",
      "PDO::connect($host, $db, $user, $pass)",
      "mysqli::connect($host, $user, $pass)"
    ],
    answer: 2 // C = sintaks PDO yang benar
  },
  {
    text: "Apa yang dimaksud dengan 'Big O Notation' dalam algoritma?",
    options: [
      "Notasi untuk ukuran file program",
      "Simbol untuk menandai komentar kode",
      "Cara mengukur kompleksitas waktu dan ruang algoritma",
      "Format penulisan kode yang besar",
      "Metode debugging program"
    ],
    answer: 2 // C
  },
  {
    text: "Dalam PHP, apa fungsi dari kata kunci 'static' pada sebuah method dalam class?",
    options: [
      "Method tidak bisa dioverride",
      "Method bisa dipanggil tanpa membuat instance dari class",
      "Method hanya bisa diakses dari dalam class",
      "Method selalu mengembalikan nilai yang sama",
      "Method tidak bisa menerima parameter"
    ],
    answer: 1 // B = dipanggil via ClassName::method()
  },
  {
    text: "Apa output dari kode ini: <?php echo implode(\"-\", [\"a\",\"b\",\"c\"]); ?>",
    options: ["a,b,c", "abc", "a-b-c", "[a,b,c]", "error"],
    answer: 2 // C = a-b-c
  },
  {
    text: "Pola desain (design pattern) mana yang memastikan sebuah class hanya memiliki SATU instance?",
    options: ["Factory", "Observer", "Singleton", "Decorator", "Strategy"],
    answer: 2 // C = Singleton
  },
  {
    text: "Dalam pemrograman, apa yang dimaksud dengan 'Recursive Function'?",
    options: [
      "Fungsi yang dipanggil dari luar class",
      "Fungsi yang memanggil dirinya sendiri",
      "Fungsi yang mengembalikan banyak nilai",
      "Fungsi yang berjalan secara paralel",
      "Fungsi tanpa parameter"
    ],
    answer: 1 // B
  },
  {
    text: "Manakah pernyataan BENAR tentang perbedaan include() dan require() di PHP?",
    options: [
      "include() lebih cepat dari require()",
      "require() hanya bisa digunakan di dalam function",
      "include() menghasilkan fatal error jika file tidak ditemukan",
      "require() menghasilkan fatal error jika file tidak ditemukan, include() hanya warning",
      "Keduanya identik dan tidak ada perbedaan"
    ],
    answer: 3 // D
  },
  {
    text: "Apa yang dihasilkan oleh kode berikut?\n<?php $arr = [3,1,4,1,5]; sort($arr); echo $arr[0]; ?>",
    options: ["3", "5", "1", "4", "Error"],
    answer: 2 // C = 1 (sort ascending → [1,1,3,4,5], index 0 = 1)
  },
  {
    text: "Dalam konteks REST API, status code HTTP manakah yang menandakan bahwa resource BERHASIL DIBUAT?",
    options: ["200 OK", "204 No Content", "400 Bad Request", "201 Created", "301 Moved Permanently"],
    answer: 3 // D = 201 Created
  }
];


/* =============================================================
   2. STATE APLIKASI
   Semua variabel global yang mengontrol kondisi quiz
============================================================= */
let currentQ      = 0;                              // Index soal aktif (0-19)
let userAnswers   = new Array(questions.length).fill(null); // null = belum dijawab
let timerInterval = null;                           // Reference interval timer
let timeLeft      = 30 * 60;                        // Sisa waktu dalam detik (30 mnt)
let quizStarted   = false;                          // Flag apakah quiz sudah dimulai

const LABELS = ['A', 'B', 'C', 'D', 'E'];          // Label huruf pilihan jawaban


/* =============================================================
   3. UTILITY FUNCTIONS
============================================================= */

/**
 * Tampilkan screen tertentu, sembunyikan yang lain.
 * @param {string} id - ID elemen screen (misal: 'screen-start')
 */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

/**
 * Format detik menjadi MM:SS
 * @param {number} seconds
 * @returns {string}
 */
function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}


/* =============================================================
   4. LOCALSTORAGE — Simpan & Muat Skor Terakhir
============================================================= */

/**
 * Muat skor terakhir dari localStorage dan tampilkan di halaman awal.
 */
function loadLastScore() {
  const saved = localStorage.getItem('phpQuizLastScore');
  const box   = document.getElementById('last-score-info');

  if (saved) {
    const { score, pct, date } = JSON.parse(saved);
    box.innerHTML = `Skor terakhir: <span>${score}/20 (${pct}%)</span> &nbsp;—&nbsp; ${date}`;
  } else {
    box.textContent = 'Belum ada skor sebelumnya.';
  }
}

/**
 * Simpan skor terbaru ke localStorage.
 * @param {number} score - Jumlah jawaban benar
 */
function saveScore(score) {
  const pct  = Math.round((score / questions.length) * 100);
  const date = new Date().toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
  localStorage.setItem('phpQuizLastScore', JSON.stringify({ score, pct, date }));
}


/* =============================================================
   5. START QUIZ
============================================================= */

/**
 * Reset state dan mulai quiz dari awal.
 */
function startQuiz() {
  // Reset semua state
  currentQ    = 0;
  userAnswers = new Array(questions.length).fill(null);
  timeLeft    = 30 * 60;
  quizStarted = true;

  // Bangun UI dan mulai
  buildDots();
  renderQuestion();
  startTimer();
  showScreen('screen-quiz');
}


/* =============================================================
   6. TIMER
============================================================= */

/**
 * Mulai countdown timer 30 menit.
 * Otomatis memanggil finishQuiz(true) saat waktu habis.
 */
function startTimer() {
  clearInterval(timerInterval); // Pastikan tidak ada timer lain berjalan
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    // Waktu habis → selesaikan quiz secara otomatis
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      finishQuiz(true);
    }
  }, 1000);
}

/**
 * Perbarui tampilan timer di DOM.
 * Tambahkan class 'warning' jika sisa waktu < 2 menit.
 */
function updateTimerDisplay() {
  const el  = document.getElementById('timer-text');
  const box = document.getElementById('timer-display');

  el.textContent = formatTime(timeLeft);

  if (timeLeft <= 120) {
    box.classList.add('warning');    // Glow merah + animasi
  } else {
    box.classList.remove('warning');
  }
}


/* =============================================================
   7. DOT NAVIGATOR
============================================================= */

/**
 * Buat tombol dot untuk setiap soal (dipanggil saat quiz dimulai).
 */
function buildDots() {
  const container = document.getElementById('q-dots');
  container.innerHTML = '';

  questions.forEach((_, i) => {
    const dot       = document.createElement('button');
    dot.className   = 'q-dot';
    dot.id          = `dot-${i}`;
    dot.textContent = i + 1;
    dot.onclick     = () => jumpTo(i); // Klik dot → lompat ke soal
    container.appendChild(dot);
  });
}

/**
 * Perbarui tampilan semua dot sesuai state (aktif / sudah dijawab / belum).
 */
function updateDots() {
  questions.forEach((_, i) => {
    const dot     = document.getElementById(`dot-${i}`);
    dot.className = 'q-dot'; // Reset class

    if (userAnswers[i] !== null) dot.classList.add('answered'); // Sudah dijawab
    if (i === currentQ)          dot.classList.add('active');   // Soal aktif
  });
}


/* =============================================================
   8. RENDER QUESTION
   Tampilkan soal, pilihan, progress, dan update navigasi
============================================================= */

/**
 * Render soal saat ini ke DOM.
 */
function renderQuestion() {
  const q = questions[currentQ];

  // Trigger ulang animasi fadeInUp
  const card         = document.getElementById('question-card');
  card.style.animation = 'none';
  card.offsetHeight;                              // Force reflow
  card.style.animation = 'fadeInUp 0.35s ease forwards';

  // Nomor soal dan teks
  document.getElementById('q-number').textContent  = `SOAL ${String(currentQ + 1).padStart(2, '0')}`;
  document.getElementById('q-text').textContent    = q.text;
  document.getElementById('q-current').textContent = currentQ + 1;

  // Render pilihan jawaban
  const list    = document.getElementById('options-list');
  list.innerHTML = '';

  q.options.forEach((opt, i) => {
    const btn       = document.createElement('button');
    // Tandai sebagai 'selected' jika user sudah memilih
    btn.className   = 'option-btn' + (userAnswers[currentQ] === i ? ' selected' : '');
    btn.innerHTML   = `
      <span class="opt-label">${LABELS[i]}</span>
      <span class="opt-text">${opt}</span>
    `;
    btn.onclick = () => selectAnswer(i);
    list.appendChild(btn);
  });

  // Update progress bar
  const answered = userAnswers.filter(a => a !== null).length;
  const pct      = (answered / questions.length) * 100;
  document.getElementById('progress-fill').style.width = pct + '%';

  // Update dot navigator
  updateDots();

  // Tombol Prev: disable di soal pertama
  document.getElementById('btn-prev').disabled = (currentQ === 0);

  // Tombol Next: ubah teks jadi "Selesai" di soal terakhir
  const isLast  = (currentQ === questions.length - 1);
  const btnNext = document.getElementById('btn-next');
  btnNext.textContent = isLast ? '✓ Selesai' : 'Selanjutnya →';
  btnNext.onclick     = isLast ? openModal : nextQuestion;
}


/* =============================================================
   9. PILIH JAWABAN
============================================================= */

/**
 * Simpan jawaban user dan auto-advance ke soal berikutnya.
 * @param {number} index - Index pilihan yang dipilih (0-4)
 */
function selectAnswer(index) {
  userAnswers[currentQ] = index;

  // Highlight pilihan yang dipilih
  document.querySelectorAll('.option-btn').forEach((btn, i) => {
    btn.classList.toggle('selected', i === index);
  });

  // Update dot menjadi 'answered'
  document.getElementById(`dot-${currentQ}`).classList.add('answered');

  // Update progress bar
  const answered = userAnswers.filter(a => a !== null).length;
  const pct      = (answered / questions.length) * 100;
  document.getElementById('progress-fill').style.width = pct + '%';

  // Auto-advance ke soal berikutnya setelah 400ms (kecuali soal terakhir)
  if (currentQ < questions.length - 1) {
    setTimeout(() => {
      currentQ++;
      renderQuestion();
    }, 400);
  }
}


/* =============================================================
   10. NAVIGASI
============================================================= */

/** Pindah ke soal sebelumnya */
function prevQuestion() {
  if (currentQ > 0) {
    currentQ--;
    renderQuestion();
  }
}

/** Pindah ke soal berikutnya */
function nextQuestion() {
  if (currentQ < questions.length - 1) {
    currentQ++;
    renderQuestion();
  }
}

/**
 * Lompat langsung ke soal tertentu (dari dot navigator).
 * @param {number} index - Index soal tujuan
 */
function jumpTo(index) {
  currentQ = index;
  renderQuestion();
}


/* =============================================================
   11. MODAL KONFIRMASI SELESAI
============================================================= */

/** Buka modal konfirmasi selesai quiz */
function openModal() {
  const answered = userAnswers.filter(a => a !== null).length;
  document.getElementById('modal-answered').textContent = answered;
  document.getElementById('modal-overlay').classList.add('open');
}

/** Tutup modal (lanjutkan mengerjakan) */
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}


/* =============================================================
   12. SELESAI QUIZ & HITUNG SKOR
============================================================= */

/**
 * Hentikan quiz, hitung skor, dan tampilkan halaman hasil.
 * @param {boolean} timeUp - true jika dipicu karena waktu habis
 */
function finishQuiz(timeUp = false) {
  clearInterval(timerInterval); // Stop timer
  closeModal();

  // Hitung skor
  let correct = 0, wrong = 0, skipped = 0;
  questions.forEach((q, i) => {
    if (userAnswers[i] === null)         skipped++;
    else if (userAnswers[i] === q.answer) correct++;
    else                                  wrong++;
  });

  const pct = Math.round((correct / questions.length) * 100);

  // Simpan skor ke localStorage
  saveScore(correct);

  // Tentukan pesan dan emoji berdasarkan skor
  let trophy   = '🏆';
  let title    = 'Luar Biasa!';
  let subtitle = 'Kamu mendapatkan nilai sempurna!';

  if      (pct < 40)  { trophy = '😔'; title = 'Terus Semangat!'; subtitle = 'Pelajari lagi materinya dan coba lagi!'; }
  else if (pct < 60)  { trophy = '💪'; title = 'Lumayan!';        subtitle = 'Ada beberapa konsep yang perlu diperdalam.'; }
  else if (pct < 80)  { trophy = '🌟'; title = 'Bagus!';          subtitle = 'Nilaimu sudah baik, terus tingkatkan!'; }
  else if (pct < 100) { trophy = '🎉'; title = 'Hebat!';          subtitle = 'Hampir sempurna! Sedikit lagi!'; }

  if (timeUp) { subtitle = 'Waktu habis! ' + subtitle; }

  // Perbarui DOM hasil
  document.getElementById('result-trophy').textContent   = trophy;
  document.getElementById('result-title').textContent    = title;
  document.getElementById('result-subtitle').textContent = subtitle;
  document.getElementById('score-big').textContent       = correct;
  document.getElementById('score-pct').textContent       = pct + '%';
  document.getElementById('stat-correct').textContent    = correct;
  document.getElementById('stat-wrong').textContent      = wrong;
  document.getElementById('stat-skip').textContent       = skipped;

  // Bangun daftar review jawaban
  buildReview();

  // Tampilkan halaman hasil
  showScreen('screen-result');
}


/* =============================================================
   13. BUILD REVIEW JAWABAN
============================================================= */

/**
 * Bangun daftar review semua soal beserta jawaban user dan kunci jawaban.
 */
function buildReview() {
  const list    = document.getElementById('review-list');
  list.innerHTML = '';

  questions.forEach((q, i) => {
    const ua          = userAnswers[i];
    const isCorrect   = (ua === q.answer);
    const isUnanswered = (ua === null);

    // Tentukan kelas dan badge
    const statusClass = isUnanswered ? 'unanswered' : isCorrect ? 'correct' : 'wrong';
    const badge       = isUnanswered ? '⏭' : isCorrect ? '✅' : '❌';

    // Teks jawaban user dan kunci
    let ansText = '';
    if (isUnanswered) {
      ansText = `
        <div class="ri-ans" style="color:var(--white-dim)">Tidak dijawab</div>
        <div class="ri-correct">Jawaban benar: ${LABELS[q.answer]}. ${q.options[q.answer]}</div>
      `;
    } else if (isCorrect) {
      ansText = `
        <div class="ri-ans correct-ans">Jawabanmu: ${LABELS[ua]}. ${q.options[ua]}</div>
      `;
    } else {
      ansText = `
        <div class="ri-ans wrong-ans">Jawabanmu: ${LABELS[ua]}. ${q.options[ua]}</div>
        <div class="ri-correct">Jawaban benar: ${LABELS[q.answer]}. ${q.options[q.answer]}</div>
      `;
    }

    // Potong teks soal jika terlalu panjang untuk tampilan review
    const shortQ = q.text.length > 80
      ? q.text.replace(/\n/g, ' ').substring(0, 80) + '...'
      : q.text.replace(/\n/g, ' ');

    // Buat elemen item review
    const item      = document.createElement('div');
    item.className  = `review-item ${statusClass}`;
    item.innerHTML  = `
      <div class="ri-num">${String(i + 1).padStart(2, '0')}</div>
      <div class="ri-q">
        ${shortQ}
        ${ansText}
      </div>
      <div class="ri-badge">${badge}</div>
    `;

    list.appendChild(item);
  });
}


/* =============================================================
   14. TOGGLE REVIEW
============================================================= */

/**
 * Tampilkan atau sembunyikan seksi review jawaban.
 */
function toggleReview() {
  const sec    = document.getElementById('review-section');
  const hidden = (sec.style.display === 'none');
  const btn    = document.querySelector('.review-toggle .btn');

  sec.style.display  = hidden ? 'block' : 'none';
  btn.textContent    = hidden ? '🔼 Sembunyikan Review' : '📋 Lihat Review Jawaban';
}


/* =============================================================
   15. RESTART / KEMBALI KE BERANDA
============================================================= */

/** Ulangi quiz dari awal */
function restartQuiz() {
  document.getElementById('review-section').style.display = 'none';
  startQuiz();
}

/** Kembali ke halaman beranda (halaman awal) */
function goHome() {
  clearInterval(timerInterval);
  document.getElementById('review-section').style.display = 'none';
  loadLastScore();           // Muat skor terakhir yang baru disimpan
  showScreen('screen-start');
}


/* =============================================================
   16. INISIALISASI
   Dijalankan saat halaman pertama kali dimuat
============================================================= */
loadLastScore(); // Tampilkan skor terakhir jika ada
