<script>
// ==========================
// SINGLE TASK ITEM COMPONENT
// ==========================

// Icons
import { Pencil, Trash2 } from 'lucide-vue-next'

export default {
  name: 'TaskManagerItem',

  // Register icon components
  components: {
    Pencil,
    Trash2
  },

  // ==========================
  // PROPS FROM PARENT
  // ==========================
  props: {
    task: Object,                     // Task object
    categoryStore: Object,           // Category store reference
    editingTaskId: Number,           // Currently edited task ID
    editingTaskText: String,         // Edited text value
    editingCategoryTaskId: Number,   // Task being edited (category)
    editingPriorityTaskId: Number    // Task being edited (priority)
  },

  // ==========================
  // EVENTS EMITTED TO PARENT
  // ==========================
  emits: [
    'toggle-status',
    'delete-task',
    'edit-task',
    'save-task',
    'cancel-edit',
    'change-category',
    'change-priority',
    'show-unlock',
    'confirm-unlock',
    'set-editing-category',
    'set-editing-priority',
    'update-edit-text'
  ],

  // ==========================
  // HELPER METHODS
  // ==========================
  methods: {

    // Get readable category name from store
    getCategoryName(categoryId) {
      const cat = this.categoryStore.categories.find(
        c => c.id === categoryId
      )
      return cat ? cat.name : 'Unbekannt'
    },

    // Check if task is editable
    // Protected tasks must be unlocked first
    canEdit(task) {
      return !task.protected || task.unlocked
    }

  }
}
</script>

<template>
  <div class="task-card">

    <!-- ==========================
         LEFT SIDE (TEXT / EDIT)
    =========================== -->
    <div class="task-left">

      <!-- Edit input -->
      <input
        v-if="editingTaskId === task.id"
        :value="editingTaskText"
        @input="$emit('update-edit-text', $event.target.value)"
        @keyup.enter="$emit('save-task', task.id)"
        @keyup.esc="$emit('cancel-edit')"
        class="edit-input"
        autofocus
      />

      <!-- Task display -->
      <span v-else :class="{ done: task.completed }">

        <!-- Protected task -->
        <template v-if="task.protected && !task.unlocked">

          <!-- Locked badge -->
          <span
            class="lock-badge"
            @click="$emit('show-unlock', task)"
          >
            🔒 Geschützt
          </span>

          <!-- Password input -->
          <div v-if="task.showPasswordInput" class="unlock-area">
            <input
              type="password"
              v-model="task.tempPassword"
              placeholder="Passwort"
              class="unlock-input"
              @keyup.enter="$emit('confirm-unlock', task)"
            />
            <button
              class="unlock-btn"
              @click="$emit('confirm-unlock', task)"
            >
              OK
            </button>
          </div>

        </template>

        <!-- Normal task text -->
        <template v-else>
          {{ task.text }}
        </template>

      </span>
    </div>

    <!-- ==========================
         RIGHT SIDE (BADGES)
    =========================== -->
    <div class="badges">

      <!-- Category edit dropdown -->
      <select
        v-if="editingCategoryTaskId === task.id"
        v-model="task.categoryId"
        @change="$emit('change-category', task.id, task.categoryId)"
        @blur="$emit('set-editing-category', null)"
        class="badge category-select"
      >
        <option
          v-for="cat in categoryStore.categories"
          :key="cat.id"
          :value="cat.id"
        >
          {{ cat.name }}
        </option>
      </select>

      <!-- Category badge -->
      <span
        v-else
        class="badge category"
        @click="canEdit(task) && $emit('set-editing-category', task.id)"
        :style="{
          opacity: task.protected && !task.unlocked ? 0.5 : 1,
          pointerEvents: task.protected && !task.unlocked ? 'none' : 'auto'
        }"
      >
        {{ getCategoryName(task.categoryId) }}
      </span>

      <!-- Priority edit dropdown -->
      <select
        v-if="editingPriorityTaskId === task.id"
        v-model="task.priority"
        @change="$emit('change-priority', task.id, task.priority)"
        @blur="$emit('set-editing-priority', null)"
        class="badge category-select"
      >
        <option value="hoch">🔴 Hoch</option>
        <option value="mittel">🟡 Mittel</option>
        <option value="niedrig">🟢 Niedrig</option>
      </select>

      <!-- Priority badge -->
      <span
        v-else
        class="badge priority"
        @click="canEdit(task) && $emit('set-editing-priority', task.id)"
        :style="{
          opacity: task.protected && !task.unlocked ? 0.5 : 1,
          pointerEvents: task.protected && !task.unlocked ? 'none' : 'auto'
        }"
      >
        <template v-if="task.priority==='hoch'">🔴 Hoch</template>
        <template v-else-if="task.priority==='mittel'">🟡 Mittel</template>
        <template v-else>🟢 Niedrig</template>
      </span>

      <!-- Status badge -->
      <span
        class="badge status"
        :class="task.completed ? 'done' : 'open'"
        @click="canEdit(task) && $emit('toggle-status', task)"
        :style="{
          opacity: task.protected && !task.unlocked ? 0.5 : 1,
          pointerEvents: task.protected && !task.unlocked ? 'none' : 'auto'
        }"
      >
        {{ task.completed ? 'Erledigt' : 'Offen' }}
      </span>

      <!-- Edit button -->
      <button
        v-if="editingTaskId !== task.id"
        class="icon-btn edit"
        @click="canEdit(task) && $emit('edit-task', task)"
      >
        <Pencil size="16" />
      </button>

      <!-- Delete button -->
      <button
        class="icon-btn delete"
        @click="canEdit(task) && $emit('delete-task', task.id)"
      >
        <Trash2 size="16" />
      </button>

    </div>
  </div>
</template>

<style scoped>
/* ==========================
   TASK CARD LAYOUT
========================== */

.task-card {
  background: white;
  border-radius: 14px;
  padding: 16px 18px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.done {
  text-decoration: line-through;
  color: #9ca3af;
}

/* ==========================
   BADGES
========================== */

.badges {
  display: flex;
  gap: 8px;
  align-items: center;
}

.badge {
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
}

.category { background: #dcfce7; color: #166534; }

.category-select {
  border: none;
  padding: 6px 10px;
  border-radius: 999px;
  background: #dcfce7;
  color: #166534;
  font-weight: 600;
}

.status.open { background: #e0e7ff; color: #3730a3; }
.status.done { background: #fee2e2; color: #991b1b; }

/* ==========================
   ICON BUTTONS
========================== */

.icon-btn {
  border: none;
  padding: 6px;
  border-radius: 8px;
  cursor: pointer;
}

.icon-btn.edit { background: #fef9c3; }
.icon-btn.delete { background: #fee2e2; }
.icon-btn:hover { opacity: 0.8; }

/* ==========================
   PRIORITY
========================== */

.priority { background: #f3f4f6; color: #111827; }

/* ==========================
   PROTECTED TASK UI
========================== */

.lock-badge {
  background: #111827;
  color: white;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  cursor: pointer;
}

.unlock-area {
  display: flex;
  gap: 6px;
  margin-top: 6px;
}

.unlock-input {
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 12px;
  width: 120px;
}

.unlock-btn {
  border: none;
  background: #111827;
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
}
</style>
