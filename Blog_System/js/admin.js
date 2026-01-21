/**
 * Admin Panel Application
 * Handles admin functionality and management
 */

import db from './db.js';
import auth from './auth.js';
import posts from './posts.js';
import users from './users.js';
import comments from './comments.js';
import ui from './ui.js';

class AdminApp {
    constructor() {
        this.currentTab = 'users';
    }

    /**
     * Initialize the admin panel
     */
    async init() {
        try {
            // Initialize database
            await db.init();
            
            // Initialize auth and check session
            const isLoggedIn = await auth.init();
            
            // Check if user has admin access
            if (!isLoggedIn || !this.hasAdminAccess()) {
                ui.showAlert('Nemate pristup admin panelu', 'danger');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
                return;
            }

            // Setup UI
            this.setupUI();
            this.updateAuthUI();

            // Load initial data
            await this.loadStats();
            await this.loadUsers();

        } catch (error) {
            console.error('Failed to initialize admin panel:', error);
            ui.showAlert('Greška pri inicijalizaciji admin panela', 'danger');
        }
    }

    /**
     * Check if user has admin access
     */
    hasAdminAccess() {
        const user = auth.getCurrentUser();
        return user && (user.role === 'admin' || user.role === 'editor');
    }

    /**
     * Setup UI event handlers
     */
    setupUI() {
        ui.setupModalHandlers();
        ui.setupNavigation();

        // Logout
        document.getElementById('logoutBtn')?.addEventListener('click', async () => {
            await auth.logout();
            window.location.href = 'index.html';
        });

        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchTab(btn.getAttribute('aria-controls').replace('Tab', ''));
            });
        });

        // User search
        const userSearch = document.getElementById('userSearch');
        if (userSearch) {
            userSearch.addEventListener('input', ui.debounce(() => {
                this.filterUsers(userSearch.value);
            }, 300));
        }

        // Post filters
        document.getElementById('postAuthorFilter')?.addEventListener('change', () => {
            this.loadPosts();
        });

        document.getElementById('postStatusFilter')?.addEventListener('change', () => {
            this.loadPosts();
        });

        const postSearch = document.getElementById('postSearch');
        if (postSearch) {
            postSearch.addEventListener('input', ui.debounce(() => {
                this.loadPosts();
            }, 300));
        }

        // Comment filter
        document.getElementById('commentStatusFilter')?.addEventListener('change', () => {
            this.loadComments();
        });

        // Edit user form
        document.getElementById('editUserForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleUserUpdate();
        });
    }

    /**
     * Update auth UI
     */
    updateAuthUI() {
        const user = auth.getCurrentUser();
        if (user) {
            const greeting = document.getElementById('userGreeting');
            if (greeting) {
                greeting.textContent = `Zdravo, ${user.name}`;
            }
        }
    }

    /**
     * Switch between tabs
     */
    switchTab(tabName) {
        // Update buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });
        document.getElementById(`${tabName}TabBtn`)?.classList.add('active');
        document.getElementById(`${tabName}TabBtn`)?.setAttribute('aria-selected', 'true');

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}Tab`)?.classList.add('active');

        // Load data for the tab
        this.currentTab = tabName;
        if (tabName === 'users') {
            this.loadUsers();
        } else if (tabName === 'posts') {
            this.loadPosts();
        } else if (tabName === 'comments') {
            this.loadComments();
        }
    }

    /**
     * Load statistics
     */
    async loadStats() {
        try {
            const totalUsers = await db.count('users');
            const totalPosts = await db.count('posts');
            const totalComments = await db.count('comments');
            
            const allPosts = await posts.getAll();
            const totalViews = allPosts.reduce((sum, post) => sum + (post.views || 0), 0);

            document.getElementById('totalUsers').textContent = totalUsers;
            document.getElementById('totalPosts').textContent = totalPosts;
            document.getElementById('totalComments').textContent = totalComments;
            document.getElementById('totalViews').textContent = totalViews;

        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    }

    /**
     * Load users
     */
    async loadUsers() {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;

        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Učitavanje...</td></tr>';

        try {
            const allUsers = await users.getAll();
            tbody.innerHTML = '';

            if (allUsers.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center">Nema korisnika</td></tr>';
                return;
            }

            allUsers.forEach(user => {
                tbody.appendChild(this.createUserRow(user));
            });

            // Populate author filter
            this.populateAuthorFilter(allUsers);

        } catch (error) {
            console.error('Failed to load users:', error);
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">Greška pri učitavanju</td></tr>';
        }
    }

    /**
     * Create user table row
     */
    createUserRow(user) {
        const row = document.createElement('tr');

        // Name
        const nameCell = document.createElement('td');
        nameCell.textContent = user.name;
        row.appendChild(nameCell);

        // Email
        const emailCell = document.createElement('td');
        emailCell.textContent = user.email;
        row.appendChild(emailCell);

        // Role
        const roleCell = document.createElement('td');
        const roleBadge = document.createElement('span');
        roleBadge.className = 'status-badge';
        roleBadge.textContent = user.role;
        roleCell.appendChild(roleBadge);
        row.appendChild(roleCell);

        // Status
        const statusCell = document.createElement('td');
        const statusBadge = document.createElement('span');
        statusBadge.className = `status-badge ${user.status}`;
        statusBadge.textContent = user.status === 'active' ? 'Aktivan' : 'Neaktivan';
        statusCell.appendChild(statusBadge);
        row.appendChild(statusCell);

        // Created at
        const dateCell = document.createElement('td');
        dateCell.textContent = ui.formatDate(user.createdAt);
        row.appendChild(dateCell);

        // Actions
        const actionsCell = document.createElement('td');
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'table-actions';

        if (auth.isAdmin()) {
            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-sm btn-outline';
            editBtn.textContent = 'Izmeni';
            editBtn.addEventListener('click', () => this.openEditUserModal(user));
            actionsDiv.appendChild(editBtn);

            if (user.id !== auth.getCurrentUser().id) {
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'btn btn-sm btn-danger';
                deleteBtn.textContent = 'Obriši';
                deleteBtn.addEventListener('click', () => this.handleDeleteUser(user.id));
                actionsDiv.appendChild(deleteBtn);
            }
        }

        actionsCell.appendChild(actionsDiv);
        row.appendChild(actionsCell);

        return row;
    }

    /**
     * Filter users
     */
    async filterUsers(query) {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;

        try {
            const filtered = await users.search(query);
            tbody.innerHTML = '';

            if (filtered.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center">Nema rezultata</td></tr>';
                return;
            }

            filtered.forEach(user => {
                tbody.appendChild(this.createUserRow(user));
            });

        } catch (error) {
            console.error('Failed to filter users:', error);
        }
    }

    /**
     * Open edit user modal
     */
    openEditUserModal(user) {
        document.getElementById('editUserId').value = user.id;
        document.getElementById('editUserName').value = user.name;
        document.getElementById('editUserEmail').value = user.email;
        document.getElementById('editUserRole').value = user.role;
        document.getElementById('editUserStatus').value = user.status;

        ui.showModal('editUserModal');
    }

    /**
     * Handle user update
     */
    async handleUserUpdate() {
        const userId = parseInt(document.getElementById('editUserId').value);
        const updates = {
            name: document.getElementById('editUserName').value,
            email: document.getElementById('editUserEmail').value,
            role: document.getElementById('editUserRole').value,
            status: document.getElementById('editUserStatus').value
        };

        try {
            await users.update(userId, updates);
            ui.hideModal('editUserModal');
            ui.showAlert('Korisnik je uspešno ažuriran', 'success');
            await this.loadUsers();
            await this.loadStats();
        } catch (error) {
            ui.showAlert(error.message, 'danger');
        }
    }

    /**
     * Handle delete user
     */
    async handleDeleteUser(userId) {
        if (!ui.confirm('Da li ste sigurni da želite da obrišete ovog korisnika?')) {
            return;
        }

        try {
            await users.delete(userId);
            ui.showAlert('Korisnik je uspešno obrisan', 'success');
            await this.loadUsers();
            await this.loadStats();
        } catch (error) {
            ui.showAlert(error.message, 'danger');
        }
    }

    /**
     * Load posts
     */
    async loadPosts() {
        const tbody = document.getElementById('postsTableBody');
        if (!tbody) return;

        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Učitavanje...</td></tr>';

        try {
            const authorFilter = document.getElementById('postAuthorFilter')?.value;
            const statusFilter = document.getElementById('postStatusFilter')?.value;
            const searchQuery = document.getElementById('postSearch')?.value;

            let options = {};
            if (authorFilter) options.authorId = parseInt(authorFilter);
            if (statusFilter) options.status = statusFilter;
            if (searchQuery) options.search = searchQuery;

            const allPosts = await posts.getAll(options);
            tbody.innerHTML = '';

            if (allPosts.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" class="text-center">Nema postova</td></tr>';
                return;
            }

            allPosts.forEach(post => {
                tbody.appendChild(this.createPostRow(post));
            });

        } catch (error) {
            console.error('Failed to load posts:', error);
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">Greška pri učitavanju</td></tr>';
        }
    }

    /**
     * Create post table row
     */
    createPostRow(post) {
        const row = document.createElement('tr');

        // Title
        const titleCell = document.createElement('td');
        const titleLink = document.createElement('a');
        titleLink.href = `post.html?slug=${post.slug}`;
        titleLink.textContent = ui.truncate(post.title, 50);
        titleLink.target = '_blank';
        titleCell.appendChild(titleLink);
        row.appendChild(titleCell);

        // Author
        const authorCell = document.createElement('td');
        authorCell.textContent = post.authorName;
        row.appendChild(authorCell);

        // Status
        const statusCell = document.createElement('td');
        const statusBadge = document.createElement('span');
        statusBadge.className = `status-badge ${post.status}`;
        statusBadge.textContent = post.status;
        statusCell.appendChild(statusBadge);
        row.appendChild(statusCell);

        // Categories
        const categoriesCell = document.createElement('td');
        categoriesCell.textContent = post.categories?.slice(0, 2).join(', ') || '-';
        row.appendChild(categoriesCell);

        // Views
        const viewsCell = document.createElement('td');
        viewsCell.textContent = post.views || 0;
        row.appendChild(viewsCell);

        // Date
        const dateCell = document.createElement('td');
        dateCell.textContent = ui.formatDate(post.createdAt);
        row.appendChild(dateCell);

        // Actions
        const actionsCell = document.createElement('td');
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'table-actions';

        const viewBtn = document.createElement('a');
        viewBtn.href = `post.html?slug=${post.slug}`;
        viewBtn.className = 'btn btn-sm btn-outline';
        viewBtn.textContent = 'Pogledaj';
        viewBtn.target = '_blank';
        actionsDiv.appendChild(viewBtn);

        if (auth.canEditPost(post)) {
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-sm btn-danger';
            deleteBtn.textContent = 'Obriši';
            deleteBtn.addEventListener('click', () => this.handleDeletePost(post.id));
            actionsDiv.appendChild(deleteBtn);
        }

        actionsCell.appendChild(actionsDiv);
        row.appendChild(actionsCell);

        return row;
    }

    /**
     * Populate author filter
     */
    async populateAuthorFilter(allUsers) {
        const select = document.getElementById('postAuthorFilter');
        if (!select) return;

        // Clear existing options except first
        while (select.options.length > 1) {
            select.remove(1);
        }

        allUsers.forEach(user => {
            if (user.role === 'admin' || user.role === 'editor' || user.role === 'author') {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = user.name;
                select.appendChild(option);
            }
        });
    }

    /**
     * Handle delete post
     */
    async handleDeletePost(postId) {
        if (!ui.confirm('Da li ste sigurni da želite da obrišete ovaj post?')) {
            return;
        }

        try {
            await posts.delete(postId);
            ui.showAlert('Post je uspešno obrisan', 'success');
            await this.loadPosts();
            await this.loadStats();
        } catch (error) {
            ui.showAlert(error.message, 'danger');
        }
    }

    /**
     * Load comments
     */
    async loadComments() {
        const container = document.getElementById('commentsContainer');
        if (!container) return;

        container.innerHTML = '<p class="text-center">Učitavanje...</p>';

        try {
            const statusFilter = document.getElementById('commentStatusFilter')?.value;
            let options = {};
            if (statusFilter) options.status = statusFilter;

            const allComments = await comments.getAllWithPostInfo();
            container.innerHTML = '';

            if (allComments.length === 0) {
                container.innerHTML = '<p class="text-center">Nema komentara</p>';
                return;
            }

            allComments.forEach(comment => {
                container.appendChild(this.createCommentCard(comment));
            });

        } catch (error) {
            console.error('Failed to load comments:', error);
            container.innerHTML = '<p class="text-center">Greška pri učitavanju</p>';
        }
    }

    /**
     * Create comment card
     */
    createCommentCard(comment) {
        const card = document.createElement('div');
        card.className = `comment ${comment.status}`;

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

        card.appendChild(header);

        const postTitle = document.createElement('p');
        postTitle.style.fontSize = 'var(--font-size-sm)';
        postTitle.style.color = 'var(--text-secondary)';
        postTitle.textContent = `Post: ${comment.postTitle}`;
        card.appendChild(postTitle);

        const content = document.createElement('p');
        content.className = 'comment-content';
        content.textContent = comment.content;
        card.appendChild(content);

        const status = document.createElement('p');
        status.style.fontSize = 'var(--font-size-sm)';
        const statusBadge = document.createElement('span');
        statusBadge.className = `status-badge ${comment.status}`;
        statusBadge.textContent = comment.status;
        status.appendChild(document.createTextNode('Status: '));
        status.appendChild(statusBadge);
        card.appendChild(status);

        if (auth.canModerateComments()) {
            const actions = document.createElement('div');
            actions.className = 'comment-actions';

            if (comment.status !== 'approved') {
                const approveBtn = document.createElement('button');
                approveBtn.className = 'comment-action-btn success';
                approveBtn.textContent = 'Odobri';
                approveBtn.addEventListener('click', () => this.handleApproveComment(comment.id));
                actions.appendChild(approveBtn);
            }

            if (comment.status !== 'rejected') {
                const rejectBtn = document.createElement('button');
                rejectBtn.className = 'comment-action-btn danger';
                rejectBtn.textContent = 'Odbij';
                rejectBtn.addEventListener('click', () => this.handleRejectComment(comment.id));
                actions.appendChild(rejectBtn);
            }

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'comment-action-btn danger';
            deleteBtn.textContent = 'Obriši';
            deleteBtn.addEventListener('click', () => this.handleDeleteComment(comment.id));
            actions.appendChild(deleteBtn);

            card.appendChild(actions);
        }

        return card;
    }

    /**
     * Handle approve comment
     */
    async handleApproveComment(commentId) {
        try {
            await comments.approve(commentId);
            ui.showAlert('Komentar je odobren', 'success');
            await this.loadComments();
            await this.loadStats();
        } catch (error) {
            ui.showAlert(error.message, 'danger');
        }
    }

    /**
     * Handle reject comment
     */
    async handleRejectComment(commentId) {
        try {
            await comments.reject(commentId);
            ui.showAlert('Komentar je odbijen', 'success');
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
            await this.loadStats();
        } catch (error) {
            ui.showAlert(error.message, 'danger');
        }
    }
}

// Initialize admin app when DOM is ready
const adminApp = new AdminApp();
document.addEventListener('DOMContentLoaded', () => {
    adminApp.init();
});

export default adminApp;

