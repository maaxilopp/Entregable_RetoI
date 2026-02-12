const mesSelect = document.getElementById('mes');
const anioSelect = document.getElementById('anio');
const tabla = document.getElementById('tablaGastos');
const totalSpan = document.getElementById('total');
const formulario = document.getElementById('formulario');

const btnAgregar = document.getElementById('btnAgregar');
const btnGuardar = document.getElementById('guardar');
const btnFiltrar = document.getElementById('filtrar');

function cargarMeses() {
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  meses.forEach((nombre, index) => {
    const option = document.createElement('option');
    option.value = index + 1;
    option.textContent = nombre;
    mesSelect.appendChild(option);
  });
}

function cargarAnios() {
  for (let i = 2026; i >= 2000; i--) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    anioSelect.appendChild(option);
  }
}

async function cargarGastos() {
  try {
    const mes = mesSelect.value;
    const anio = anioSelect.value;

    const gastos = await window.api.obtenerGastos(mes, anio);

    tabla.innerHTML = '';
    let total = 0;

    if (gastos && gastos.length > 0) {
      gastos.forEach(g => {
        total += g.monto;

        const fila = document.createElement('tr');
      const [año, mes, dia] = g.fecha.split('-');
const fechaFormato = `${dia}/${mes}/${año}`;
fila.innerHTML = `
  <td>${fechaFormato}</td>
  <td>${g.categoria}</td>
  <td>$${g.monto.toFixed(2)}</td>
  <td>${g.descripcion || ''}</td>
`;

        tabla.appendChild(fila);
      });
    } else {
      tabla.innerHTML = '<tr><td colspan="4">No hay gastos registrados</td></tr>';
    }

    totalSpan.textContent = total.toFixed(2);
  } catch (err) {
    console.error('Error al cargar gastos:', err);
  }
}

btnAgregar.addEventListener('click', () => {
  formulario.classList.toggle('oculto');
});

btnGuardar.addEventListener('click', async () => {
  const fecha = document.getElementById('fecha').value;
  const categoria = document.getElementById('categoria').value;
  const monto = document.getElementById('monto').value;

  if (!fecha || !categoria || !monto) {
    alert('Por favor completa todos los campos requeridos');
    return;
  }

  const gasto = {
    fecha: fecha,
    categoria: categoria,
    monto: parseFloat(monto),
    descripcion: document.getElementById('descripcion').value
  };

  try {
    await window.api.agregarGasto(gasto);
    
    document.getElementById('fecha').value = '';
    document.getElementById('categoria').value = '';
    document.getElementById('monto').value = '';
    document.getElementById('descripcion').value = '';
    
    formulario.classList.add('oculto');
    cargarGastos();
  } catch (err) {
    console.error('Error al agregar gasto:', err);
    alert('Error al agregar el gasto');
  }
});

btnFiltrar.addEventListener('click', cargarGastos);

cargarMeses();
cargarAnios();
cargarGastos();