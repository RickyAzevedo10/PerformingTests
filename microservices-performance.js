import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Counter } from 'k6/metrics';

// Metricas personalizadas
export const latency = new Trend('latency', true); // Latencia
export const throughput = new Counter('throughput'); // Requisicoes processadas
export const errors = new Counter('errors'); // Contagem de erros

// Configuracao do teste
export const options = {
  stages: [
    { duration: '30s', target: 50 },  // baixa carga
    { duration: '1m', target: 100 },  // carga media
    { duration: '2m', target: 250 }, // alta carga
    { duration: '4m', target: 550 }, // carga muito alta
    { duration: '30s', target: 0 },   // final do teste
  ],
};

// Funcao para gerar nomes aleatorios
function getRandomName() {
  const firstNames = ['John', 'Jane', 'Alex', 'Emily', 'Chris', 'Pat', 'Abby', 'Adam'];
  const lastNames = ['Smith', 'Doe', 'Brown', 'Johnson', 'Lee', 'Taylor'];
  const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return { firstName: randomFirstName, lastName: randomLastName };
}

// Funcao para gerar posicao aleatoria
function getRandomPosition() {
  const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
  return positions[Math.floor(Math.random() * positions.length)];
}

// Funcao para construir o URL com parametros aleatorios
function buildUrlGetPlayers() {
  const { firstName, lastName } = getRandomName();
  const position = Math.random() > 0.5 ? getRandomPosition() : ''; // 50% de chance de enviar posicao
  const includeFirstName = Math.random() > 0.5; // 50% de chance de incluir o primeiro nome
  const includeLastName = Math.random() > 0.5; // 50% de chance de incluir o ultimo nome

  let url = `http://localhost:5000/membersteams/Players/PlayerSearch?`; //get players

  if (includeFirstName) url += `firstName=${firstName}&`;
  if (includeLastName) url += `lastName=${lastName}&`;
  url += `position=${position}`;

  // Garantir que pelo menos um parametro foi incluido
  if (!includeFirstName && !includeLastName && position === '') {
    url += `firstName=${firstName}`; // Adicionar o primeiro nome como padrao
  }

  return url;
}

function buildUrlGetUsers() {
  // Gerar um ID aleatorio entre os valores pretendidos(varia com base no numero de registos)
  let randomId = Math.floor(Math.random() * 9999) + 1;

  // Construir o URL com o ID gerado
  let url = `http://localhost:5000/identity/Users/User?id=${randomId}`; // get users 

  return url;
}

const AUTH_TOKEN = 'Bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTUxMiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJ1c2VyLTc2NzczMGM4LTlmMWQtNDdlNi05MWIwLTdhMmUyYjgzZjA3Y0BleGFtcGxlLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIxNCIsImV4cCI6MTczNjg2NzMwNiwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6MzI3NzIiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdDozMjc3MiJ9.sSK7Txzgw0z5YwTRFnoRUMApBS_GchUx4H7ETNtFezg7aXysU-YsgfrTr2dlXzivHiYiYpEEZXk6JGz6bWQSCw';

export default function () {
  const url = buildUrlGetPlayers();
  // const url = buildUrlGetUsers();

  const headers = {
    Authorization: AUTH_TOKEN,
    'Content-Type': 'application/json',
  };

  // Realizar a requisicao
  const res = http.get(url, { headers });

  // Metricas
  latency.add(res.timings.duration); // Adiciona a latencia
  throughput.add(1); // Incrementa o throughput
  if (res.status !== 200) {
    errors.add(1); // Incrementa erros se o status nao for 200
  }

  // Verificacoes
  check(res, {
    'status e 200': (r) => r.status === 200,
  });

  // Simular tempo entre requisicoes
  sleep(1);
}
