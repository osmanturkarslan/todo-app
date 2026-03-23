<script>
// ==========================
// TASK MANAGER COMPONENT
// ==========================

// Pinia stores
import { useCategoryStore } from '../stores/categoryStore'
import { useTaskStore } from '../stores/taskStore'

// Child component for each task
import TaskManagerItem from './TaskManagerItem.vue'

export default {
  name: 'TaskManager',

  components: {
    TaskManagerItem
  },

  // ==========================
  // LOCAL STATE
  // ==========================
  data() {
    return {
      // Task creation
      newTaskText: '',
      selectedCategoryId: '',
      selectedPriority: 'mittel',
      isProtected: false,
      taskPassword: '',

      // Task editing
      editingTaskId: null,
      editingTaskText: '',
      originalTaskText: '',
      editingCategoryTaskId: null,
      editingPriorityTaskId: null,

      // Filters
      filterStatus: 'alle',
      filterPriority: 'alle',
      searchText: ''
    }
  },

  // ==========================
  // STORE ACCESS
  // ==========================
  computed: {
    categoryStore() { return useCategoryStore() },
    taskStore() { return useTaskStore() },

    // ==========================
    // TASK FILTERING LOGIC
    // ==========================
    filteredTasks() {
      let tasks = this.taskStore.tasks

      // Filter by selected category
      if (this.categoryStore.selectedCategoryId) {
        tasks = tasks.filter(
          task => task.categoryId === this.categoryStore.selectedCategoryId
        )
      }

      // Filter by completion status
      if (this.filterStatus === 'offen')
        tasks = tasks.filter(task => !task.completed)
      else if (this.filterStatus === 'erledigt')
        tasks = tasks.filter(task => task.completed)

      // Filter by priority
      if (this.filterPriority !== 'alle') {
        tasks = tasks.filter(task => task.priority === this.filterPriority)
      }

      // Filter by search text
      if (this.searchText.trim()) {
        const text = this.searchText.toLowerCase()
        tasks = tasks.filter(task =>
          task.text.toLowerCase().includes(text)
        )
      }

      return tasks
    }
  },

  // ==========================
  // METHODS
  // ==========================
  methods: {

    // --------------------------
    // Add new task
    // --------------------------
    addTask() {
      if (!this.newTaskText.trim()) return  // Prevent empty tasks

      this.taskStore.addTask({
        text: this.newTaskText,
        categoryId: this.selectedCategoryId || 1, // Default category
        priority: this.selectedPriority,
        protected: this.isProtected,
        password: this.taskPassword
      })

      // Reset form
      this.newTaskText = ''
      this.selectedCategoryId = ''
      this.selectedPriority = 'mittel'
      this.isProtected = false
      this.taskPassword = ''
    },

    // --------------------------
    // Task state management
    // --------------------------
    toggleStatus(task) {
      this.taskStore.toggleTaskStatus(task.id)
    },

    deleteTask(taskId) {
      this.taskStore.deleteTask(taskId)
    },

    // --------------------------
    // Edit task text
    // --------------------------
    editTask(task) {
      this.editingTaskId = task.id
      this.editingTaskText = task.text
      this.originalTaskText = task.text
    },

    saveTask(taskId) {
      if (!this.editingTaskText.trim()) {
        // Restore original if empty
        this.editingTaskText = this.originalTaskText
        this.editingTaskId = null
        return
      }

      this.taskStore.updateTask(taskId, this.editingTaskText)
      this.editingTaskId = null
    },

    cancelEdit() {
      this.editingTaskText = this.originalTaskText
      this.editingTaskId = null
    },

    // --------------------------
    // Category & priority edits
    // --------------------------
    changeCategory(taskId, newCategoryId) {
      this.taskStore.updateTaskCategory(taskId, newCategoryId)
      this.editingCategoryTaskId = null
    },

    changePriority(taskId, newPriority) {
      this.taskStore.updateTaskPriority(taskId, newPriority)
      this.editingPriorityTaskId = null
    },

    // --------------------------
    // Protected task unlock
    // --------------------------
    showUnlock(task) {
      task.showPasswordInput = true
      task.tempPassword = ''
    },

    confirmUnlock(task) {
      if (task.tempPassword === task.password) {
        task.unlocked = true
        task.showPasswordInput = false
      } else {
        alert('Falsches Passwort!')
      }
    }

  }
}
</script>

<template>
  <div class="task-container">

    <!-- ==========================
         HEADER
    =========================== -->
    <div class="task-header">
      <h1>Aufgaben</h1>

      <!-- ==========================
           FILTERS
      =========================== -->
      <div class="filters">
        <!-- Status filters -->
        <button :class="{active: filterStatus==='alle'}" @click="filterStatus='alle'">Alle</button>
        <button :class="{active: filterStatus==='offen'}" @click="filterStatus='offen'">Offen</button>
        <button :class="{active: filterStatus==='erledigt'}" @click="filterStatus='erledigt'">Erledigt</button>

        <!-- Line break for second row -->
        <div class="flex-break"></div>

        <!-- Priority filters -->
        <button :class="{active: filterPriority==='alle'}" @click="filterPriority='alle'">Alle Prioritäten</button>
        <button :class="{active: filterPriority==='hoch'}" @click="filterPriority='hoch'">🔴 Hoch</button>
        <button :class="{active: filterPriority==='mittel'}" @click="filterPriority='mittel'">🟡 Mittel</button>
        <button :class="{active: filterPriority==='niedrig'}" @click="filterPriority='niedrig'">🟢 Niedrig</button>
      </div>

      <!-- ==========================
           SEARCH
      =========================== -->
      <div class="search-box">
        <input v-model="searchText" placeholder="Aufgaben suchen..." />
      </div>

      <!-- ==========================
           TASK CREATION FORM
      =========================== -->
      <div class="task-inputs">
        <input
          v-model="newTaskText"
          placeholder="Neue Aufgabe"
          class="task-input"
          @keyup.enter="addTask"
        />

        <select v-model="selectedCategoryId" class="task-select">
          <option value="">Kategorie (Auto Privat)</option>
          <option
            v-for="cat in categoryStore.categories"
            :key="cat.id"
            :value="cat.id"
          >
            {{ cat.name }}
          </option>
        </select>

        <select v-model="selectedPriority" class="task-select">
          <option value="niedrig">🟢 Niedrig</option>
          <option value="mittel">🟡 Mittel</option>
          <option value="hoch">🔴 Hoch</option>
        </select>

        <!-- Password protection -->
        <label class="protect-check">
          <input type="checkbox" v-model="isProtected" /> 🔒
        </label>

        <input
          v-if="isProtected"
          type="password"
          v-model="taskPassword"
          placeholder="Passwort"
          class="task-input"
        />

        <button class="add-btn" @click="addTask">+</button>
      </div>
    </div>

    <!-- ==========================
         EMPTY STATE
    =========================== -->
    <div v-if="filteredTasks.length === 0" class="empty">
      <p>Keine Aufgaben gefunden</p>
    </div>

    <!-- ==========================
         TASK LIST
    =========================== -->
    <div v-else class="task-list">
      <TaskManagerItem
        v-for="task in filteredTasks"
        :key="task.id"
        :task="task"
        :categoryStore="categoryStore"
        :editingTaskId="editingTaskId"
        :editingTaskText="editingTaskText"
        :editingCategoryTaskId="editingCategoryTaskId"
        :editingPriorityTaskId="editingPriorityTaskId"

        @toggle-status="toggleStatus"
        @delete-task="deleteTask"
        @edit-task="editTask"
        @save-task="saveTask"
        @cancel-edit="cancelEdit"
        @change-category="changeCategory"
        @change-priority="changePriority"
        @show-unlock="showUnlock"
        @confirm-unlock="confirmUnlock"
        @set-editing-category="editingCategoryTaskId = $event"
        @set-editing-priority="editingPriorityTaskId = $event"
        @update-edit-text="editingTaskText = $event"
      />
    </div>

  </div>
</template>

<style scoped>
.task-header { margin-bottom: 30px; }
.task-header h1 { font-size: 28px; margin-bottom: 20px; font-weight: 700; }
.task-inputs { display: flex; gap: 12px; }

.task-input, .task-select, .edit-input {
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  background: white;
}

.task-input { width: 320px; }
.task-select { width: 180px; }
.edit-input { width: 260px; }

.add-btn {
  width: 44px;
  border-radius: 10px;
  border: none;
  background: #111827;
  color: white;
  font-size: 18px;
  cursor: pointer;
}
.add-btn:hover { background: #2563eb; }

.task-list { display: flex; flex-direction: column; gap: 14px; }

.empty {
  margin-top: 60px;
  text-align: center;
  color: #6b7280;
  font-size: 16px;
}

.filters { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }

.filters button {
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid #d1d5db;
  background: white;
  cursor: pointer;
}

.filters button.active {
  background: #111827;
  color: white;
  border-color: #111827;
}

.flex-break { flex-basis: 100%; height: 0; }

.search-box { margin-bottom: 20px; }

.search-box input {
  width: 260px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
}

.protect-check {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

/* 📱 MOBILE */
@media (max-width: 768px) {

  .task-header h1 {
    font-size: 22px;
  }

  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .filters button {
    font-size: 12px;
    padding: 5px 7px;
  }

  .flex-break {
    flex-basis: 100%;
    height: 0;
  }

  .search-box input {
    width: 92%;
  }

  .task-inputs {
    flex-direction: column;
    gap: 10px;
  }

  .task-input {
    width: 91%;
  }

  .task-select {
    width: 100%;
  }

  .add-btn {
    width: 100%;
    height: 44px;
    font-size: 20px;
  }

  .task-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .badges {
    flex-wrap: wrap;
    gap: 6px;
  }

  .badge {
    font-size: 11px;
    padding: 5px 8px;
  }
}
</style>
