<?php
require_once 'includes/config.php';
require_once 'includes/functions.php';

$today_info = get_today_info();
?>
<!DOCTYPE html>
<html lang="sr">
<head>
    <meta charset="UTF-8">
    <title>Православни календар</title>
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

        <main>
            <div class="daily-info">
                <h2>Данас је <?php echo $today_info['date']; ?></h2>
                <h3>Светитељ дана:
                    <span class="<?php echo get_celebration_style($today_info['saint']['celebration_type']); ?>">
                        <?php echo htmlspecialchars($today_info['saint']['name']); ?>
                    </span>
                </h3>
                <div class="saint-description">
                    <?php echo htmlspecialchars($today_info['saint']['description']); ?>
                </div>
            </div>

            <div class="fasting-info">
                <h3>Пост данас:</h3>
                <p><?php echo htmlspecialchars($today_info['fasting']['description']); ?></p>
            </div>

            <div class="customs-info">
                <h3>Шта ваља радити данас:</h3>
                <p><?php echo htmlspecialchars($today_info['customs']['during_celebration'] ?? 'Нема посебних обичаја за овај дан.'); ?></p>
            </div>
        </main>
    </div>
</body>
</html>
