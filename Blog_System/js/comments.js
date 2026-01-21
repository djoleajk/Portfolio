/**
 * Comments Module
 * Handles comment operations and moderation
 */

import db from './db.js';
import auth from './auth.js';
import ui from './ui.js';

class Comments {
    /**
     * Create a new comment
     */
    async create(postId, content, parentId = null) {
        const currentUser = auth.getCurrentUser();
        if (!currentUser) {
            throw new Error('Morate biti prijavljeni da biste komentarisali');
        }

        // Validate content
        this.validateContent(content);

        const comment = {
            postId,
            userId: currentUser.id,
            userName: currentUser.name,
            content: ui.sanitizeHTML(content),
            parentId,
            status: 'approved', // Auto-approve for now (can be changed to 'pending')
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        const commentId = await db.add('comments', comment);
        comment.id = commentId;

        return comment;
    }

    /**
     * Get comment by ID
     */
    async getById(id) {
        return await db.get('comments', id);
    }

    /**
     * Get all comments for a post
     */
    async getByPostId(postId) {
        return await db.getByIndex('comments', 'postId', postId);
    }

    /**
     * Get approved comments for a post
     */
    async getApprovedByPostId(postId) {
        const comments = await this.getByPostId(postId);
        return comments.filter(comment => comment.status === 'approved');
    }

    /**
     * Get comments with replies (threaded structure)
     */
    async getThreaded(postId) {
        const allComments = await this.getApprovedByPostId(postId);
        
        // Separate parent comments and replies
        const parentComments = allComments.filter(c => !c.parentId);
        const replies = allComments.filter(c => c.parentId);

        // Attach replies to parent comments
        const threaded = parentComments.map(parent => ({
            ...parent,
            replies: replies.filter(r => r.parentId === parent.id)
        }));

        // Sort by date (newest first)
        threaded.sort((a, b) => b.createdAt - a.createdAt);

        return threaded;
    }

    /**
     * Get all comments (for admin)
     */
    async getAll(options = {}) {
        let comments = await db.getAll('comments');

        // Filter by status
        if (options.status) {
            comments = comments.filter(c => c.status === options.status);
        }

        // Filter by user
        if (options.userId) {
            comments = comments.filter(c => c.userId === options.userId);
        }

        // Sort by date (newest first)
        comments.sort((a, b) => b.createdAt - a.createdAt);

        return comments;
    }

    /**
     * Update comment
     */
    async update(commentId, updates) {
        const comment = await this.getById(commentId);
        if (!comment) {
            throw new Error('Komentar ne postoji');
        }

        // Check permissions
        const currentUser = auth.getCurrentUser();
        if (!currentUser) {
            throw new Error('Morate biti prijavljeni');
        }

        // Only comment author can edit
        if (comment.userId !== currentUser.id && !auth.canModerateComments()) {
            throw new Error('Nemate dozvolu za izmenu ovog komentara');
        }

        // Validate content if updating
        if (updates.content) {
            this.validateContent(updates.content);
            updates.content = ui.sanitizeHTML(updates.content);
        }

        const updatedComment = {
            ...comment,
            ...updates,
            updatedAt: Date.now()
        };

        await db.update('comments', updatedComment);
        return updatedComment;
    }

    /**
     * Delete comment
     */
    async delete(commentId) {
        const comment = await this.getById(commentId);
        if (!comment) {
            throw new Error('Komentar ne postoji');
        }

        // Check permissions
        const currentUser = auth.getCurrentUser();
        if (!currentUser) {
            throw new Error('Morate biti prijavljeni');
        }

        // Only comment author or moderators can delete
        if (comment.userId !== currentUser.id && !auth.canModerateComments()) {
            throw new Error('Nemate dozvolu za brisanje ovog komentara');
        }

        // Delete replies too
        const replies = await db.getByIndex('comments', 'parentId', commentId);
        for (const reply of replies) {
            await db.delete('comments', reply.id);
        }

        await db.delete('comments', commentId);
    }

    /**
     * Moderate comment (approve/reject)
     */
    async moderate(commentId, status) {
        // Check permissions
        if (!auth.canModerateComments()) {
            throw new Error('Nemate dozvolu za moderaciju komentara');
        }

        const validStatuses = ['approved', 'rejected', 'pending'];
        if (!validStatuses.includes(status)) {
            throw new Error('Nevažeći status');
        }

        return await this.update(commentId, { status });
    }

    /**
     * Approve comment
     */
    async approve(commentId) {
        return await this.moderate(commentId, 'approved');
    }

    /**
     * Reject comment
     */
    async reject(commentId) {
        return await this.moderate(commentId, 'rejected');
    }

    /**
     * Count comments for a post
     */
    async countByPostId(postId) {
        const comments = await this.getApprovedByPostId(postId);
        return comments.length;
    }

    /**
     * Get comment statistics
     */
    async getStats() {
        const allComments = await db.getAll('comments');
        
        return {
            total: allComments.length,
            approved: allComments.filter(c => c.status === 'approved').length,
            pending: allComments.filter(c => c.status === 'pending').length,
            rejected: allComments.filter(c => c.status === 'rejected').length
        };
    }

    /**
     * Get comments with post info (for admin)
     */
    async getAllWithPostInfo() {
        const comments = await this.getAll();
        const postsCache = {};

        const commentsWithInfo = await Promise.all(
            comments.map(async comment => {
                // Get post info if not cached
                if (!postsCache[comment.postId]) {
                    postsCache[comment.postId] = await db.get('posts', comment.postId);
                }

                return {
                    ...comment,
                    postTitle: postsCache[comment.postId]?.title || 'Unknown Post'
                };
            })
        );

        return commentsWithInfo;
    }

    /**
     * Validate comment content
     */
    validateContent(content) {
        if (!content || content.trim().length < 3) {
            throw new Error('Komentar mora imati najmanje 3 karaktera');
        }

        if (content.length > 1000) {
            throw new Error('Komentar može imati maksimalno 1000 karaktera');
        }
    }

    /**
     * Check if user can comment on post
     */
    canComment(postId) {
        const currentUser = auth.getCurrentUser();
        return currentUser !== null;
    }

    /**
     * Check if user can edit comment
     */
    canEdit(comment) {
        const currentUser = auth.getCurrentUser();
        if (!currentUser) return false;

        return comment.userId === currentUser.id || auth.canModerateComments();
    }

    /**
     * Check if user can delete comment
     */
    canDelete(comment) {
        return this.canEdit(comment);
    }
}

// Create singleton instance
const comments = new Comments();

export default comments;

