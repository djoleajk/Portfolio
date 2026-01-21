<?php

session_start();

require_once 'config/database.php';
require_once 'includes/auth.php';

require_once 'classes/User.php';
require_once 'classes/Post.php';
require_once 'classes/Category.php';
require_once 'classes/Tag.php';
require_once 'classes/Comment.php';

$userClass = new User($db);
$postClass = new Post($db);
$categoryClass = new Category($db);
$tagClass = new Tag($db);
$commentClass = new Comment($db);

$page = isset($_GET['page']) ? $_GET['page'] : 'home';

if (isset($_POST['user_action'])) {
    if (!verify_csrf_token()) {
        $_SESSION['message'] = 'Invalid security token.';
        $_SESSION['message_type'] = 'danger';
        header('Location: ' . $_SERVER['HTTP_REFERER']);
        exit;
    }

    switch ($_POST['user_action']) {
        case 'login':
            if ($userClass->login($_POST['email'], $_POST['password'])) {
                $_SESSION['message'] = 'Welcome back!';
                $_SESSION['message_type'] = 'success';
                header('Location: index.php?page=admin');
                exit;
            }
            $error = 'Invalid email or password.';
            break;

        case 'register':
            $user_id = $userClass->createUser($_POST['username'], $_POST['email'], $_POST['password']);
            if ($user_id) {

                $_SESSION['user_id'] = $user_id;
                $_SESSION['username'] = $_POST['username'];
                $_SESSION['role'] = 'user';
                $_SESSION['message'] = 'Registration successful. Welcome!';
                $_SESSION['message_type'] = 'success';
                header('Location: index.php');
                exit;
            } else {
                $_SESSION['message'] = 'Registration failed. Email may already be in use.';
                $_SESSION['message_type'] = 'danger';
                header('Location: index.php?page=register');
                exit;
            }
            break;

        case 'update':
            if ($userClass->updateUser($_POST['id'], $_POST['username'], $_POST['email'], $_POST['role'], $_POST['password'])) {
                $_SESSION['message'] = 'User updated successfully.';
                $_SESSION['message_type'] = 'success';
            } else {
                $_SESSION['message'] = 'Failed to update user.';
                $_SESSION['message_type'] = 'danger';
            }
            header('Location: index.php?page=admin');
            exit;
            break;
    }
}

if (isset($_POST['post_action'])) {

    error_log("Starting post action: " . print_r($_POST, true));

if (!isset($_SESSION['user_id'])) {
        $_SESSION['message'] = 'You must be logged in to create posts.';
        $_SESSION['message_type'] = 'danger';
        header('Location: index.php?page=login');
        exit;
    }

$title = isset($_POST['title']) ? trim($_POST['title']) : '';
    $content = isset($_POST['content']) ? trim($_POST['content']) : '';
    $category_id = isset($_POST['category_id']) ? (int)$_POST['category_id'] : 0;

if (empty($title)) {
        $_SESSION['message'] = 'Title is required.';
        $_SESSION['message_type'] = 'danger';
        header('Location: ' . $_SERVER['HTTP_REFERER']);
        exit;
    }

    if (empty($content)) {
        $_SESSION['message'] = 'Content is required.';
        $_SESSION['message_type'] = 'danger';
        header('Location: ' . $_SERVER['HTTP_REFERER']);
        exit;
    }

    if (empty($category_id)) {
        $_SESSION['message'] = 'Category is required.';
        $_SESSION['message_type'] = 'danger';
        header('Location: ' . $_SERVER['HTTP_REFERER']);
        exit;
    }

$tags = [];
    if (!empty($_POST['tags']) && is_array($_POST['tags'])) {
        $tags = array_map('intval', $_POST['tags']);
    }

    switch ($_POST['post_action']) {
        case 'create':
            try {
                $result = $postClass->createPost($title, $content, $_SESSION['user_id'], $category_id, $tags);
                if ($result) {
                    $_SESSION['message'] = 'Post created successfully.';
                    $_SESSION['message_type'] = 'success';
                    header('Location: index.php?page=admin');
                    exit;
                } else {
                    throw new Exception('Failed to create post');
                }
            } catch (Exception $e) {
                error_log("Post creation error: " . $e->getMessage());
                $_SESSION['message'] = 'Error creating post. Please try again.';
                $_SESSION['message_type'] = 'danger';
                header('Location: ' . $_SERVER['HTTP_REFERER']);
                exit;
            }
            break;

        case 'update':

            if (strlen($title) > 255 || strlen($content) > 65535) {
                die("Invalid input length detected. Access denied.");
            }

            if ($postClass->updatePost($_POST['id'], $title, $content, $category_id, $tags)) {
                $_SESSION['message'] = 'Post updated successfully.';
                $_SESSION['message_type'] = 'success';
            } else {
                $_SESSION['message'] = 'Failed to update post.';
                $_SESSION['message_type'] = 'danger';
            }
            header('Location: index.php?page=admin');
            exit;
            break;

        case 'delete':
            if ($postClass->deletePost($_POST['id'])) {
                $_SESSION['message'] = 'Post deleted successfully.';
                $_SESSION['message_type'] = 'success';
            } else {
                $_SESSION['message'] = 'Failed to delete post.';
                $_SESSION['message_type'] = 'danger';
            }
            header('Location: index.php?page=admin');
            exit;
            break;
    }
}

if (isset($_POST['category_action'])) {
    switch ($_POST['category_action']) {
        case 'create':
            if ($categoryClass->createCategory($_POST['name'], $_POST['description'])) {
                $_SESSION['message'] = 'Category created successfully.';
                $_SESSION['message_type'] = 'success';
            } else {
                $_SESSION['message'] = 'Failed to create category.';
                $_SESSION['message_type'] = 'danger';
            }
            header('Location: index.php?page=admin');
            exit;
            break;

        case 'update':
            if ($categoryClass->updateCategory($_POST['id'], $_POST['name'], $_POST['description'])) {
                $_SESSION['message'] = 'Category updated successfully.';
                $_SESSION['message_type'] = 'success';
            } else {
                $_SESSION['message'] = 'Failed to update category.';
                $_SESSION['message_type'] = 'danger';
            }
            header('Location: index.php?page=admin');
            exit;
            break;

        case 'delete':
            if ($categoryClass->deleteCategory($_POST['id'])) {
                $_SESSION['message'] = 'Category deleted successfully.';
                $_SESSION['message_type'] = 'success';
            } else {
                $_SESSION['message'] = 'Failed to delete category.';
                $_SESSION['message_type'] = 'danger';
            }
            header('Location: index.php?page=admin');
            exit;
            break;
    }
}

if (isset($_POST['tag_action'])) {
    switch ($_POST['tag_action']) {
        case 'create':
            if ($tagClass->createTag($_POST['name'])) {
                $_SESSION['message'] = 'Tag created successfully.';
                $_SESSION['message_type'] = 'success';
            } else {
                $_SESSION['message'] = 'Failed to create tag.';
                $_SESSION['message_type'] = 'danger';
            }
            header('Location: index.php?page=admin');
            exit;
            break;

        case 'update':
            if ($tagClass->updateTag($_POST['id'], $_POST['name'])) {
                $_SESSION['message'] = 'Tag updated successfully.';
                $_SESSION['message_type'] = 'success';
            } else {
                $_SESSION['message'] = 'Failed to update tag.';
                $_SESSION['message_type'] = 'danger';
            }
            header('Location: index.php?page=admin');
            exit;
            break;

        case 'delete':
            if ($tagClass->deleteTag($_POST['id'])) {
                $_SESSION['message'] = 'Tag deleted successfully.';
                $_SESSION['message_type'] = 'success';
            } else {
                $_SESSION['message'] = 'Failed to delete tag.';
                $_SESSION['message_type'] = 'danger';
            }
            header('Location: index.php?page=admin');
            exit;
            break;
    }
}

if (isset($_POST['comment_action'])) {
    switch ($_POST['comment_action']) {
        case 'create':
            if ($commentClass->createComment($_POST['post_id'], $_SESSION['user_id'], $_POST['content'])) {
                $_SESSION['message'] = 'Comment added successfully.';
                $_SESSION['message_type'] = 'success';
            } else {
                $_SESSION['message'] = 'Failed to add comment.';
                $_SESSION['message_type'] = 'danger';
            }
            header('Location: index.php?page=post&id=' . $_POST['post_id']);
            exit;
            break;

        case 'delete':
            if ($commentClass->deleteComment($_GET['id'])) {
                $_SESSION['message'] = 'Comment deleted successfully.';
                $_SESSION['message_type'] = 'success';
            } else {
                $_SESSION['message'] = 'Failed to delete comment.';
                $_SESSION['message_type'] = 'danger';
            }
            header('Location: index.php?page=post&id=' . $_GET['post_id']);
            exit;
            break;
    }
}

if (isset($_GET['action']) && $_GET['action'] == 'logout') {

    $_SESSION = [];

session_destroy();

session_regenerate_id(true);

    $_SESSION['message'] = 'You have been logged out.';
    $_SESSION['message_type'] = 'success';
    header('Location: index.php');
    exit;
}

$protected_pages = ['admin', 'edit_post', 'edit_category', 'edit_tag', 'edit_user'];
if (in_array($page, $protected_pages) && !$userClass->isLoggedIn()) {
    $_SESSION['message'] = 'Please login to access this page.';
    $_SESSION['message_type'] = 'warning';
    header('Location: index.php?page=login');
    exit;
}

$admin_pages = ['edit_user'];
if (in_array($page, $admin_pages) && !$userClass->isAdmin()) {
    $_SESSION['message'] = 'Access denied. Admin privileges required.';
    $_SESSION['message_type'] = 'danger';
    header('Location: index.php');
    exit;
}

if (isset($_GET['action']) && $_GET['action'] === 'upload_image') {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(403);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }

    $upload_dir = 'uploads/';
    if (!file_exists($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    if (isset($_FILES['file'])) {
        $file = $_FILES['file'];
        $filename = uniqid() . '_' . basename($file['name']);
        $target_path = $upload_dir . $filename;

        if (move_uploaded_file($file['tmp_name'], $target_path)) {
            echo json_encode(['location' => $target_path]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to upload file']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'No file uploaded']);
    }
    exit;
}

switch ($page) {
    case 'home':
        $current_page = isset($_GET['p']) ? (int)$_GET['p'] : 1;
        $posts_per_page = 10;
        $posts = $postClass->getAllPosts($current_page, $posts_per_page);
        $total_posts = $postClass->getTotalPosts();
        $total_pages = ceil($total_posts / $posts_per_page);
        $categories = $categoryClass->getAllCategories();
        $tags = $tagClass->getAllTags();
        break;

    case 'post':
        $post = $postClass->getPostById($_GET['id']);
        if (!$post) {
            $_SESSION['message'] = 'Post not found.';
            $_SESSION['message_type'] = 'danger';
            header('Location: index.php');
            exit;
        }
        $comments = $commentClass->getAllComments($post['id']);
        $categories = $categoryClass->getAllCategories();
        $tags = $tagClass->getAllTags();
        break;

    case 'category':
        $category = $categoryClass->getCategoryById($_GET['id']);
        if (!$category) {
            $_SESSION['message'] = 'Category not found.';
            $_SESSION['message_type'] = 'danger';
            header('Location: index.php');
            exit;
        }
        $current_page = isset($_GET['p']) ? (int)$_GET['p'] : 1;
        $posts_per_page = 10;
        $posts = $postClass->getPostsByCategory($category['id'], $current_page, $posts_per_page);
        $categories = $categoryClass->getAllCategories();
        $tags = $tagClass->getAllTags();
        break;

    case 'tag':
        $tag = $tagClass->getTagById($_GET['id']);
        if (!$tag) {
            $_SESSION['message'] = 'Tag not found.';
            $_SESSION['message_type'] = 'danger';
            header('Location: index.php');
            exit;
        }
        $current_page = isset($_GET['p']) ? (int)$_GET['p'] : 1;
        $posts_per_page = 10;
        $posts = $postClass->getPostsByTag($tag['id'], $current_page, $posts_per_page);
        $categories = $categoryClass->getAllCategories();
        $tags = $tagClass->getAllTags();
        break;

    case 'admin':
        $posts = $postClass->getAllPosts();
        $categories = $categoryClass->getAllCategories();
        $tags = $tagClass->getAllTags();
        $users = $userClass->getAllUsers();
        break;

    case 'edit_post':
        $categories = $categoryClass->getAllCategories();
        $tags = $tagClass->getAllTags();
        if (isset($_GET['id'])) {
            $post = $postClass->getPostById($_GET['id']);
            if (!$post) {
                $_SESSION['message'] = 'Post not found.';
                $_SESSION['message_type'] = 'danger';
                header('Location: index.php?page=admin');
                exit;
            }
        }
        break;

    case 'edit_category':
        if (isset($_GET['id'])) {
            $category = $categoryClass->getCategoryById($_GET['id']);
            if (!$category) {
                $_SESSION['message'] = 'Category not found.';
                $_SESSION['message_type'] = 'danger';
                header('Location: index.php?page=admin');
                exit;
            }
        }
        break;

    case 'edit_tag':
        if (isset($_GET['id'])) {
            $tag = $tagClass->getTagById($_GET['id']);
            if (!$tag) {
                $_SESSION['message'] = 'Tag not found.';
                $_SESSION['message_type'] = 'danger';
                header('Location: index.php?page=admin');
                exit;
            }
        }
        break;

    case 'edit_user':
        if (isset($_GET['id'])) {
            $edit_user = $userClass->getUserById($_GET['id']);
            if (!$edit_user) {
                $_SESSION['message'] = 'User not found.';
                $_SESSION['message_type'] = 'danger';
                header('Location: index.php?page=admin');
                exit;
            }
        }
        break;
}

$template_file = 'templates/' . $page . '.php';
if (file_exists($template_file)) {
    require_once $template_file;
} else {
    $_SESSION['message'] = 'Page not found.';
    $_SESSION['message_type'] = 'danger';
    header('Location: index.php');
    exit;
}
?>