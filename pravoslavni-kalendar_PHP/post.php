<?php require_once 'includes/config.php'; ?>
<!DOCTYPE html>
<html lang="sr">
<head>
    <meta charset="UTF-8">
    <title>О посту - Православни календар</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>О посту</h1>
            <nav>
                <ul>
                    <li><a href="index.php">Данашњи дан</a></li>
                    <li><a href="post.php">О посту</a></li>
                    <li><a href="obicaji.php">Обичаји</a></li>
                    <li><a href="calendar.php">Календар</a></li>
                </ul>
            </nav>
        </header>

        <main class="content-section">
            <section class="fasting-types">
                <h2>Врсте поста</h2>

                <article class="fasting-type">
                    <h3>Пост на води</h3>
                    <p>Најстрожији облик поста где се једе само храна биљног порекла припремљена на води, без уља.</p>
                </article>

                <article class="fasting-type">
                    <h3>Пост на уљу</h3>
                    <p>Дозвољена је храна биљног порекла припремљена на уљу.</p>
                </article>

                <article class="fasting-type">
                    <h3>Пост са рибом</h3>
                    <p>Поред хране биљног порекла, дозвољена је и риба.</p>
                </article>

                <article class="fasting-type">
                    <h3>Мрсни дани</h3>
                    <p>Дани када је дозвољена сва храна.</p>
                </article>
            </section>
        </main>
    </div>
</body>
</html>
