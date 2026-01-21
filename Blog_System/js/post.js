/**
 * Single Post Page Application
 * Handles single post view and comments
 */

import db from './db.js';
import auth from './auth.js';
import posts from './posts.js';
import comments from './comments.js';
import ui from './ui.js';

class PostApp {
    constructor() {
        this.postSlug = null;
        this.currentPost = null;
    }

    /**
     * Initialize the post page
     */
    async init() {
        try {
            // Initialize database
            await db.init();
            
            // Initialize auth
            await auth.init();

            // Get post slug from URL
            const urlParams = new URLSearchParams(window.location.search);
            this.postSlug = urlParams.get('slug');

            if (!this.postSlug) {
                ui.showAlert('Post nije pronađen', 'danger');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
                return;
            }

            // Setup UI
            this.setupUI();
            this.updateAuthUI();

            // Load post
            await this.loadPost();

            // Load comments
            await this.loadComments();

            // Load related posts
            await this.loadRelatedPosts();

        } catch (error) {
            console.error('Failed to initialize post page:', error);
            ui.showAlert('Greška pri učitavanju posta', 'danger');
        }
    }

    /**
     * Setup UI event handlers
     */
    setupUI() {
        ui.setupModalHandlers();
        ui.setupNavigation();

        // Auth buttons
        document.getElementById('loginBtn')?.addEventListener('click', () => {
            ui.showModal('loginModal');
        });

        document.getElementById('registerBtn')?.addEventListener('click', () => {
            ui.showModal('registerModal');
        });

        document.getElementById('logoutBtn')?.addEventListener('click', async () => {
            await auth.logout();
            ui.showAlert('Uspešno ste se odjavili', 'success');
            this.updateAuthUI();
            await this.loadComments();
        });

        document.getElementById('loginPromptBtn')?.addEventListener('click', () => {
            ui.showModal('loginModal');
        });

        // Login form
        document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin(e.target);
        });

        // Comment form
        document.getElementById('commentForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleCommentSubmit();
        });

        // Edit comment form
        document.getElementById('editCommentForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleEditCommentSubmit();
        });

        // Post actions
        document.getElementById('editPostBtn')?.addEventListener('click', () => {
            this.handleEditPost();
        });

        document.getElementById('deletePostBtn')?.addEventListener('click', async () => {
            await this.handleDeletePost();
        });
    }

    /**
     * Update auth UI
     */
    updateAuthUI() {
        const user = auth.getCurrentUser();
        
        if (user) {
            ui.hide('#authButtons');
            ui.show('#userMenu');
            
            const greeting = document.getElementById('userGreeting');
            if (greeting) {
                greeting.textContent = `Zdravo, ${user.name}`;
            }

            if (user.role === 'admin' || user.role === 'editor') {
                ui.show('#adminLink');
            }

            // Show comment form
            ui.show('#commentFormContainer');
            ui.hide('#commentLoginPrompt');
        } else {
            ui.show('#authButtons');
            ui.hide('#userMenu');
            ui.hide('#adminLink');
            
            // Show login prompt
            ui.hide('#commentFormContainer');
            const loginPrompt = document.getElementById('commentLoginPrompt');
            if (loginPrompt) {
                loginPrompt.style.display = 'block';
            }
        }
    }

    /**
     * Handle login
     */
    async handleLogin(form) {
        if (!ui.validateForm(form)) return;

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            await auth.login(email, password);
            ui.hideModal('loginModal');
            ui.showAlert('Uspešno ste se prijavili!', 'success');
            this.updateAuthUI();
            await this.loadComments();
        } catch (error) {
            ui.showAlert(error.message, 'danger');
        }
    }

    /**
     * Load post
     */
    async loadPost() {
        const container = document.getElementById('postArticle');
        if (!container) return;

        ui.showSpinner('loadingSpinner');

        try {
            const post = await posts.getBySlug(this.postSlug);
            
            if (!post) {
                container.innerHTML = '<p class="empty-state">Post nije pronađen</p>';
                return;
            }

            // Check if user can view draft posts
            if (post.status === 'draft' && !auth.canEditPost(post)) {
                container.innerHTML = '<p class="empty-state">Post nije dostupan</p>';
                return;
            }

            this.currentPost = post;

            // Increment views
            await posts.incrementViews(post.id);

            // Render post
            container.innerHTML = '';
            container.appendChild(this.createPostElement(post));

            // Show post actions if user can edit
            if (auth.canEditPost(post)) {
                ui.show('#postActions');
            }

            // Update page title
            document.title = `${post.title} - Blog Sistem`;

        } catch (error) {
            console.error('Failed to load post:', error);
            container.innerHTML = '<p class="empty-state">Greška pri učitavanju posta</p>';
        } finally {
            ui.hideSpinner('loadingSpinner');
        }
    }

    /**
     * Create post element
     */
    createPostElement(post) {
        const article = document.createElement('article');

        // Header
        const header = document.createElement('header');
        header.className = 'post-header';

        const title = document.createElement('h1');
        title.className = 'post-title';
        title.textContent = post.title;
        header.appendChild(title);

        const meta = document.createElement('div');
        meta.className = 'post-meta';

        const author = document.createElement('span');
        author.textContent = `Autor: ${post.authorName}`;
        meta.appendChild(author);

        const date = document.createElement('span');
        date.textContent = ui.formatDate(post.createdAt);
        meta.appendChild(date);

        const views = document.createElement('span');
        views.textContent = `👁️ ${post.views || 0} pregleda`;
        meta.appendChild(views);

        if (post.status === 'draft') {
            const status = document.createElement('span');
            status.className = 'status-badge draft';
            status.textContent = 'Draft';
            meta.appendChild(status);
        }

        header.appendChild(meta);

        // Categories
        if (post.categories && post.categories.length > 0) {
            const categoriesDiv = document.createElement('div');
            categoriesDiv.className = 'post-card-categories';
            categoriesDiv.style.marginTop = 'var(--spacing-md)';
            post.categories.forEach(category => {
                const tag = document.createElement('span');
                tag.className = 'post-category-tag';
                tag.textContent = category;
                categoriesDiv.appendChild(tag);
            });
            header.appendChild(categoriesDiv);
        }

        article.appendChild(header);

        // Featured image
        if (post.featuredImage) {
            const img = document.createElement('img');
            img.src = post.featuredImage;
            img.alt = post.title;
            img.className = 'post-featured-image';
            article.appendChild(img);
        }

        // Content
        const content = document.createElement('div');
        content.className = 'post-content';
        content.innerHTML = ui.parseSimpleMarkdown(post.content);
        article.appendChild(content);

        // Tags
        if (post.tags && post.tags.length > 0) {
            const tagsDiv = document.createElement('div');
            tagsDiv.className = 'post-tags';
            post.tags.forEach(tag => {
                const tagSpan = document.createElement('span');
                tagSpan.className = 'post-tag';
                tagSpan.textContent = `#${tag}`;
                tagsDiv.appendChild(tagSpan);
            });
            article.appendChild(tagsDiv);
        }

        return article;
    }

    /**
     * Load comments
     */
    async loadComments() {
        if (!this.currentPost) return;

        const container = document.getElementById('commentsList');
        const countSpan = document.getElementById('commentsCount');
        if (!container) return;

        try {
            const threadedComments = await comments.getThreaded(this.currentPost.id);
            
            if (countSpan) {
                const totalCount = threadedComments.reduce(
                    (sum, c) => sum + 1 + (c.replies?.length || 0), 
                    0
                );
                countSpan.textContent = totalCount;
            }

            container.innerHTML = '';

            if (threadedComments.length === 0) {
                container.innerHTML = '<p class="empty-state">Nema komentara. Budite prvi koji će komentarisati!</p>';
                return;
            }

            threadedComments.forEach(comment => {
                container.appendChild(this.createCommentElement(comment));
            });

        } catch (error) {
            console.error('Failed to load comments:', error);
        }
    }

    /**
     * Create comment element
     */
    createCommentElement(comment, isReply = false) {
        const div = document.createElement('div');
        div.className = isReply ? 'comment comment-reply' : 'comment';

        const header = document.createElement('div');
        header.className = 'comment-header';

        const author = document.createElement('strong');
        author.className = 'comment-author';
        author.textContent = comment.userName;
        header.appendChild(author);

        const date = document.createElement('span');
        date.className = 'comment-date';
        date.textContent = ui.formatDate(comment.createdAt);
        header.appendChild(date);

        div.appendChild(header);

        const content = document.createElement('p');
        content.className = 'comment-content';
        content.textContent = comment.content;
        div.appendChild(content);

        // Actions
        const currentUser = auth.getCurrentUser();
        if (currentUser) {
            const actions = document.createElement('div');
            actions.className = 'comment-actions';

            // Reply button (only for parent comments)
            if (!isReply) {
                const replyBtn = document.createElement('button');
                replyBtn.className = 'comment-action-btn';
                replyBtn.textContent = 'Odgovori';
                replyBtn.addEventListener('click', () => this.handleReplyComment(comment));
                actions.appendChild(replyBtn);
            }

            // Edit button
            if (comments.canEdit(comment)) {
                const editBtn = document.createElement('button');
                editBtn.className = 'comment-action-btn';
                editBtn.textContent = 'Izmeni';
                editBtn.addEventListener('click', () => this.openEditCommentModal(comment));
                actions.appendChild(editBtn);
            }

            // Delete button
            if (comments.canDelete(comment)) {
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'comment-action-btn danger';
                deleteBtn.textContent = 'Obriši';
                deleteBtn.addEventListener('click', () => this.handleDeleteComment(comment.id));
                actions.appendChild(deleteBtn);
            }

            div.appendChild(actions);
        }

        // Render replies
        if (comment.replies && comment.replies.length > 0) {
            comment.replies.forEach(reply => {
                div.appendChild(this.createCommentElement(reply, true));
            });
        }

        return div;
    }

    /**
     * Handle comment submit
     */
    async handleCommentSubmit() {
        const content = document.getElementById('commentContent').value;
        const form = document.getElementById('commentForm');

        if (!content || content.trim().length < 3) {
            ui.showAlert('Komentar mora imati najmanje 3 karaktera', 'danger');
            return;
        }

        try {
            const parentId = form.dataset.parentId ? parseInt(form.dataset.parentId) : null;
            await comments.create(this.currentPost.id, content, parentId);
            
            form.reset();
            delete form.dataset.parentId;
            
            ui.showAlert('Komentar je uspešno dodat', 'success');
            await this.loadComments();
        } catch (error) {
            ui.showAlert(error.message, 'danger');
        }
    }

    /**
     * Handle reply to comment
     */
    handleReplyComment(comment) {
        const form = document.getElementById('commentForm');
        const textarea = document.getElementById('commentContent');
        
        form.dataset.parentId = comment.id;
        textarea.placeholder = `Odgovorite na komentar od ${comment.userName}...`;
        textarea.focus();
        
        // Scroll to form
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    /**
     * Open edit comment modal
     */
    openEditCommentModal(comment) {
        document.getElementById('editCommentId').value = comment.id;
        document.getElementById('editCommentContent').value = comment.content;
        ui.showModal('editCommentModal');
    }

    /**
     * Handle edit comment submit
     */
    async handleEditCommentSubmit() {
        const commentId = parseInt(document.getElementById('editCommentId').value);
        const content = document.getElementById('editCommentContent').value;

        if (!content || content.trim().length < 3) {
            ui.showAlert('Komentar mora imati najmanje 3 karaktera', 'danger');
            return;
        }

        try {
            await comments.update(commentId, { content });
            ui.hideModal('editCommentModal');
            ui.showAlert('Komentar je uspešno ažuriran', 'success');
            await this.loadComments();
        } catch (error) {
            ui.showAlert(error.message, 'danger');
        }
    }

    /**
     * Handle delete comment
     */
    async handleDeleteComment(commentId) {
        if (!ui.confirm('Da li ste sigurni da želite da obrišete ovaj komentar?')) {
            return;
        }

        try {
            await comments.delete(commentId);
            ui.showAlert('Komentar je obrisan', 'success');
            await this.loadComments();
        } catch (error) {
            ui.showAlert(error.message, 'danger');
        }
    }

    /**
     * Load related posts
     */
    async loadRelatedPosts() {
        if (!this.currentPost) return;

        const container = document.getElementById('relatedPosts');
        if (!container) return;

        try {
            const related = await posts.getRelated(this.currentPost.id, 3);
            
            container.innerHTML = '';

            if (related.length === 0) {
                container.parentElement.style.display = 'none';
                return;
            }

            related.forEach(post => {
                container.appendChild(this.createRelatedPostCard(post));
            });

        } catch (error) {
            console.error('Failed to load related posts:', error);
        }
    }

    /**
     * Create related post card
     */
    createRelatedPostCard(post) {
        const card = document.createElement('article');
        card.className = 'post-card';

        if (post.featuredImage) {
            const img = document.createElement('img');
            img.src = post.featuredImage;
            img.alt = post.title;
            img.className = 'post-card-image';
            card.appendChild(img);
        }

        const content = document.createElement('div');
        content.className = 'post-card-content';

        const title = document.createElement('h3');
        title.className = 'post-card-title';
        const link = document.createElement('a');
        link.href = `post.html?slug=${post.slug}`;
        link.textContent = post.title;
        title.appendChild(link);
        content.appendChild(title);

        const excerpt = document.createElement('p');
        excerpt.className = 'post-card-excerpt';
        excerpt.textContent = post.excerpt;
        content.appendChild(excerpt);

        card.appendChild(content);
        return card;
    }

    /**
     * Handle edit post
     */
    handleEditPost() {
        // Redirect to main page with edit mode
        window.location.href = `index.html?edit=${this.currentPost.id}`;
    }

    /**
     * Handle delete post
     */
    async handleDeletePost() {
        if (!ui.confirm('Da li ste sigurni da želite da obrišete ovaj post?')) {
            return;
        }

        try {
            await posts.delete(this.currentPost.id);
            ui.showAlert('Post je obrisan', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } catch (error) {
            ui.showAlert(error.message, 'danger');
        }
    }
}

// Initialize post app when DOM is ready
const postApp = new PostApp();
document.addEventListener('DOMContentLoaded', () => {
    postApp.init();
});

export default postApp;

