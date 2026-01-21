<?php
function convert_to_julian($gregorian_date) {
    $greg = new DateTime($gregorian_date);
    $diff = 13;
    $greg->modify("-$diff days");
    return $greg->format('Y-m-d');
}

function convert_to_gregorian($julian_date) {
    $julian = new DateTime($julian_date);
    $diff = 13;
    $julian->modify("+$diff days");
    return $julian->format('Y-m-d');
}

function format_serbian_date($date, $show_both = false) {
    $months = array(
        1 => 'јануар', 'фебруар', 'март', 'април', 'мај', 'јун',
        'јул', 'август', 'септембар', 'октобар', 'новембар', 'децембар'
    );

    $julian_date = new DateTime($date);
    $gregorian_date = new DateTime(convert_to_gregorian($date));

    $day = $julian_date->format('j');
    $month = $months[$julian_date->format('n')];
    $year = $julian_date->format('Y');

    if ($show_both) {
        $greg_day = $gregorian_date->format('j');
        $greg_month = $months[$gregorian_date->format('n')];
        return "$day. $month $year. ($greg_day. $greg_month по новом)";
    }

    return "$day. $month $year.";
}

function get_daily_saint($date) {
    global $conn;
    $query = "SELECT * FROM saints WHERE julian_date = ? LIMIT 1";
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        return null;
    }

    $stmt->bind_param("s", $date);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        return $result->fetch_assoc();
    }
    return array(
        'name' => 'Нема података',
        'description' => 'Подаци нису доступни за овај дан.',
        'celebration_type' => 'обично'
    );
}

function get_fasting_type($date) {
    global $conn;
    $query = "SELECT * FROM fasting_rules WHERE julian_date = ? LIMIT 1";
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        return null;
    }

    $stmt->bind_param("s", $date);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        return $result->fetch_assoc();
    }
    return array(
        'fasting_type' => 'мрсни дан',
        'description' => 'Нема посебних правила поста.'
    );
}

function get_monthly_saints($month, $year) {
    global $conn;
    $query = "SELECT * FROM saints
              WHERE MONTH(julian_date) = ? AND YEAR(julian_date) = ?
              ORDER BY julian_date";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ii", $month, $year);
    $stmt->execute();
    return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
}

function get_celebration_style($celebration_type) {
    switch($celebration_type) {
        case 'црвено слово':
            return 'celebration-important';
        case 'подебљано':
            return 'celebration-medium';
        default:
            return 'celebration-normal';
    }
}

function is_valid_date($date) {
    return (bool)strtotime($date);
}

function clean_html($text) {
    return strip_tags(trim($text));
}

function get_next_month_calendar($month, $year) {
    $next_month = $month + 1;
    $next_year = $year;

    if ($next_month > 12) {
        $next_month = 1;
        $next_year++;
    }

    $days_in_month = cal_days_in_month(CAL_GREGORIAN, $next_month, $next_year);
    $calendar = [];

    for ($day = 1; $day <= $days_in_month; $day++) {
        $gregorian_date = sprintf('%04d-%02d-%02d', $next_year, $next_month, $day);
        $julian_date = convert_to_julian($gregorian_date);

        $saint = get_daily_saint($julian_date);
        $fasting = get_fasting_type($julian_date);

        $calendar[] = [
            'gregorian_date' => $gregorian_date,
            'julian_date' => $julian_date,
            'saint' => $saint,
            'fasting' => $fasting
        ];
    }

    return $calendar;
}

function get_customs_for_day($saint_name) {
    global $conn;
    $query = "SELECT * FROM customs WHERE event_name = ? LIMIT 1";
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        return null;
    }

    $stmt->bind_param("s", $saint_name);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        return $result->fetch_assoc();
    }
    return null;
}

function get_today_info() {
    $today_gregorian = date('Y-m-d');
    $today_julian = convert_to_julian($today_gregorian);

    $daily_saint = get_daily_saint($today_julian);
    $fasting_type = get_fasting_type($today_julian);
    $customs = get_customs_for_day($daily_saint['name']);

    return [
        'date' => format_serbian_date($today_julian, true),
        'saint' => $daily_saint,
        'fasting' => $fasting_type,
        'customs' => $customs
    ];
}
?>
