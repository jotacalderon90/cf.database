const monitor = function(){
	this.services_monitor = createService('GET', '/api/monitor?skip=:skip');
  this.skip = 0;
  this.atributo = 'currentOp.active';
}

monitor.prototype.start = async function(parent) {
	this.parent = parent;
  
  this.collection = await this.getCollection();
  this.collection = this.collection.reverse();
  this.skip += this.collection.length;
  
  if(this.skip > 0 ) {
    this.listaAtributos = this.getArrayAtributos(this.collection[0]);
    await wait(1000);
    for(let i=0;i<this.listaAtributos.length;i++) {
      this.creaGrafico(i,this.listaAtributos[i]);
    }
  }
  
}

monitor.prototype.getCollection = async function() {
  const respuesta = await this.services_monitor({skip: this.skip});
  if(respuesta.error) {
    throw new Error(respuesta.error);
  }
  return respuesta.data;
}

monitor.prototype.getArrayAtributos = function(obj, prefix = "") {
  const EXCLUDED_KEYS = ['id', '_id', 'ts', 'host'];
  return Object.keys(obj).reduce((acc, key) => {
    // Construir la ruta completa de la clave actual
    const fullPath = prefix ? `${prefix}.${key}` : key;

    // Omitir si la clave actual está en la lista de excluidos
    if (EXCLUDED_KEYS.includes(fullPath)) {
      return acc;
    }

    // Verificar si el valor es un objeto (y no es null ni un array) para seguir profundizando
    if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
      return acc.concat(this.getArrayAtributos(obj[key], fullPath));
    }

    // Si es un valor primitivo, agregar la ruta al acumulador
    return acc.concat(fullPath);
  }, []);
}

monitor.prototype.getValueByPath = function (obj, path) {
  // Dividimos el string por los puntos y recorremos cada nivel
  return path.split('.').reduce((acc, key) => {
    // Si en algún punto el acumulador es null o undefined, 
    // devolvemos undefined para evitar errores.
    return (acc && acc[key] !== undefined) ? acc[key] : undefined;
  }, obj);
}

monitor.prototype.selectAtributo = function(atributo) {
  this.atributo = atributo;
  this.creaGrafico();
}

monitor.prototype.creaGrafico = async function(indice, atributo) {
  try{
    
		if (this[`chart_${indice}`] != null) {
			this[`chart_${indice}`].destroy();
		}
    
    this['collection_' + indice] = this.collection.map((row)=>{
      
      const fechaUTC = row.ts;
      const dtUTC = luxon.DateTime.fromISO(fechaUTC, { zone: "utc" });
      const dtLocal = dtUTC.setZone(timezone);
      
      return {
        label: dtLocal.toFormat('dd LLLL yyyy HH:mm'),
        cont: this.getValueByPath(row, atributo)
      }
    });
    
    this[`chart_${indice}`] = new Chart(document.getElementById('chart_' + indice).getContext('2d'), {
			type: 'line',
			data: {
				labels: this['collection_' + indice].map((row)=>{
					return row.label
				}),
				datasets: [{
					label: `Actividad por ${atributo}`,
					data: this['collection_' + indice].map((row)=>{
						return row.cont
					})
				}]
			},
			options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
				onClick: (event,elements) => {
					//this.clickGraficoPrincipal(event,elements);
				}
			}
		});
		
  } catch (error) {
    await this.parent.modal.notify('Error al generar grafico principal','error');
    console.error(error);
  }
}

monitor.prototype.tempDescription = function(atributo) {
  switch (atributo) {
    case 'currentOp.active':
      return 'Número de operaciones actualmente en ejecución (no en espera). Incluye operaciones de lectura, escritura y comandos que están siendo procesados en ese instante.';
      break;
    case 'currentOp.slow':
      return 'Operaciones en curso cuyo tiempo de ejecución supera el umbral de "slow op" configurado (slowOpThresholdMs, por defecto 100ms). Útil para detectar cuellos de botella en tiempo real.';
      break;
    case 'currentOp.waitingForLock':
      return 'Operaciones bloqueadas esperando adquirir un lock (lectura o escritura). Un valor alto indica contención de locks, lo que puede degradar severamente el rendimiento.';
      break;
    case 'currentOp.collscan':
      return 'Operaciones activas que están realizando un collection scan (sin uso de índice). Cada una implica recorrer todos los documentos de la colección, lo cual es muy costoso.';
      break;
    case 'currentOp.maxSecsRunning':
      return 'Tiempo en segundos de la operación activa más larga en curso. Permite detectar queries colgadas o procesos que llevan demasiado tiempo sin completarse.';
      break;
    case 'counters.opcounters.insert':
      return 'Total de operaciones de inserción recibidas por el nodo.';
      break;
    case 'counters.opcounters.query':
      return 'Total de operaciones de consulta (find, findOne, etc.) recibidas.';
      break;
    case 'counters.opcounters.update':
      return 'Total de operaciones de actualización recibidas.';
      break;
    case 'counters.opcounters.delete':
      return 'Total de operaciones de eliminación recibidas.';
      break;
    case 'counters.opcounters.getmore':
      return 'Total de operaciones getMore, que ocurren cuando un cliente pide más resultados de un cursor ya abierto (paginación de resultados).';
      break;
    case 'counters.opcounters.command':
      return 'Total de comandos de base de datos recibidos (distintos a las operaciones CRUD básicas): aggregate, count, createIndex, hello, etc.';
      break;
    case 'counters.network.bytesIn':
      return 'Bytes lógicos recibidos por MongoDB desde los clientes. Incluye overhead del protocolo wire.';
      break;
    case 'counters.network.bytesOut':
      return 'Bytes lógicos enviados por MongoDB hacia los clientes.';
      break;
    case 'counters.network.physicalBytesIn':
      return 'Bytes físicos realmente recibidos a nivel de socket (puede diferir de bytesIn si hay compresión de red activa).';
      break;
    case 'counters.network.physicalBytesOut':
      return 'Bytes físicos realmente enviados a nivel de socket (ídem, refleja compresión si está habilitada).';
      break;
    case 'counters.network.numSlowDNSOperations':
      return 'Número de resoluciones DNS que superaron el umbral de lentitud. Un valor elevado puede indicar problemas de configuración DNS en el entorno del servidor.';
      break;
    case 'counters.network.numSlowSSLOperations':
      return 'Número de operaciones SSL/TLS que tardaron más de lo esperado (handshakes lentos). Puede reflejar problemas de certificados, carga del servidor o red.';
      break;
    case 'counters.network.rejectedAdmissions':
      return 'Conexiones o solicitudes rechazadas por el mecanismo de admission control (control de admisión). Ocurre cuando el sistema está sobrecargado y MongoDB descarta solicitudes para proteger la estabilidad.';
      break;
    case 'counters.network.numRequests':
      return 'Total de solicitudes de red procesadas por MongoDB (a nivel de mensaje del protocolo wire).';
      break;
    case 'counters.network.durationMicros':
      return 'Tiempo acumulado en microsegundos gastado en procesamiento de red. Útil para calcular latencia promedio dividiendo por numRequests.';
      break;
    case 'uptime':
      return 'Tiempo en segundos que lleva activo el proceso mongod o mongos desde su último inicio. Útil para detectar reinicios inesperados.';
      break;
    case 'connections':
      return 'Objeto con el estado de las conexiones: current (activas), available (disponibles aún), totalCreated (historial total). Monitorear current vs el límite máximo (maxIncomingConnections) es crítico para evitar agotamiento de conexiones.';
      break;
  }
}

monitor.prototype.copy = async function(indice) {
  let tmp;
  if(indice) {
    tmp = this['collection_' + indice];
  } else {
    tmp = this.collection;
  }
  await copyLarge(JSON.stringify(tmp));
  await this.parent.modal.notify('Datos copiados');
}

app.modules.monitor = monitor;