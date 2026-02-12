const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  agregarGasto: (gasto) => ipcRenderer.invoke('agregar-gasto', gasto),
  obtenerGastos: (mes, anio) => ipcRenderer.invoke('obtener-gastos', mes, anio)
});
