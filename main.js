const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./basedata');

function crearVentana() {
  const ventana = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'precarga.js'),
      contextIsolation: true
    }
  });

  ventana.loadFile(path.join(__dirname, 'Interfaz', 'index.html'));
}

app.whenReady().then(async () => {
  try {
    await db.inicializarDB();
    console.log('Base de datos inicializada correctamente');
  } catch (err) {
    console.error('Error al inicializar la BD:', err);
  }
  crearVentana();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('agregar-gasto', async (event, gasto) => {
  return await db.agregarGasto(gasto);
});

ipcMain.handle('obtener-gastos', async (event, mes, anio) => {
  return await db.obtenerGastosPorMes(mes, anio);
});