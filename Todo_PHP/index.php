<?php
require_once 'config/database.php';
require_once 'operations.php';

$tasks = getTasks($conn);
?>
<!DOCTYPE html>
<html lang="sr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo Lista</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container py-5">
        <h1 class="mb-4">Todo Lista</h1>

        <div class="card mb-4">
            <div class="card-body">
                <form action="operations.php" method="POST">
                    <div class="input-group">
                        <input type="text" name="task" class="form-control" placeholder="Dodaj novi zadatak..." required>
                        <button type="submit" name="add" class="btn btn-primary">Dodaj</button>
                    </div>
                </form>
            </div>
        </div>

        <div class="card">
            <div class="card-body">
                <ul class="list-group">
                    <?php foreach ($tasks as $task): ?>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <span class="<?php echo $task['completed'] ? 'text-decoration-line-through' : ''; ?>">
                            <?php echo htmlspecialchars($task['task']); ?>
                        </span>
                        <div>
                            <form action="operations.php" method="POST" class="d-inline">
                                <input type="hidden" name="id" value="<?php echo $task['id']; ?>">
                                <button type="submit" name="toggle" class="btn btn-sm btn-success">
                                    <?php echo $task['completed'] ? 'Poništi' : 'Završi'; ?>
                                </button>
                                <button type="submit" name="delete" class="btn btn-sm btn-danger">Obriši</button>
                            </form>
                        </div>
                    </li>
                    <?php endforeach; ?>
                </ul>
            </div>
        </div>
    </div>

    <div class="container">
        <div class="text-center mt-4">
            <p class="text-muted">&copy; <?php echo date('Y'); ?> Todo List. All rights reserved - Agencija Sprint</p>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
