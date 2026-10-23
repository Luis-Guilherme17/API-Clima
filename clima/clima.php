<?php
// clima.php - recebe a cidade, consulta a Open-Meteo e devolve JSON ao JavaScript
header('Content-Type: application/json; charset=utf-8');

function buscar($url) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 10,
    ]);
    $resposta = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($resposta === false || $status !== 200) {
        return null;
    }
    return json_decode($resposta, true);
}

function erro($mensagem, $codigo = 400) {
    http_response_code($codigo);
    echo json_encode(['erro' => $mensagem], JSON_UNESCAPED_UNICODE);
    exit;
}

$cidade = trim($_GET['cidade'] ?? '');
if ($cidade === '') {
    erro('Informe o nome de uma cidade.');
}

// 1) Converte o nome da cidade em latitude/longitude (geocoding da Open-Meteo)
$urlGeo = 'https://geocoding-api.open-meteo.com/v1/search?name=' . urlencode($cidade)
        . '&count=1&language=pt&format=json';
$geo = buscar($urlGeo);

if ($geo === null) {
    erro('Falha ao consultar o serviço de localização.', 502);
}
if (empty($geo['results'])) {
    erro('Cidade não encontrada. Tente outro nome.', 404);
}

$local = $geo['results'][0];

// 2) Consulta o clima atual com as coordenadas
$urlClima = 'https://api.open-meteo.com/v1/forecast?latitude=' . $local['latitude']
          . '&longitude=' . $local['longitude']
          . '&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code'
          . '&timezone=auto';
$clima = buscar($urlClima);

if ($clima === null || !isset($clima['current'])) {
    erro('Falha ao consultar o serviço de clima.', 502);
}

$atual = $clima['current'];

// 3) Devolve só o que o JavaScript precisa
echo json_encode([
    'cidade'      => $local['name'],
    'regiao'      => trim(($local['admin1'] ?? '') . ', ' . ($local['country'] ?? ''), ', '),
    'temperatura' => $atual['temperature_2m'],
    'sensacao'    => $atual['apparent_temperature'],
    'umidade'     => $atual['relative_humidity_2m'],
    'vento'       => $atual['wind_speed_10m'],
    'codigo'      => $atual['weather_code'],
    'horario'     => $atual['time'],
], JSON_UNESCAPED_UNICODE);
