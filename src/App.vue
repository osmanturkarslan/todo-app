<script>
// Import main components
import CategoryManager from './components/CategoryManager.vue'
import TaskManager from './components/TaskManager.vue'

export default {
  // Register components
  components: {
    CategoryManager,
    TaskManager
  }
}
</script>

<template>
  <!-- App Layout Wrapper -->
  <div id="app" class="layout">

    <!-- Left Sidebar (Categories) -->
    <aside class="sidebar">
      <CategoryManager />
    </aside>

    <!-- Main Content Area (Tasks) -->
    <main class="main">
      <TaskManager />
    </main>

  </div>
</template>

<style>

/* ===== GLOBAL STYLES ===== */
body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  background: #f3f4f6;
}

/* ===== DESKTOP LAYOUT ===== */
.layout {
  display: flex;
  height: 100vh;
}

/* Sidebar (Category Panel) */
.sidebar {
  width: 320px;
  background: white;
  border-right: 1px solid #e5e7eb;
  padding: 30px 20px;
}

/* Main Content (Task Panel) */
.main {
  flex: 1;
  padding: 40px;
  overflow-y: auto; /* Enables scrolling for long task lists */
}

/* ===== MOBILE LAYOUT ===== */
@media (max-width: 900px) {

  /* Stack sidebar above main content */
  .layout {
    flex-direction: column !important;
  }

  /* Sidebar becomes full-width top panel */
  .sidebar {
    width: 90% !important;
    border-right: none !important;
    border-bottom: 1px solid #2a2f3a;
  }

}

</style>
