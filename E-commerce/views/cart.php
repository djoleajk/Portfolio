<!DOCTYPE html>
<html>
<head>
    <title>E-commerce - Shopping Cart</title>
</head>
<body>
    <main class="container my-5">
        <h1 class="mb-4">Shopping Cart</h1>
        <div class="cart-items">
            <?php
            if (!isset($_SESSION['cart']) || empty($_SESSION['cart'])) {
                echo "<p>Your cart is empty.</p>";
            } else {
                $total = 0;
                foreach ($_SESSION['cart'] as $product_id => $quantity) {
                    $query = "SELECT * FROM products WHERE id = ?";
                    $stmt = $conn->prepare($query);
                    $stmt->bind_param("i", $product_id);
                    $stmt->execute();
                    $result = $stmt->get_result();
                    $product = $result->fetch_assoc();

                    if ($product) {
                        $subtotal = $product['price'] * $quantity;
                        $total += $subtotal;
                        ?>
                        <div class="cart-item">
                            <h3><?php echo htmlspecialchars($product['name']); ?></h3>
                            <p>Price: $<?php echo number_format($product['price'], 2); ?></p>
                            <p>Quantity: <?php echo $quantity; ?></p>
                            <p>Subtotal: $<?php echo number_format($subtotal, 2); ?></p>
                            <form method="post" action="index.php?route=cart&action=remove">
                                <input type="hidden" name="product_id" value="<?php echo $product_id; ?>">
                                <button type="submit" class="btn btn-danger">Remove</button>
                            </form>
                        </div>
                        <?php
                    }
                }
                ?>
                <div class="cart-total">
                    <h3>Total: $<?php echo number_format($total, 2); ?></h3>
                    <div class="d-flex gap-2">
                        <a href="index.php?route=checkout" class="btn btn-primary">Proceed to Checkout</a>
                        <a href="index.php?action=cancel" class="btn btn-danger">Cancel Order</a>
                    </div>
                </div>
                <?php
            }
            ?>
        </div>
    </main>
</body>
</html>
