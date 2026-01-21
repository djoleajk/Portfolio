/**
 * Posts Module
 * Handles blog posts CRUD operations
 */

import db from './db.js';
import auth from './auth.js';
import ui from './ui.js';

class Posts {
    /**
     * Create a new post
     */
    async create(postData) {
        const currentUser = auth.getCurrentUser();
        if (!currentUser) {
            throw new Error('Morate biti prijavljeni');
        }

        // Validate post data
        this.validatePostData(postData);

        // Check if slug already exists
        const existingPosts = await db.getByIndex('posts', 'slug', postData.slug);
        if (existingPosts.length > 0) {
            throw new Error('Slug već postoji');
        }

        const post = {
            title: ui.sanitizeHTML(postData.title),
            slug: postData.slug,
            content: ui.sanitizeHTML(postData.content),
            excerpt: this.generateExcerpt(postData.content),
            authorId: currentUser.id,
            authorName: currentUser.name,
            categories: postData.categories || [],
            tags: postData.tags || [],
            featuredImage: postData.featuredImage || null,
            status: postData.status || 'draft',
            views: 0,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        const postId = await db.add('posts', post);
        post.id = postId;

        return post;
    }

    /**
     * Get post by ID
     */
    async getById(id) {
        return await db.get('posts', id);
    }

    /**
     * Get post by slug
     */
    async getBySlug(slug) {
        const posts = await db.getByIndex('posts', 'slug', slug);
        return posts[0] || null;
    }

    /**
     * Get all posts
     */
    async getAll(options = {}) {
        let posts = await db.getAll('posts');

        // Filter by status
        if (options.status) {
            posts = posts.filter(post => post.status === options.status);
        }

        // Filter by author
        if (options.authorId) {
            posts = posts.filter(post => post.authorId === options.authorId);
        }

        // Filter by category
        if (options.category) {
            posts = posts.filter(post => 
                post.categories && post.categories.includes(options.category)
            );
        }

        // Search
        if (options.search) {
            const searchLower = options.search.toLowerCase();
            posts = posts.filter(post =>
                post.title.toLowerCase().includes(searchLower) ||
                post.content.toLowerCase().includes(searchLower) ||
                (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchLower)))
            );
        }

        // Sort
        const sortBy = options.sortBy || 'newest';
        if (sortBy === 'newest') {
            posts.sort((a, b) => b.createdAt - a.createdAt);
        } else if (sortBy === 'oldest') {
            posts.sort((a, b) => a.createdAt - b.createdAt);
        } else if (sortBy === 'popular') {
            posts.sort((a, b) => b.views - a.views);
        }

        return posts;
    }

    /**
     * Get published posts (for public view)
     */
    async getPublished(options = {}) {
        return await this.getAll({ ...options, status: 'published' });
    }

    /**
     * Get paginated posts
     */
    async getPaginated(page = 1, perPage = 9, options = {}) {
        const allPosts = await this.getAll(options);
        const totalPosts = allPosts.length;
        const totalPages = Math.ceil(totalPosts / perPage);
        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
        const posts = allPosts.slice(startIndex, endIndex);

        return {
            posts,
            pagination: {
                currentPage: page,
                totalPages,
                totalPosts,
                perPage,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        };
    }

    /**
     * Update post
     */
    async update(postId, updates) {
        const post = await this.getById(postId);
        if (!post) {
            throw new Error('Post ne postoji');
        }

        // Check permissions
        if (!auth.canEditPost(post)) {
            throw new Error('Nemate dozvolu za izmenu ovog posta');
        }

        // Validate updates
        if (updates.title) {
            this.validateTitle(updates.title);
            updates.title = ui.sanitizeHTML(updates.title);
        }

        if (updates.content) {
            this.validateContent(updates.content);
            updates.content = ui.sanitizeHTML(updates.content);
            updates.excerpt = this.generateExcerpt(updates.content);
        }

        if (updates.slug && updates.slug !== post.slug) {
            const existingPosts = await db.getByIndex('posts', 'slug', updates.slug);
            if (existingPosts.length > 0) {
                throw new Error('Slug već postoji');
            }
        }

        const updatedPost = {
            ...post,
            ...updates,
            updatedAt: Date.now()
        };

        await db.update('posts', updatedPost);
        return updatedPost;
    }

    /**
     * Delete post
     */
    async delete(postId) {
        const post = await this.getById(postId);
        if (!post) {
            throw new Error('Post ne postoji');
        }

        // Check permissions
        if (!auth.canDeletePost(post)) {
            throw new Error('Nemate dozvolu za brisanje ovog posta');
        }

        // Delete associated comments
        const comments = await db.getByIndex('comments', 'postId', postId);
        for (const comment of comments) {
            await db.delete('comments', comment.id);
        }

        await db.delete('posts', postId);
    }

    /**
     * Increment post views
     */
    async incrementViews(postId) {
        const post = await this.getById(postId);
        if (post) {
            post.views = (post.views || 0) + 1;
            await db.update('posts', post);
        }
    }

    /**
     * Get all categories
     */
    async getAllCategories() {
        const posts = await this.getAll();
        const categoriesSet = new Set();

        posts.forEach(post => {
            if (post.categories && Array.isArray(post.categories)) {
                post.categories.forEach(cat => categoriesSet.add(cat));
            }
        });

        return Array.from(categoriesSet).sort();
    }

    /**
     * Get related posts
     */
    async getRelated(postId, limit = 3) {
        const post = await this.getById(postId);
        if (!post) return [];

        const allPosts = await this.getPublished();
        
        // Score posts by relevance
        const scoredPosts = allPosts
            .filter(p => p.id !== postId)
            .map(p => {
                let score = 0;
                
                // Same categories
                if (post.categories && p.categories) {
                    const commonCategories = post.categories.filter(cat => 
                        p.categories.includes(cat)
                    );
                    score += commonCategories.length * 3;
                }
                
                // Same tags
                if (post.tags && p.tags) {
                    const commonTags = post.tags.filter(tag => 
                        p.tags.includes(tag)
                    );
                    score += commonTags.length * 2;
                }
                
                // Same author
                if (post.authorId === p.authorId) {
                    score += 1;
                }
                
                return { post: p, score };
            })
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(item => item.post);

        return scoredPosts;
    }

    /**
     * Validate post data
     */
    validatePostData(postData) {
        this.validateTitle(postData.title);
        this.validateContent(postData.content);

        if (!postData.slug) {
            throw new Error('Slug je obavezan');
        }

        const slugRegex = /^[a-z0-9-]+$/;
        if (!slugRegex.test(postData.slug)) {
            throw new Error('Slug može sadržati samo mala slova, brojeve i crtice');
        }
    }

    /**
     * Validate title
     */
    validateTitle(title) {
        if (!title || title.trim().length < 5) {
            throw new Error('Naslov mora imati najmanje 5 karaktera');
        }

        if (title.length > 200) {
            throw new Error('Naslov može imati maksimalno 200 karaktera');
        }
    }

    /**
     * Validate content
     */
    validateContent(content) {
        if (!content || content.trim().length < 50) {
            throw new Error('Sadržaj mora imati najmanje 50 karaktera');
        }
    }

    /**
     * Generate excerpt from content
     */
    generateExcerpt(content, maxLength = 150) {
        const plainText = content.replace(/<[^>]*>/g, '').replace(/\n/g, ' ');
        return ui.truncate(plainText, maxLength);
    }

    /**
     * Auto-save draft
     */
    async autoSaveDraft(postData) {
        const draftKey = `draft_${postData.slug || Date.now()}`;
        localStorage.setItem(draftKey, JSON.stringify({
            ...postData,
            savedAt: Date.now()
        }));
    }

    /**
     * Get saved draft
     */
    getSavedDraft(slug) {
        const draftKey = `draft_${slug}`;
        const draft = localStorage.getItem(draftKey);
        return draft ? JSON.parse(draft) : null;
    }

    /**
     * Clear saved draft
     */
    clearSavedDraft(slug) {
        const draftKey = `draft_${slug}`;
        localStorage.removeItem(draftKey);
    }

    /**
     * Get post statistics
     */
    async getStats() {
        const allPosts = await this.getAll();
        const publishedPosts = allPosts.filter(p => p.status === 'published');
        const draftPosts = allPosts.filter(p => p.status === 'draft');
        const totalViews = allPosts.reduce((sum, post) => sum + (post.views || 0), 0);

        return {
            total: allPosts.length,
            published: publishedPosts.length,
            draft: draftPosts.length,
            totalViews
        };
    }
}

// Create singleton instance
const posts = new Posts();

export default posts;

