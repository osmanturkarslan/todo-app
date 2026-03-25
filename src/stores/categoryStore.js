// Import Pinia helper to define a store
import { defineStore } from 'pinia'

// Import task store to check tasks before deleting categories
import { useTaskStore } from './taskStore'

// Create Category Store
export const useCategoryStore = defineStore('categoryStore', {

  // ===== STATE =====
  state: () => ({
    // Load categories from localStorage, otherwise use defaults
    categories: JSON.parse(localStorage.getItem('categories')) || [
      { id: 1, name: 'Privat' },
      { id: 2, name: 'Schule' },
      { id: 3, name: 'Arbeit' }
    ],

    // Currently selected category (for filtering tasks)
    selectedCategoryId: null
  }),

  // ===== ACTIONS =====
  actions: {

    // Save categories to localStorage
    save() {
      localStorage.setItem('categories', JSON.stringify(this.categories))
    },

    // Add a new category
    addCategory(name) {
      // Remove whitespace
      name = name?.trim()

      // Prevent empty category name
      if (!name) {
        alert('Kategorie darf nicht leer sein')
        return
      }

      // Prevent duplicate category names (case-insensitive)
      const exists = this.categories.some(
        c => c.name.toLowerCase() === name.toLowerCase()
      )

      if (exists) {
        alert('Kategorie existiert bereits')
        return
      }

      // Add category with unique timestamp ID
      this.categories.push({
        id: Date.now(),
        name
      })

      // Persist changes
      this.save()
    },

    // Delete a category
    deleteCategory(id) {
      const taskStore = useTaskStore()

      // Prevent deletion if tasks still use this category
      const inUse = taskStore.tasks.some(t => t.categoryId === id)

      if (inUse) {
        alert('Kategorie enthält Aufgaben und kann nicht gelöscht werden')
        return
      }

      // Remove category
      this.categories = this.categories.filter(c => c.id !== id)

      // Persist changes
      this.save()
    },

    // Update category name
updateCategory(id, newName) {
  const name = newName?.trim()

  // Prevent empty name
  if (!name) return

  // Prevent duplicates
  const exists = this.categories.some(
    c => c.id !== id && c.name.toLowerCase() === name.toLowerCase()
  )

  if (exists) {
    alert('Kategorie existiert bereits')
    return
  }

  // Find category
  const cat = this.categories.find(c => c.id === id)

  if (cat) cat.name = name

  // Persist changes
  this.save()
},

    // Select / Unselect category for filtering
    selectCategory(id) {
      // If same category clicked again → remove filter
      this.selectedCategoryId =
        this.selectedCategoryId === id ? null : id
    }
  }
})
