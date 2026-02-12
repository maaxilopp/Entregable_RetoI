const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'gastos.db');
const db = new sqlite3.Database(dbPath);

function inicializarDB() {
  return new Promise((resolve, reject) => {
    db.run(
      `CREATE TABLE IF NOT EXISTS gastos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fecha TEXT NOT NULL,
        categoria TEXT NOT NULL,
        monto REAL NOT NULL,
        descripcion TEXT
      )`,
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}
function agregarGasto({ fecha, categoria, monto, descripcion }) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO gastos (fecha, categoria, monto, descripcion)
       VALUES (?, ?, ?, ?)`,
      [fecha, categoria, monto, descripcion],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
}

function obtenerGastosPorMes(mes, anio) {
  return new Promise((resolve, reject) => {
    const mesFormateado = mes.toString().padStart(2, '0');

    db.all(
      `SELECT * FROM gastos
       WHERE strftime('%m', fecha) = ?
       AND strftime('%Y', fecha) = ?
       ORDER BY fecha DESC`,
      [mesFormateado, anio.toString()],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      }
    );
  });
}

module.exports = {
  inicializarDB,
  agregarGasto,
  obtenerGastosPorMes
};