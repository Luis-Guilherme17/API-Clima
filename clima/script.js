const form = document.getElementById('form-clima');
const campo = document.getElementById('cidade');
const resultado = document.getElementById('resultado');

// Códigos de clima da Open-Meteo (WMO) -> descrição e ícone
const CODIGOS = {
  0: ['Céu limpo', '☀️'], 1: ['Predomínio de sol', '🌤️'], 2: ['Parcialmente nublado', '⛅'],
  3: ['Nublado', '☁️'], 45: ['Neblina', '🌫️'], 48: ['Neblina com geada', '🌫️'],
  51: ['Garoa fraca', '🌦️'], 53: ['Garoa moderada', '🌦️'], 55: ['Garoa forte', '🌦️'],
  61: ['Chuva fraca', '🌧️'], 63: ['Chuva moderada', '🌧️'], 65: ['Chuva forte', '🌧️'],
  71: ['Neve fraca', '🌨️'], 73: ['Neve moderada', '🌨️'], 75: ['Neve forte', '❄️'],
  80: ['Pancadas de chuva fracas', '🌦️'], 81: ['Pancadas de chuva', '🌧️'], 82: ['Pancadas fortes', '⛈️'],
  95: ['Tempestade', '⛈️'], 96: ['Tempestade com granizo', '⛈️'], 99: ['Tempestade com granizo forte', '⛈️']
};

function escapar(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

function mostrarErro(msg) {
  resultado.innerHTML = `<div class="erro">${escapar(msg)}</div>`;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const cidade = campo.value.trim();
  if (!cidade) return;

  resultado.innerHTML = '<p class="carregando">Buscando...</p>';

  try {
    const resp = await fetch('clima.php?cidade=' + encodeURIComponent(cidade));
    const dados = await resp.json();

    if (!resp.ok || dados.erro) {
      mostrarErro(dados.erro || 'Não foi possível consultar o clima.');
      return;
    }

    const [desc, icone] = CODIGOS[dados.codigo] || ['Condição desconhecida', '🌡️'];

    resultado.innerHTML = `
      <div class="card">
        <h2>${escapar(dados.cidade)}</h2>
        <div class="pais">${escapar(dados.regiao)}</div>
        <div class="icone">${icone}</div>
        <div class="temp">${dados.temperatura}°C</div>
        <div class="desc">${desc}</div>
        <div class="detalhes">
          <div>🌡️ Sensação: ${dados.sensacao}°C</div>
          <div>💧 Umidade: ${dados.umidade}%</div>
          <div>💨 Vento: ${dados.vento} km/h</div>
          <div>🕒 Atualizado: ${escapar(dados.horario.replace('T', ' '))}</div>
        </div>
      </div>`;
  } catch (err) {
    mostrarErro('Erro de comunicação com o servidor. Verifique se o PHP está rodando.');
  }
});
