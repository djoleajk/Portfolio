<?php include 'templates/header.php'; ?>

<div class="row justify-content-center">
    <div class="col-md-10">
        <div class="card">
            <div class="card-header">
                <h4 class="card-title mb-0"><?php echo isset($post) ? 'Edit Post' : 'New Post'; ?></h4>
            </div>
            <div class="card-body">
                <?php if (isset($error)): ?>
                    <div class="alert alert-danger">
                        <?php echo htmlspecialchars($error); ?>
                    </div>
                <?php endif; ?>

                <form method="post" action="index.php" id="postForm">
                    <input type="hidden" name="post_action" value="<?php echo isset($post) ? 'update' : 'create'; ?>">
                    <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
                    <?php if (isset($post)): ?>
                        <input type="hidden" name="id" value="<?php echo $post['id']; ?>">
                    <?php endif; ?>

                    <div class="mb-3">
                        <label for="title" class="form-label">Title</label>
                        <input type="text" class="form-control" id="title" name="title"
                               value="<?php echo isset($post) ? htmlspecialchars($post['title']) : ''; ?>" required>
                    </div>

                    <div class="mb-3">
                        <label for="content" class="form-label">Content</label>
                        <textarea class="form-control" id="content" name="content" required><?php
                            echo isset($post) ? htmlspecialchars($post['content']) : '';
                        ?></textarea>
                    </div>

                    <div class="mb-3">
                        <label for="category_id" class="form-label">Category</label>
                        <select class="form-control" id="category_id" name="category_id" required>
                            <option value="">Select Category</option>
                            <?php foreach ($categories as $category): ?>
                                <option value="<?php echo $category['id']; ?>"
                                    <?php echo isset($post) && $post['category_id'] == $category['id'] ? 'selected' : ''; ?>>
                                    <?php echo htmlspecialchars($category['name']); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Tags</label>
                        <div class="d-flex flex-wrap gap-2">
                            <?php foreach ($tags as $tag): ?>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" name="tags[]"
                                           value="<?php echo $tag['id']; ?>" id="tag_<?php echo $tag['id']; ?>"
                                           <?php echo isset($post_tags) && in_array($tag['id'], array_column($post_tags, 'id')) ? 'checked' : ''; ?>>
                                    <label class="form-check-label" for="tag_<?php echo $tag['id']; ?>">
                                        <?php echo htmlspecialchars($tag['name']); ?>
                                    </label>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="status" class="form-label">Status</label>
                        <select class="form-control" id="status" name="status">
                            <option value="draft" <?php echo isset($post) && $post['status'] == 'draft' ? 'selected' : ''; ?>>
                                Draft
                            </option>
                            <option value="published" <?php echo isset($post) && $post['status'] == 'published' ? 'selected' : ''; ?>>
                                Published
                            </option>
                        </select>
                    </div>

                    <div class="d-flex justify-content-between">
                        <a href="index.php?page=admin" class="btn btn-secondary">Cancel</a>
                        <button type="submit" class="btn btn-primary" id="submitBtn">
                            <?php echo isset($post) ? 'Update Post' : 'Create Post'; ?>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    let editor;
    const contentElement = document.querySelector('#content');

    if (contentElement) {
        ClassicEditor
            .create(contentElement, {
                toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'outdent', 'indent', '|', 'blockQuote', 'insertTable', 'undo', 'redo'],
                heading: {
                    options: [
                        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
                    ]
                }
            })
            .then(newEditor => {
                editor = newEditor;
                console.log('CKEditor initialized successfully');
            })
            .catch(error => {
                console.error('CKEditor initialization error:', error);
            });
    }

const form = document.getElementById('postForm');
    const submitBtn = document.getElementById('submitBtn');

    if (form && submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();

            if (editor) {

                const content = editor.getData();

document.getElementById('content').value = content;

form.submit();
            } else {

                form.submit();
            }
        });
    }
});
</script>

<?php include 'templates/footer.php'; ?>