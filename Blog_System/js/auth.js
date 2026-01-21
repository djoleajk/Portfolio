/**
 * Authentication Module
 * Handles user registration, login, logout, and session management
 */

import db from './db.js';

class Auth {
    constructor() {
        this.currentUser = null;
        this.sessionToken = null;
    }

    /**
     * Initialize auth - check for existing session
     */
    async init() {
        const token = localStorage.getItem('sessionToken');
        if (token) {
            try {
                const session = await db.get('sessions', token);
                if (session && session.expiresAt > Date.now()) {
                    this.sessionToken = token;
                    this.currentUser = await db.get('users', session.userId);
                    return true;
                } else {
                    // Session expired
                    localStorage.removeItem('sessionToken');
                }
            } catch (error) {
                console.error('Session validation failed:', error);
            }
        }
        return false;
    }

    /**
     * Register a new user
     */
    async register(name, email, password) {
        // Validate input
        if (!name || name.length < 3) {
            throw new Error('Ime mora imati najmanje 3 karaktera');
        }

        if (!this.validateEmail(email)) {
            throw new Error('Nevažeća email adresa');
        }

        if (!password || password.length < 6) {
            throw new Error('Lozinka mora imati najmanje 6 karaktera');
        }

        // Check if email already exists
        const existingUsers = await db.getByIndex('users', 'email', email);
        if (existingUsers.length > 0) {
            throw new Error('Email već postoji');
        }

        // Create user
        const user = {
            name: this.sanitize(name),
            email: email.toLowerCase().trim(),
            password: await this.hashPassword(password),
            role: 'subscriber', // Default role
            status: 'active',
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        const userId = await db.add('users', user);
        user.id = userId;

        // Create session
        await this.createSession(userId);

        // Set current user
        this.currentUser = user;

        return user;
    }

    /**
     * Login user
     */
    async login(email, password) {
        // Validate input
        if (!email || !password) {
            throw new Error('Email i lozinka su obavezni');
        }

        // Find user by email
        const users = await db.getByIndex('users', 'email', email.toLowerCase().trim());
        if (users.length === 0) {
            throw new Error('Nevažeći kredencijali');
        }

        const user = users[0];

        // Check if user is active
        if (user.status !== 'active') {
            throw new Error('Nalog je deaktiviran');
        }

        // Verify password
        const isValid = await this.verifyPassword(password, user.password);
        if (!isValid) {
            throw new Error('Nevažeći kredencijali');
        }

        // Create session
        await this.createSession(user.id);

        // Set current user (without password)
        const { password: _, ...userWithoutPassword } = user;
        this.currentUser = userWithoutPassword;

        return this.currentUser;
    }

    /**
     * Logout user
     */
    async logout() {
        if (this.sessionToken) {
            try {
                await db.delete('sessions', this.sessionToken);
            } catch (error) {
                console.error('Failed to delete session:', error);
            }
            localStorage.removeItem('sessionToken');
        }
        this.currentUser = null;
        this.sessionToken = null;
    }

    /**
     * Create a session for user
     */
    async createSession(userId) {
        const token = this.generateToken();
        const session = {
            token,
            userId,
            createdAt: Date.now(),
            expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
        };

        await db.add('sessions', session);
        this.sessionToken = token;
        localStorage.setItem('sessionToken', token);
    }

    /**
     * Check if user has permission
     */
    hasPermission(permission) {
        if (!this.currentUser) return false;

        const role = this.currentUser.role;
        const permissions = {
            admin: ['manage_users', 'manage_all_posts', 'manage_comments', 'view_admin'],
            editor: ['manage_all_posts', 'manage_comments', 'create_post', 'edit_post', 'delete_post'],
            author: ['create_post', 'edit_own_post', 'delete_own_post'],
            subscriber: ['comment', 'like']
        };

        return permissions[role]?.includes(permission) || false;
    }

    /**
     * Check if user can edit post
     */
    canEditPost(post) {
        if (!this.currentUser) return false;
        
        const role = this.currentUser.role;
        if (role === 'admin' || role === 'editor') return true;
        if (role === 'author' && post.authorId === this.currentUser.id) return true;
        
        return false;
    }

    /**
     * Check if user can delete post
     */
    canDeletePost(post) {
        return this.canEditPost(post);
    }

    /**
     * Check if user can moderate comments
     */
    canModerateComments() {
        if (!this.currentUser) return false;
        const role = this.currentUser.role;
        return role === 'admin' || role === 'editor';
    }

    /**
     * Simple password hashing (in production, use proper hashing like bcrypt)
     */
    async hashPassword(password) {
        // Simple hash for demo purposes
        // In production, use a proper library
        const encoder = new TextEncoder();
        const data = encoder.encode(password + 'SALT_KEY');
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    /**
     * Verify password
     */
    async verifyPassword(password, hash) {
        const passwordHash = await this.hashPassword(password);
        return passwordHash === hash;
    }

    /**
     * Generate session token
     */
    generateToken() {
        return Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    /**
     * Validate email format
     */
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    /**
     * Sanitize user input
     */
    sanitize(input) {
        if (typeof input !== 'string') return input;
        return input.trim();
    }

    /**
     * Get current user
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Check if user is logged in
     */
    isLoggedIn() {
        return this.currentUser !== null;
    }

    /**
     * Check if user is admin
     */
    isAdmin() {
        return this.currentUser?.role === 'admin';
    }

    /**
     * Check if user is editor
     */
    isEditor() {
        return this.currentUser?.role === 'editor';
    }

    /**
     * Check if user is author
     */
    isAuthor() {
        return this.currentUser?.role === 'author';
    }

    /**
     * Initialize demo users
     */
    async initDemoUsers() {
        try {
            const existingUsers = await db.getAll('users');
            if (existingUsers.length === 0) {
                // Create demo admin
                await db.add('users', {
                    name: 'Admin',
                    email: 'admin@example.com',
                    password: await this.hashPassword('admin123'),
                    role: 'admin',
                    status: 'active',
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                });

                // Create demo editor
                await db.add('users', {
                    name: 'Editor',
                    email: 'editor@example.com',
                    password: await this.hashPassword('editor123'),
                    role: 'editor',
                    status: 'active',
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                });

                // Create demo author
                await db.add('users', {
                    name: 'Author',
                    email: 'author@example.com',
                    password: await this.hashPassword('author123'),
                    role: 'author',
                    status: 'active',
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                });

                console.log('Demo users created');
            }
        } catch (error) {
            console.error('Failed to create demo users:', error);
        }
    }
}

// Create singleton instance
const auth = new Auth();

export default auth;

