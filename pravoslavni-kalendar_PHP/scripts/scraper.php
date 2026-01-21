<?php
require_once '../includes/config.php';
require_once '../includes/functions.php';

set_time_limit(0);

function fetch_page($url) {
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_SSL_VERIFYPEER => false
    ]);

    $response = curl_exec($ch);
    if (curl_errno($ch)) {
        echo "Грешка при преузимању странице: " . curl_error($ch) . "\n";
        return false;
    }
    curl_close($ch);
    return $response;
}

function parse_saint_data($html) {
    if (!$html) return [];

    $dom = new DOMDocument();
    @$dom->loadHTML(mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8'));
    $xpath = new DOMXPath($dom);

    $saints = [];

$saintNodes = $xpath->query("//div[contains(@class, 'svetitelj')]");
    foreach ($saintNodes as $node) {
        $nameNode = $xpath->query(".//h2", $node)->item(0);
        $descNode = $xpath->query(".//div[contains(@class, 'opis')]", $node)->item(0);

        if (!$nameNode) continue;

        $name = trim($nameNode->textContent);
        $desc = $descNode ? trim($descNode->textContent) : '';

$celebrationType = 'обично';
        if ($xpath->query(".//span[contains(@class, 'crveno')]", $node)->length > 0) {
            $celebrationType = 'црвено слово';
        } elseif ($xpath->query(".//strong", $node)->length > 0) {
            $celebrationType = 'подебљано';
        }

        $saints[] = [
            'name' => $name,
            'description' => $desc,
            'celebration_type' => $celebrationType
        ];
    }

    return $saints;
}

function save_saint_data($date, $saints, $fastingType) {
    global $conn;

    if (empty($saints)) {
        echo "Нема података за датум $date\n";
        return;
    }

$stmt = $conn->prepare("INSERT INTO fasting_rules (julian_date, fasting_type)
                           VALUES (?, ?) ON DUPLICATE KEY UPDATE
                           fasting_type = VALUES(fasting_type)");
    if ($stmt) {
        $stmt->bind_param('ss', $date, $fastingType);
        $stmt->execute();
    } else {
        echo "Грешка при чувању података о посту: " . $conn->error . "\n";
    }

$stmt = $conn->prepare("INSERT INTO saints (julian_date, gregorian_date, name, description, celebration_type)
                           VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE
                           description = VALUES(description), celebration_type = VALUES(celebration_type)");
    foreach ($saints as $saint) {
        try {
            $gregorian = convert_to_gregorian($date);
            $stmt->bind_param('sssss',
                $date,
                $gregorian,
                $saint['name'],
                $saint['description'],
                $saint['celebration_type']
            );
            $stmt->execute();
            echo "Сачувано: {$saint['name']} ({$saint['celebration_type']})\n";
        } catch (Exception $e) {
            echo "Грешка: " . $e->getMessage() . "\n";
        }
    }
}

try {
    $start_date = new DateTime();
    $end_date = (new DateTime())->modify('+1 year');

    echo "Започињем преузимање података са crkvenikalendar.rs...\n";

    while ($start_date <= $end_date) {
        $formatted_date = $start_date->format('Y/m/d');
        $url = "https://crkvenikalendar.rs/danas/$formatted_date";

        echo "\nПреузимам податке за " . $start_date->format('d.m.Y.') . "\n";

        $html = fetch_page($url);
        if ($html) {
            $saints = parse_saint_data($html);

$fastingType = 'мрсни дан';
            if (strpos($html, 'пост на води') !== false) $fastingType = 'пост на води';
            elseif (strpos($html, 'на уљу') !== false) $fastingType = 'пост на уљу';
            elseif (strpos($html, 'риба') !== false) $fastingType = 'риба дозвољена';

            save_saint_data($start_date->format('Y-m-d'), $saints, $fastingType);
        }

        $start_date->modify('+1 day');
        sleep(2);
    }

    echo "\nПреузимање завршено!\n";
} catch (Exception $e) {
    echo "Грешка: " . $e->getMessage() . "\n";
}
