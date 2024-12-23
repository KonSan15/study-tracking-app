// services/db.js
const DB_NAME = 'StudyTrackingDB';
const DB_VERSION = 1;

class DatabaseService {
  constructor() {
    this.db = null;
    this.initDatabase();
  }

  async initDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(request.error);
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create tasks store
        if (!db.objectStoreNames.contains('tasks')) {
          const taskStore = db.createObjectStore('tasks', { keyPath: 'id' });
          taskStore.createIndex('subject', 'subject', { unique: false });
          taskStore.createIndex('completed', 'completed', { unique: false });
        }

        // Create subjects store
        if (!db.objectStoreNames.contains('subjects')) {
          const subjectStore = db.createObjectStore('subjects', { keyPath: 'name' });
          subjectStore.createIndex('experience', 'experience', { unique: false });
        }

        // Create user data store
        if (!db.objectStoreNames.contains('userData')) {
          db.createObjectStore('userData', { keyPath: 'id' });
        }
      };
    });
  }

  async getTasks() {
    await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['tasks'], 'readonly');
      const store = transaction.objectStore('tasks');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async addTask(task) {
    await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['tasks'], 'readwrite');
      const store = transaction.objectStore('tasks');
      const request = store.add(task);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updateTask(task) {
    await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['tasks'], 'readwrite');
      const store = transaction.objectStore('tasks');
      const request = store.put(task);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getSubjects() {
    await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['subjects'], 'readonly');
      const store = transaction.objectStore('subjects');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updateSubject(subject) {
    await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['subjects'], 'readwrite');
      const store = transaction.objectStore('subjects');
      const request = store.put(subject);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getUserData() {
    await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['userData'], 'readonly');
      const store = transaction.objectStore('userData');
      const request = store.get('user');

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updateUserData(data) {
    await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['userData'], 'readwrite');
      const store = transaction.objectStore('userData');
      const request = store.put({ ...data, id: 'user' });

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async ensureDB() {
    if (!this.db) {
      await this.initDatabase();
    }
  }

  // services/db.js - Add this method to the DatabaseService class
  async deleteTask(taskId) {
    await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['tasks'], 'readwrite');
      const store = transaction.objectStore('tasks');
      const request = store.delete(taskId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
  
}



export const db = new DatabaseService();