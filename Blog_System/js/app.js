/**
 * Main Application File
 * Handles the main blog page functionality
 */

import db from './db.js';
import auth from './auth.js';
import posts from './posts.js';
import ui from './ui.js';
import demoData from './demo-data.js';

class App {
    constructor() {
        this.currentPage = 1;
        this.perPage = 9;
        this.filters = {
            search: '',
            category: '',
            sortBy: 'newest'
        };
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            // Initialize database
            await db.init();
            
            // Initialize auth and check session
            await auth.init();
            await auth.initDemoUsers();

            // Optionally load demo data (only on first run)
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('demo') === 'init') {
                await demoData.init();
                window.history.replaceState({}, '', 'index.html');
            }

            // Setup UI handlers
            this.setupUI();
            this.updateAuthUI();

            // Load posts
            await this.loadPosts();

            // Load categories for filter
            await this.loadCategories();

        } catch (error) {
            console.error('Failed to initialize app:', error);
            ui.showAlert('Greška pri inicijalizaciji aplikacije', 'danger');
        }
    }

    /**
     * Setup UI event handlers
     */
    setupUI() {
        // Setup modal handlers
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
            await this.handleLogout();
        });

        document.getElementById('newPostBtn')?.addEventListener('click', () => {
            this.openPostModal();
        });

        // Login form
        document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin(e.target);
        });

        // Register form
        document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleRegister(e.target);
        });

        // Post form
        document.getElementById('postForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handlePostSubmit(e.target);
        });

        // Save draft button
        document.getElementById('saveDraftBtn')?.addEventListener('click', async () => {
            await this.handleSaveDraft();
        });

        // Search and filters
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', ui.debounce(() => {
                this.filters.search = searchInput.value;
                this.currentPage = 1;
                this.loadPosts();
            }, 500));
        }

        document.getElementById('categoryFilter')?.addEventListener('change', (e) => {
            this.filters.category = e.target.value;
            this.currentPage = 1;
            this.loadPosts();
        });

        document.getElementById('sortFilter')?.addEventListener('change', (e) => {
            this.filters.sortBy = e.target.value;
            this.currentPage = 1;
            this.loadPosts();
        });

        // Post title to slug
        const postTitle = document.getElementById('postTitle');
        const postSlug = document.getElementById('postSlug');
        if (postTitle && postSlug) {
            postTitle.addEventListener('input', () => {
                if (!postSlug.dataset.manuallyEdited) {
                    postSlug.value = ui.generateSlug(postTitle.value);
                }
            });
            postSlug.addEventListener('input', () => {
                postSlug.dataset.manuallyEdited = 'true';
            });
        }

        // Setup form validation
        const forms = document.querySelectorAll('form');
        forms.forEach(form => ui.setupFormValidation(form));
    }

    /**
     * Update authentication UI
     */
    updateAuthUI() {
        const user = auth.getCurrentUser();
        
        if (user) {
            // Show user menu, hide auth buttons
            ui.hide('#authButtons');
            ui.show('#userMenu');
            
            const greeting = document.getElementById('userGreeting');
            if (greeting) {
                greeting.textContent = `Zdravo, ${user.name}`;
            }

            // Show admin link if admin or editor
            if (user.role === 'admin' || user.role === 'editor') {
                ui.show('#adminLink');
            }

            // Show new post button if can create posts
            if (user.role === 'admin' || user.role === 'editor' || user.role === 'author') {
                ui.show('#newPostBtn');
            }
        } else {
            // Show auth buttons, hide user menu
            ui.show('#authButtons');
            ui.hide('#userMenu');
            ui.hide('#adminLink');
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
            await this.loadPosts();
        } catch (error) {
            ui.showAlert(error.message, 'danger');
        }
    }

    /**
     * Handle registration
     */
    async handleRegister(form) {
        if (!ui.validateForm(form)) return;

        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const passwordConfirm = document.getElementById('registerPasswordConfirm').value;

        if (password !== passwordConfirm) {
            ui.showAlert('Lozinke se ne poklapaju', 'danger');
            return;
        }

        try {
            await auth.register(name, email, password);
            ui.hideModal('registerModal');
            ui.showAlert('Uspešno ste se registrovali!', 'success');
            this.updateAuthUI();
        } catch (error) {
            ui.showAlert(error.message, 'danger');
        }
    }

    /**
     * Handle logout
     */
    async handleLogout() {
        await auth.logout();
        ui.showAlert('Uspešno ste se odjavili', 'success');
        this.updateAuthUI();
        await this.loadPosts();
    }

    /**
     * Load posts
     */
    async loadPosts() {
        const grid = document.getElementById('postsGrid');
        if (!grid) return;

        ui.showSpinner('loadingSpinner');
        grid.innerHTML = '';

        try {
            const user = auth.getCurrentUser();
            let options = { ...this.filters };

            // Non-logged in users see only published posts
            if (!user) {
                options.status = 'published';
            }

            const result = await posts.getPaginated(this.currentPage, this.perPage, options);
            
            if (result.posts.length === 0) {
                ui.hide('#emptyState');
                grid.innerHTML = '<p class="empty-state">Nema postova za prikaz.</p>';
            } else {
                ui.hide('#emptyState');
                result.posts.forEach(post => {
                    grid.appendChild(this.createPostCard(post));
                });
            }

            this.renderPagination(result.pagination);

        } catch (error) {
            console.error('Failed to load posts:', error);
            ui.showAlert('Greška pri učitavanju postova', 'danger');
        } finally {
            ui.hideSpinner('loadingSpinner');
        }
    }

    /**
     * Create post card element
     */
    createPostCard(post) {
        const card = document.createElement('article');
        card.className = 'post-card';

        // Featured image
        if (post.featuredImage) {
            const img = document.createElement('img');
            img.src = post.featuredImage;
            img.alt = post.title;
            img.className = 'post-card-image';
            card.appendChild(img);
        }

        const content = document.createElement('div');
        content.className = 'post-card-content';

        // Categories
        if (post.categories && post.categories.length > 0) {
            const categoriesDiv = document.createElement('div');
            categoriesDiv.className = 'post-card-categories';
            post.categories.slice(0, 2).forEach(category => {
                const tag = document.createElement('span');
                tag.className = 'post-category-tag';
                tag.textContent = category;
                categoriesDiv.appendChild(tag);
            });
            content.appendChild(categoriesDiv);
        }

        // Title
        const title = document.createElement('h2');
        title.className = 'post-card-title';
        const titleLink = document.createElement('a');
        titleLink.href = `post.html?slug=${post.slug}`;
        titleLink.textContent = post.title;
        title.appendChild(titleLink);
        content.appendChild(title);

        // Excerpt
        const excerpt = document.createElement('p');
        excerpt.className = 'post-card-excerpt';
        excerpt.textContent = post.excerpt;
        content.appendChild(excerpt);

        // Meta
        const meta = document.createElement('div');
        meta.className = 'post-card-meta';

        const author = document.createElement('span');
        author.className = 'post-author';
        author.textContent = post.authorName;
        meta.appendChild(author);

        const stats = document.createElement('div');
        stats.className = 'post-stats';
        
        const date = document.createElement('span');
        date.textContent = ui.formatDate(post.createdAt);
        stats.appendChild(date);

        const views = document.createElement('span');
        views.textContent = `👁️ ${post.views || 0}`;
        stats.appendChild(views);

        if (post.status === 'draft') {
            const status = document.createElement('span');
            status.className = 'status-badge draft';
            status.textContent = 'Draft';
            stats.appendChild(status);
        }

        meta.appendChild(stats);
        content.appendChild(meta);

        card.appendChild(content);
        return card;
    }

    /**
     * Render pagination
     */
    renderPagination(pagination) {
        const container = document.getElementById('pagination');
        if (!container) return;

        container.innerHTML = '';

        if (pagination.totalPages <= 1) return;

        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'page-btn';
        prevBtn.textContent = '← Prethodna';
        prevBtn.disabled = !pagination.hasPrev;
        prevBtn.addEventListener('click', () => {
            this.currentPage--;
            this.loadPosts();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        container.appendChild(prevBtn);

        // Page numbers
        for (let i = 1; i <= pagination.totalPages; i++) {
            if (
                i === 1 ||
                i === pagination.totalPages ||
                (i >= pagination.currentPage - 1 && i <= pagination.currentPage + 1)
            ) {
                const pageBtn = document.createElement('button');
                pageBtn.className = 'page-btn';
                if (i === pagination.currentPage) {
                    pageBtn.classList.add('active');
                }
                pageBtn.textContent = i;
                pageBtn.addEventListener('click', () => {
                    this.currentPage = i;
                    this.loadPosts();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
                container.appendChild(pageBtn);
            } else if (
                i === pagination.currentPage - 2 ||
                i === pagination.currentPage + 2
            ) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.style.padding = '0 0.5rem';
                container.appendChild(ellipsis);
            }
        }

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'page-btn';
        nextBtn.textContent = 'Sledeća →';
        nextBtn.disabled = !pagination.hasNext;
        nextBtn.addEventListener('click', () => {
            this.currentPage++;
            this.loadPosts();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        container.appendChild(nextBtn);
    }

    /**
     * Load categories for filter
     */
    async loadCategories() {
        const select = document.getElementById('categoryFilter');
        if (!select) return;

        try {
            const categories = await posts.getAllCategories();
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                select.appendChild(option);
            });
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    }

    /**
     * Open post modal
     */
    openPostModal(post = null) {
        const modal = document.getElementById('postModal');
        const form = document.getElementById('postForm');
        const title = document.getElementById('postModalTitle');

        if (post) {
            // Edit mode
            title.textContent = 'Izmeni post';
            form.dataset.postId = post.id;
            document.getElementById('postTitle').value = post.title;
            document.getElementById('postSlug').value = post.slug;
            document.getElementById('postContent').value = post.content;
            document.getElementById('postCategories').value = post.categories?.join(', ') || '';
            document.getElementById('postTags').value = post.tags?.join(', ') || '';
            document.getElementById('postStatus').value = post.status;
        } else {
            // Create mode
            title.textContent = 'Novi post';
            delete form.dataset.postId;
            form.reset();
            document.getElementById('postSlug').dataset.manuallyEdited = '';
        }

        ui.showModal('postModal');
    }

    /**
     * Handle post submit
     */
    async handlePostSubmit(form) {
        if (!ui.validateForm(form)) return;

        const postData = {
            title: document.getElementById('postTitle').value,
            slug: document.getElementById('postSlug').value,
            content: document.getElementById('postContent').value,
            categories: document.getElementById('postCategories').value.split(',').map(c => c.trim()).filter(Boolean),
            tags: document.getElementById('postTags').value.split(',').map(t => t.trim()).filter(Boolean),
            status: document.getElementById('postStatus').value
        };

        // Handle image upload
        const imageInput = document.getElementById('postImage');
        if (imageInput.files.length > 0) {
            try {
                ui.validateFile(imageInput.files[0]);
                postData.featuredImage = await ui.fileToDataURL(imageInput.files[0]);
            } catch (error) {
                ui.showAlert(error.message, 'danger');
                return;
            }
        }

        try {
            const postId = form.dataset.postId;
            if (postId) {
                // Update existing post
                await posts.update(parseInt(postId), postData);
                ui.showAlert('Post je uspešno ažuriran', 'success');
            } else {
                // Create new post
                await posts.create(postData);
                ui.showAlert('Post je uspešno kreiran', 'success');
            }

            ui.hideModal('postModal');
            await this.loadPosts();
        } catch (error) {
            ui.showAlert(error.message, 'danger');
        }
    }

    /**
     * Handle save draft
     */
    async handleSaveDraft() {
        const postData = {
            title: document.getElementById('postTitle').value,
            slug: document.getElementById('postSlug').value,
            content: document.getElementById('postContent').value,
            categories: document.getElementById('postCategories').value.split(',').map(c => c.trim()).filter(Boolean),
            tags: document.getElementById('postTags').value.split(',').map(t => t.trim()).filter(Boolean),
            status: 'draft'
        };

        try {
            const form = document.getElementById('postForm');
            const postId = form.dataset.postId;
            
            if (postId) {
                await posts.update(parseInt(postId), postData);
            } else {
                await posts.create(postData);
            }

            ui.showAlert('Draft je sačuvan', 'success');
            ui.hideModal('postModal');
            await this.loadPosts();
        } catch (error) {
            ui.showAlert(error.message, 'danger');
        }
    }
}

// Initialize app when DOM is ready
const app = new App();
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

export default app;

