<?php
require_once 'includes/config.php';
require_once 'includes/functions.php';

$year = 2025;
?>
<!DOCTYPE html>
<html lang="sr">
<head>
    <meta charset="UTF-8">
    <title>Православни календар - Преглед за 2025. годину</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>Православни календар</h1>
            <nav>
                <ul>
                    <li><a href="index.php">Данашњи дан</a></li>
                    <li><a href="post.php">О посту</a></li>
                    <li><a href="obicaji.php">Обичаји</a></li>
                    <li><a href="calendar.php">Календар</a></li>
                </ul>
            </nav>
        </header>

        <main class="calendar-view">
            <h2>Преглед за 2025. годину</h2>
            <div class="calendar-month-grid">
                <?php for ($month = 1; $month <= 12; $month++): ?>
                    <div class="calendar-month-card">
                        <h3><?php echo format_serbian_date(sprintf('%04d-%02d-01', $year, $month)); ?></h3>
                        <div class="calendar-grid">
                            <?php
                            $calendar = get_next_month_calendar($month, $year);
                            foreach ($calendar as $day): ?>
                                <div class="calendar-day <?php echo get_celebration_style($day['saint']['celebration_type']); ?>">
                                    <div class="date">
                                        <?php
                                        $greg_date = new DateTime($day['gregorian_date']);
                                        $julian_date = new DateTime($day['julian_date']);
                                        echo $greg_date->format('d.m.') . ' (' . $julian_date->format('d.m.') . ')';
                                        ?>
                                    </div>
                                    <div class="saint-name"><?php echo htmlspecialchars($day['saint']['name']); ?></div>
                                    <div class="description"><?php echo htmlspecialchars($day['saint']['description']); ?></div>
                                    <div class="fasting-type"><?php echo htmlspecialchars($day['fasting']['fasting_type']); ?></div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                <?php endfor; ?>
            </div>
        </main>
    </div>
</body>
</html>
