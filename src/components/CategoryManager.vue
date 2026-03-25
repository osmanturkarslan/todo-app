<script>
// ==========================
// CATEGORY MANAGER COMPONENT
// ==========================

// Pinia store for category management
import { useCategoryStore } from '../stores/categoryStore'

// Icons
import { Pencil, Trash2 } from 'lucide-vue-next'

export default {
  name: 'CategoryManager',

  // Register icon components
  components: {
    Pencil,
    Trash2
  },

  // ==========================
  // LOCAL COMPONENT STATE
  // ==========================
  data() {
    return {
      newCategory: '',     // Text for new category input
      editingId: null,     // ID of category currently being edited
      editingName: '',    // Temporary name while editing
      originalName: ''
    }
  },

  // ==========================
  // ACCESS PINIA STORE
  // ==========================
  computed: {
    categoryStore() {
      return useCategoryStore()
    }
  },

  // ==========================
  // COMPONENT METHODS
  // ==========================
  methods: {

    // Enable edit mode for a category
    editCategory(id, name) {
      this.editingId = id
      this.editingName = name
      this.originalName = name
    },

    // Save edited category name
    saveCategory(id) {
      if (!this.editingName.trim()) {
        this.cancelEdit() // If name is empty, cancel edit and revert to original name
        return}  // Prevent empty names

      this.categoryStore.updateCategory(id, this.editingName)

      // Reset editing state
      this.editingId = null
      this.editingName = ''
      this.originalName = ''
    },
    cancelEdit() {
      this.editingName = this.originalName
      this.editingId = null
    }

  }
}
</script>

<template>
  <div class="container">

    <!-- ==========================
         HEADER
    =========================== -->
    <h1>Kategorien</h1>

    <!-- ==========================
         CATEGORY LIST
    =========================== -->
    <ul>
      <li
        v-for="category in categoryStore.categories"
        :key="category.id"
        @click="categoryStore.selectCategory(category.id)"
        :class="{ active: category.id === categoryStore.selectedCategoryId }"
      >
        <!-- Category name / edit input -->
        <div>
          <!-- Edit mode input -->
          <input
            v-if="editingId === category.id"
            v-model="editingName"
            @keyup.enter="saveCategory(category.id)"
            class="edit-category"
            @keyup.esc="cancelEdit"
            @blur="saveCategory(category.id)"
            @click.stop
          />

          <!-- Normal display -->
          <span v-else>
            {{ category.name }}
          </span>
        </div>

        <!-- Action buttons -->
        <div class="actions">

          <!-- Edit button -->
          <!-- stopPropagation prevents category selection when clicking edit -->
          <button
            class="updateButton"
            @click.stop="editCategory(category.id, category.name)"
            v-if="editingId !== category.id"
          >
            <Pencil size="18" />
          </button>

          <!-- Delete button -->
          <!-- stopPropagation prevents category selection -->
          <button
            class="deleteButton"
            @click.stop="categoryStore.deleteCategory(category.id)"
          >
            <Trash2 size="18" />
          </button>

        </div>
      </li>
    </ul>

    <!-- ==========================
         ADD NEW CATEGORY INPUT
    =========================== -->
    <input
      v-model="newCategory"
      placeholder="Neue Kategorie hinzufügen"
      class="form-control"
      @keyup.enter="categoryStore.addCategory(newCategory); newCategory=''"
    />

  </div>
</template>

<style>
/* ==========================
   LAYOUT
========================== */

.container {
  padding: 0;
}

h1 {
  font-size: 24px;
  margin-bottom: 24px;
  font-weight: 700;
  letter-spacing: -0.3px;
}

/* ==========================
   CATEGORY LIST
========================== */

ul {
  padding: 0;
  list-style: none;
  margin: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 12px;
  border-radius: 12px;
  margin-bottom: 8px;
  transition: all 0.15s ease;
}

li:hover {
  background: #f1f5f9;
  cursor: pointer;
  transform: translateX(2px);
}

/* Active category highlight */
.active {
  background: #dbeafe;
  color: #1d4ed8;
  font-weight: 600;
}

/* ==========================
   ACTION BUTTONS
========================== */

.updateButton,
.deleteButton {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  padding: 6px;
  margin-left: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.updateButton {
  background: #facc15;
  color: #78350f;
}

.deleteButton {
  background: #f87171;
  color: white;
}

.updateButton:hover {
  background: #eab308;
  transform: translateY(-1px);
}

.deleteButton:hover {
  background: #ef4444;
  transform: translateY(-1px);
}

/* ==========================
   INPUT FIELD
========================== */

.form-control {
  width: 100%;
  padding: 10px 4px;
  margin-top: 18px;
  border: none;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
  background: transparent;
}

/* ==========================
   ACTIONS WRAPPER
========================== */

.actions {
  display: flex;
  align-items: center;
}

/* ==========================
   MOBILE OPTIMIZATION
========================== */

@media (max-width: 768px) {
  h1 { font-size: 22px; }
  li { padding: 12px 8px; }
  .form-control { font-size: 13px; }
}
</style>
