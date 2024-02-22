const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path'); // Tambahkan ini untuk menggunakan path

const app = express();
const port = 3000;

// Konfigurasi koneksi database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // sesuaikan dengan username MySQL Anda
  password: '', // sesuaikan dengan password MySQL Anda
  database: 'dapa' // sesuaikan dengan nama database Anda
});

// Koneksi ke database
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Middleware untuk parsing body dari request
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set view engine dan folder views
app.set('views', path.join(__dirname, 'views')); // Tambahkan ini untuk menentukan folder views
app.set('view engine', 'ejs');

// Middleware untuk file statis
app.use(express.static(path.join(__dirname, 'public'))); // Tambahkan ini untuk menangani file statis dari folder public

// Routes
// Halaman utama
app.get('/', (req, res) => {
  let sql = 'SELECT * FROM biodata';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.render('index', { results: results });
  });
});

// Form tambah data
app.get('/add', (req, res) => {
  res.render('add');
});

// Proses tambah data
app.post('/add', (req, res) => {
  let data = req.body;
  let sql = 'INSERT INTO biodata SET ?';
  db.query(sql, data, (err, result) => {
    if (err) throw err;
    console.log('Data added successfully');
    res.redirect('/');
  });
});

// Form edit data
app.get('/edit/:id', (req, res) => {
  let id = req.params.id;
  let sql = 'SELECT * FROM biodata WHERE id = ?';
  db.query(sql, id, (err, result) => {
    if (err) throw err;
    res.render('edit', { data: result[0] });
  });
});

// Proses edit data
app.post('/edit/:id', (req, res) => {
  let id = req.params.id;
  let newData = req.body;
  let sql = 'UPDATE biodata SET ? WHERE id = ?';
  db.query(sql, [newData, id], (err, result) => {
    if (err) throw err;
    console.log('Data updated successfully');
    res.redirect('/');
  });
});

// Proses hapus data
app.get('/delete/:id', (req, res) => {
  let id = req.params.id;
  let sql = 'DELETE FROM biodata WHERE id = ?';
  db.query(sql, id, (err, result) => {
    if (err) throw err;
    console.log('Data deleted successfully');
    res.redirect('/');
  });
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
