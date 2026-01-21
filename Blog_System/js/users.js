/**
 * Users Module
 * Handles user management operations
 */

import db from './db.js';
import auth from './auth.js';

class Users {
    /**
     * Get all users
     */
    async getAll() {
        return await db.getAll('users');
    }

    /**
     * Get user by ID
     */
    async getById(id) {
        return await db.get('users', id);
    }

    /**
     * Get users by role
     */
    async getByRole(role) {
        return await db.getByIndex('users', 'role', role);
    }

    /**
     * Update user
     */
    async update(userId, updates) {
        const user = await db.get('users', userId);
        if (!user) {
            throw new Error('Korisnik ne postoji');
        }

        // Check permissions
        const currentUser = auth.getCurrentUser();
        if (!currentUser || !auth.isAdmin()) {
            throw new Error('Nemate dozvolu za ovu akciju');
        }

        const updatedUser = {
            ...user,
            ...updates,
            updatedAt: Date.now()
        };

        await db.update('users', updatedUser);
        return updatedUser;
    }

    /**
     * Change user role
     */
    async changeRole(userId, newRole) {
        const validRoles = ['admin', 'editor', 'author', 'subscriber'];
        if (!validRoles.includes(newRole)) {
            throw new Error('Nevažeća uloga');
        }

        return await this.update(userId, { role: newRole });
    }

    /**
     * Change user status
     */
    async changeStatus(userId, status) {
        const validStatuses = ['active', 'inactive'];
        if (!validStatuses.includes(status)) {
            throw new Error('Nevažeći status');
        }

        return await this.update(userId, { status });
    }

    /**
     * Delete user
     */
    async delete(userId) {
        // Check permissions
        const currentUser = auth.getCurrentUser();
        if (!currentUser || !auth.isAdmin()) {
            throw new Error('Nemate dozvolu za ovu akciju');
        }

        // Don't allow deleting yourself
        if (currentUser.id === userId) {
            throw new Error('Ne možete obrisati svoj nalog');
        }

        await db.delete('users', userId);
    }

    /**
     * Reset user password
     */
    async resetPassword(userId, newPassword) {
        // Check permissions
        const currentUser = auth.getCurrentUser();
        if (!currentUser || !auth.isAdmin()) {
            throw new Error('Nemate dozvolu za ovu akciju');
        }

        if (!newPassword || newPassword.length < 6) {
            throw new Error('Lozinka mora imati najmanje 6 karaktera');
        }

        const hashedPassword = await auth.hashPassword(newPassword);
        return await this.update(userId, { password: hashedPassword });
    }

    /**
     * Search users
     */
    async search(query) {
        const allUsers = await this.getAll();
        const lowerQuery = query.toLowerCase();

        return allUsers.filter(user => 
            user.name.toLowerCase().includes(lowerQuery) ||
            user.email.toLowerCase().includes(lowerQuery)
        );
    }

    /**
     * Get user statistics
     */
    async getStats(userId) {
        const posts = await db.getByIndex('posts', 'authorId', userId);
        const comments = await db.getByIndex('comments', 'userId', userId);

        return {
            postsCount: posts.length,
            commentsCount: comments.length,
            publishedPosts: posts.filter(p => p.status === 'published').length,
            draftPosts: posts.filter(p => p.status === 'draft').length
        };
    }

    /**
     * Get users with stats
     */
    async getAllWithStats() {
        const users = await this.getAll();
        const usersWithStats = await Promise.all(
            users.map(async user => {
                const stats = await this.getStats(user.id);
                return {
                    ...user,
                    stats
                };
            })
        );
        return usersWithStats;
    }
}

// Create singleton instance
const users = new Users();

export default users;

