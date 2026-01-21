/**
 * Database Module - IndexedDB wrapper for data persistence
 * Manages all database operations for the blog system
 */

const DB_NAME = 'BlogSystemDB';
const DB_VERSION = 1;

class Database {
    constructor() {
        this.db = null;
    }

    /**
     * Initialize the database
     */
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => {
                reject(new Error('Database failed to open'));
            };

            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Users store
                if (!db.objectStoreNames.contains('users')) {
                    const userStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
                    userStore.createIndex('email', 'email', { unique: true });
                    userStore.createIndex('role', 'role', { unique: false });
                    userStore.createIndex('status', 'status', { unique: false });
                }

                // Posts store
                if (!db.objectStoreNames.contains('posts')) {
                    const postStore = db.createObjectStore('posts', { keyPath: 'id', autoIncrement: true });
                    postStore.createIndex('slug', 'slug', { unique: true });
                    postStore.createIndex('authorId', 'authorId', { unique: false });
                    postStore.createIndex('status', 'status', { unique: false });
                    postStore.createIndex('createdAt', 'createdAt', { unique: false });
                }

                // Comments store
                if (!db.objectStoreNames.contains('comments')) {
                    const commentStore = db.createObjectStore('comments', { keyPath: 'id', autoIncrement: true });
                    commentStore.createIndex('postId', 'postId', { unique: false });
                    commentStore.createIndex('userId', 'userId', { unique: false });
                    commentStore.createIndex('parentId', 'parentId', { unique: false });
                    commentStore.createIndex('status', 'status', { unique: false });
                }

                // Sessions store
                if (!db.objectStoreNames.contains('sessions')) {
                    db.createObjectStore('sessions', { keyPath: 'token' });
                }
            };
        });
    }

    /**
     * Add a record to a store
     */
    async add(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.add(data);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(new Error(`Failed to add to ${storeName}`));
            };
        });
    }

    /**
     * Get a record by key
     */
    async get(storeName, key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(key);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(new Error(`Failed to get from ${storeName}`));
            };
        });
    }

    /**
     * Get all records from a store
     */
    async getAll(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(new Error(`Failed to get all from ${storeName}`));
            };
        });
    }

    /**
     * Get records by index
     */
    async getByIndex(storeName, indexName, value) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const index = store.index(indexName);
            const request = index.getAll(value);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(new Error(`Failed to get by index from ${storeName}`));
            };
        });
    }

    /**
     * Update a record
     */
    async update(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(new Error(`Failed to update ${storeName}`));
            };
        });
    }

    /**
     * Delete a record
     */
    async delete(storeName, key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(key);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                reject(new Error(`Failed to delete from ${storeName}`));
            };
        });
    }

    /**
     * Clear all records from a store
     */
    async clear(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.clear();

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                reject(new Error(`Failed to clear ${storeName}`));
            };
        });
    }

    /**
     * Query records with custom filter
     */
    async query(storeName, filterFn) {
        const allRecords = await this.getAll(storeName);
        return allRecords.filter(filterFn);
    }

    /**
     * Count records in a store
     */
    async count(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.count();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(new Error(`Failed to count ${storeName}`));
            };
        });
    }
}

// Create singleton instance
const db = new Database();

export default db;

