<?php include 'templates/header.php'; ?>

<div class="container mt-5">
    <h2 class="text-center text-primary mb-4">Rezervacija Termina</h2>
    <form method="post" action="index.php?page=book" class="p-4 border rounded shadow-sm bg-light">
        <div class="mb-3">
            <label for="name" class="form-label">Ime i Prezime</label>
            <input type="text" class="form-control" id="name" name="name" placeholder="Unesite ime i prezime" required>
        </div>
        <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" class="form-control" id="email" name="email" placeholder="Unesite email adresu" required>
        </div>
        <div class="mb-3">
            <label for="phone" class="form-label">Telefon</label>
            <input type="tel" class="form-control" id="phone" name="phone" placeholder="Unesite broj telefona" required>
        </div>
        <div class="mb-3">
            <label for="date" class="form-label">Datum</label>
            <input type="date" class="form-control" id="date" name="date" required>
        </div>
        <div class="mb-3">
            <label for="time" class="form-label">Vreme</label>
            <input type="time" class="form-control" id="time" name="time" required>
        </div>
        <button type="submit" class="btn btn-primary w-100">Rezerviši</button>
    </form>
</div>

<?php include 'templates/footer.php'; ?>
