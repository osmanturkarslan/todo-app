// Import Pinia helper
import { defineStore } from 'pinia'

// Create Task Store
export const useTaskStore = defineStore('taskStore', {

  // ===== STATE =====
  state: () => ({
    // Load saved tasks from localStorage
    tasks: JSON.parse(localStorage.getItem('tasks') || '[]')
  }),

  // ===== ACTIONS =====
  actions: {

    // Save tasks to localStorage
    save() {
      localStorage.setItem('tasks', JSON.stringify(this.tasks))
    },

    // Add a new task
    addTask(task) {

      // Validate task text
      if (!task.text || task.text.length > 120) {
        alert('Ungültiger Aufgabentext')
        return
      }

      // If task is protected, password is required
      if (task.protected && !task.password) {
        alert('Passwort erforderlich')
        return
      }

      // Add task to list
      this.tasks.push({
        id: Date.now(),          // Unique ID
        text: task.text,         // Task description
        completed: false,        // Default status
        categoryId: task.categoryId,
        priority: task.priority,
        protected: task.protected,
        password: task.password,
        unlocked: false          // Locked by default if protected
      })

      // Persist changes
      this.save()
    },

    // Delete task by ID
    deleteTask(id) {
      this.tasks = this.tasks.filter(t => t.id !== id)
      this.save()
    },

    // Toggle completed / open status
    toggleTaskStatus(id) {
      const task = this.tasks.find(t => t.id === id)
      if (task) task.completed = !task.completed
      this.save()
    },

    // Update task text
    updateTask(id, newText) {
      if (!newText || newText.length > 120) return

      const task = this.tasks.find(t => t.id === id)
      if (task) task.text = newText

      this.save()
    },

    // Change task category
    updateTaskCategory(id, categoryId) {
      const task = this.tasks.find(t => t.id === id)
      if (task) task.categoryId = categoryId
      this.save()
    },

    // Change task priority
    updateTaskPriority(id, priority) {
      const task = this.tasks.find(t => t.id === id)
      if (task) task.priority = priority
      this.save()
    }
  }
})
