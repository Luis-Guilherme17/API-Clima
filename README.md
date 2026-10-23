# 🌦️ API-Clima

Aplicação web que consulta o clima atual de qualquer cidade. O usuário digita o nome da cidade, o back-end em PHP consulta a API gratuita **Open-Meteo** e devolve um JSON, que o JavaScript exibe em um card com temperatura, sensação térmica, umidade e vento.

//Esse é o link pro vídeo da revisão e funcionamento do projeto:
(Clique na imagem para ser redirecionado)


[![CRUD](https://img.youtube.com/vi/19F6QeDbxnk/0.jpg)](https://www.youtube.com/watch?v=19F6QeDbxnk)   


## ✨ Funcionalidades

- Busca do clima atual pelo nome da cidade
- Conversão automática de cidade em latitude/longitude (geocoding da Open-Meteo)
- Exibição de temperatura, sensação térmica, umidade, velocidade do vento e horário da atualização
- Descrição e ícone de acordo com o código meteorológico (WMO)
- Tratamento de erros: cidade não informada, cidade não encontrada e falha nos serviços externos
- Layout simples e responsivo
- Não precisa de chave de API

## 🛠️ Tecnologias

- **PHP** (cURL) no back-end
- **JavaScript** (Fetch API) no front-end
- **HTML5** e **CSS3**
- **[Open-Meteo](https://open-meteo.com/)** (Geocoding API e Forecast API)

## 📂 Estrutura do projeto

```
clima/
├── clima.php      # Back-end: recebe a cidade, consulta a Open-Meteo e devolve JSON
├── index.html     # Página principal
├── script.js      # Envia a consulta e exibe o resultado na tela
└── style.css      # Estilos da página
```

## 📡 Endpoint

### `GET /clima.php?cidade={nome}`

**Exemplo**

```
GET /clima.php?cidade=Recife
```

**Resposta de sucesso (200)**

```json
{
  "cidade": "Recife",
  "regiao": "Pernambuco, Brasil",
  "temperatura": 28.4,
  "sensacao": 31.2,
  "umidade": 70,
  "vento": 14.8,
  "codigo": 2,
  "horario": "2026-10-23T14:00"
}
```

**Campos**

| Campo | Descrição |
|---|---|
| `cidade` | Nome da cidade encontrada |
| `regiao` | Estado/região e país |
| `temperatura` | Temperatura atual (°C) |
| `sensacao` | Sensação térmica (°C) |
| `umidade` | Umidade relativa do ar (%) |
| `vento` | Velocidade do vento (km/h) |
| `codigo` | Código meteorológico WMO, usado para escolher a descrição e o ícone |
| `horario` | Data e hora da medição |

**Erros**

| Status | Situação | Exemplo de resposta |
|---|---|---|
| 400 | Cidade não informada | `{"erro": "Informe o nome de uma cidade."}` |
| 404 | Cidade não encontrada | `{"erro": "Cidade não encontrada. Tente outro nome."}` |
| 502 | Falha ao consultar a Open-Meteo | `{"erro": "Falha ao consultar o serviço de clima."}` |

## 🔄 Como funciona

1. O usuário digita a cidade em `index.html` e envia o formulário.
2. O `script.js` chama `clima.php?cidade=...` com `fetch`.
3. O `clima.php` consulta a **Geocoding API** da Open-Meteo para obter latitude e longitude.
4. Com as coordenadas, consulta a **Forecast API** para obter o clima atual.
5. O PHP devolve um JSON enxuto e o JavaScript monta o card na tela.

## 👤 Autor

**Luis Guilherme**
GitHub: [@Luis-Guilherme17](https://github.com/Luis-Guilherme17)
