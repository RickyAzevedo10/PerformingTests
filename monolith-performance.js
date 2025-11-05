import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Counter } from 'k6/metrics';

// Metricas personalizadas
export const latency = new Trend('latency', true); 
export const throughput = new Counter('throughput'); 
export const errors = new Counter('errors');

// Configuracao do teste
export const options = {
  stages: [
    { duration: '30s', target: 50 },
    { duration: '1m', target: 100 }, 
    { duration: '2m', target: 250 },
    { duration: '4m', target: 550 },
    { duration: '30s', target: 0 },
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

  let url = `https://localhost:8081/Players/PlayerSearch?`; //get players
  // let url = `http://localhost:5076/ClubManager/Players/PlayerSearch?`; // get players with scalability

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
  let randomId = Math.floor(Math.random() * 99999) + 1;

  // Construir o URL com o ID gerado
  let url = `https://localhost:8081/Users/User?id=${randomId}`; // get users 
  // let url = `http://localhost:5076/ClubManager/Users/User?id=${randomId}`; // get users with scalability

  return url;
}

const AUTH_TOKEN = 'Bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTUxMiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJ1c2VyLWEyZWUyOWY1LWUzNWMtNGM1Ny05ZTFkLTg1MDk4MThiMzk4ZkBleGFtcGxlLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiZXhwIjoxNzM2NjE5NzQwLCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDozMjc3MiIsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0OjMyNzcyIn0.mf58L6CzEwHVL1t4hzZjlNIWixmkiUTGk7yhe5XpKPdKyg1TQeF9h5vcMFGb-QfVqaKjUfU4QOKtKeLYNRoXaw';

export default function () {
  const url = buildUrlGetPlayers();
  // const url = buildUrlGetUsers();

  const headers = { Authorization: AUTH_TOKEN, 'Content-Type': 'application/json',};
  const res = http.get(url, { headers });

  latency.add(res.timings.duration); 
  throughput.add(1); 
  if (res.status !== 200) {
    errors.add(1); 
  }

  check(res, { 'status e 200': (r) => r.status === 200,});
  sleep(1);
}
