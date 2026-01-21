</div>

    <footer class="footer">
        <div class="container">
            <div class="text-center">
                <p>&copy; <?php echo date('Y'); ?> Simple PHP CMS. All rights reserved - Agencija Sprint</p>
            </div>
        </div>
    </footer>

    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>

    
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

    
    <script>

        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        })

var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
        var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl)
        })

window.setTimeout(function() {
            document.querySelectorAll(".alert").forEach(function(alert) {
                if (alert.classList.contains("alert-dismissible")) {
                    new bootstrap.Alert(alert).close()
                }
            })
        }, 5000)

$('.edit-post').click(function() {
            var postId = $(this).data('id');

            alert('Edit post ' + postId);
        });

$('.edit-category').click(function() {
            var categoryId = $(this).data('id');

            alert('Edit category ' + categoryId);
        });

$('.edit-tag').click(function() {
            var tagId = $(this).data('id');

            alert('Edit tag ' + tagId);
        });
    </script>
</body>
</html>