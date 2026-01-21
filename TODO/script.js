// ==================== GLOBAL STATE ====================
let tasks = [];
let currentFilter = 'all';
let currentCategory = 'all';
let currentSort = 'date-desc';
let currentEditId = null;
let currentSubtaskId = null;
let deletedTasks = [];
let currentLanguage = localStorage.getItem('language') || 'sr';
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// ==================== TRANSLATIONS ====================
const translations = {
    sr: {
        appTitle: 'Todo Lista Pro',
        totalLabel: 'Ukupno:',
        completedLabel: 'Završeno:',
        activeLabel: 'Aktivno:',
        streakLabel: 'Streak:',
        searchPlaceholder: '🔍 Pretraži zadatke...',
        filterAll: 'Svi',
        filterActive: 'Aktivni',
        filterCompleted: 'Završeni',
        sortDateDesc: 'Najnovije prvo',
        sortDateAsc: 'Najstarije prvo',
        sortAlphaAsc: 'A-Z',
        sortAlphaDesc: 'Z-A',
        sortPriority: 'Po prioritetu',
        sortDueDate: 'Po roku',
        taskPlaceholder: 'Unesite novi zadatak...',
        notePlaceholder: 'Napomena (opciono)...',
        addBtnText: 'Dodaj',
        markAllText: 'Označi sve',
        deleteCompletedText: 'Obriši završene',
        deleteAllText: 'Obriši sve',
        exportText: 'Izvezi',
        importText: 'Uvezi',
        showStatsText: 'Prikaži statistiku',
        editModalTitle: 'Izmeni Zadatak',
        saveBtnText: 'Sačuvaj',
        cancelBtnText: 'Otkaži',
        statsModalTitle: 'Statistika i Analytics',
        totalCreatedLabel: 'Ukupno kreirano',
        totalCompletedLabel: 'Ukupno završeno',
        completionRateLabel: 'Stopa završavanja',
        avgPerDayLabel: 'Prosek dnevno',
        closeStatsBtnText: 'Zatvori',
        subtasksModalTitle: 'Podzadaci',
        closeSubtasksBtnText: 'Zatvori',
        settingsModalTitle: 'Podešavanja',
        saveSettingsBtnText: 'Sačuvaj',
        closeSettingsBtnText: 'Zatvori',
        undoText: 'Vrati',
        deleteConfirm: '❓ Da li ste sigurni da želite da obrišete ovaj zadatak?',
        deleteAllConfirm: '⚠️ Da li ste sigurni da želite da obrišete SVE zadatke?',
        emptyInput: '⚠️ Molimo unesite zadatak!',
        emptyTask: '⚠️ Zadatak ne može biti prazan!',
        taskDeleted: 'Zadatak obrisan',
        tasksDeleted: 'Zadaci obrisani',
        noTasks: '📭 Nema zadataka. Dodajte novi zadatak!',
        overdue: 'Zakasnjenje',
        dueToday: 'Danas',
        dueTomorrow: 'Sutra'
    },
    en: {
        appTitle: 'Todo List Pro',
        totalLabel: 'Total:',
        completedLabel: 'Completed:',
        activeLabel: 'Active:',
        streakLabel: 'Streak:',
        searchPlaceholder: '🔍 Search tasks...',
        filterAll: 'All',
        filterActive: 'Active',
        filterCompleted: 'Completed',
        sortDateDesc: 'Newest first',
        sortDateAsc: 'Oldest first',
        sortAlphaAsc: 'A-Z',
        sortAlphaDesc: 'Z-A',
        sortPriority: 'By priority',
        sortDueDate: 'By due date',
        taskPlaceholder: 'Enter new task...',
        notePlaceholder: 'Note (optional)...',
        addBtnText: 'Add',
        markAllText: 'Mark all',
        deleteCompletedText: 'Delete completed',
        deleteAllText: 'Delete all',
        exportText: 'Export',
        importText: 'Import',
        showStatsText: 'Show statistics',
        editModalTitle: 'Edit Task',
        saveBtnText: 'Save',
        cancelBtnText: 'Cancel',
        statsModalTitle: 'Statistics & Analytics',
        totalCreatedLabel: 'Total created',
        totalCompletedLabel: 'Total completed',
        completionRateLabel: 'Completion rate',
        avgPerDayLabel: 'Average per day',
        closeStatsBtnText: 'Close',
        subtasksModalTitle: 'Subtasks',
        closeSubtasksBtnText: 'Close',
        settingsModalTitle: 'Settings',
        saveSettingsBtnText: 'Save',
        closeSettingsBtnText: 'Close',
        undoText: 'Undo',
        deleteConfirm: '❓ Are you sure you want to delete this task?',
        deleteAllConfirm: '⚠️ Are you sure you want to delete ALL tasks?',
        emptyInput: '⚠️ Please enter a task!',
        emptyTask: '⚠️ Task cannot be empty!',
        taskDeleted: 'Task deleted',
        tasksDeleted: 'Tasks deleted',
        noTasks: '📭 No tasks. Add a new task!',
        overdue: 'Overdue',
        dueToday: 'Today',
        dueTomorrow: 'Tomorrow'
    }
};

// ==================== DOM ELEMENTS ====================
const elements = {
    // Header
    appTitle: document.getElementById('app-title'),
    langToggle: document.getElementById('lang-toggle'),
    themeToggle: document.getElementById('theme-toggle'),
    
    // Progress & Stats
    progressBar: document.getElementById('progress-bar'),
    totalTasks: document.getElementById('total-tasks'),
    completedTasks: document.getElementById('completed-tasks'),
    activeTasks: document.getElementById('active-tasks'),
    streakValue: document.getElementById('streak-value'),
    
    // Search & Filters
    searchInput: document.getElementById('search-input'),
    categoryFilter: document.getElementById('category-filter'),
    sortSelect: document.getElementById('sort-select'),
    
    // Task Input
    taskInput: document.getElementById('task-input'),
    noteInput: document.getElementById('note-input'),
    noteSection: document.getElementById('note-section'),
    toggleNoteBtn: document.getElementById('toggle-note-btn'),
    prioritySelect: document.getElementById('priority-select'),
    categorySelect: document.getElementById('category-select'),
    dueDateInput: document.getElementById('due-date-input'),
    addBtn: document.getElementById('add-btn'),
    
    // Bulk Actions
    markAllBtn: document.getElementById('mark-all-btn'),
    deleteCompletedBtn: document.getElementById('delete-completed-btn'),
    deleteAllBtn: document.getElementById('delete-all-btn'),
    exportBtn: document.getElementById('export-btn'),
    importBtn: document.getElementById('import-btn'),
    importFile: document.getElementById('import-file'),
    
    // Task List
    taskList: document.getElementById('task-list'),
    
    // Modals
    editModal: document.getElementById('edit-modal'),
    editTaskInput: document.getElementById('edit-task-input'),
    editNoteInput: document.getElementById('edit-note-input'),
    editPrioritySelect: document.getElementById('edit-priority-select'),
    editCategorySelect: document.getElementById('edit-category-select'),
    editDueDateInput: document.getElementById('edit-due-date-input'),
    saveEditBtn: document.getElementById('save-edit-btn'),
    cancelEditBtn: document.getElementById('cancel-edit-btn'),
    
    statsModal: document.getElementById('stats-modal'),
    showStatsBtn: document.getElementById('show-stats-btn'),
    closeStatsBtn: document.getElementById('close-stats-btn'),
    
    subtasksModal: document.getElementById('subtasks-modal'),
    subtaskList: document.getElementById('subtask-list'),
    subtaskInput: document.getElementById('subtask-input'),
    addSubtaskBtn: document.getElementById('add-subtask-btn'),
    closeSubtasksBtn: document.getElementById('close-subtasks-btn'),
    
    // Settings Modal
    settingsBtn: document.getElementById('settings-btn'),
    settingsModal: document.getElementById('settings-modal'),
    notificationsToggle: document.getElementById('notifications-toggle'),
    soundToggle: document.getElementById('sound-toggle'),
    autoArchiveToggle: document.getElementById('auto-archive-toggle'),
    saveSettingsBtn: document.getElementById('save-settings-btn'),
    closeSettingsBtn: document.getElementById('close-settings-btn'),
    
    // Toast
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toast-message'),
    undoBtn: document.getElementById('undo-btn')
};

// ==================== INITIALIZATION ====================
function init() {
    loadTasks();
    applyLanguage();
    applyDarkMode();
    setupEventListeners();
    renderTasks();
    updateStats();
    updateProgressBar();
    checkNotifications();
    requestNotificationPermission();
    
    // Check notifications every minute
    setInterval(checkNotifications, 60000);
}

// ==================== LOAD & SAVE ====================
function loadTasks() {
    const saved = localStorage.getItem('tasks');
    tasks = saved ? JSON.parse(saved) : [];
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    updateStats();
    updateProgressBar();
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Language & Theme
    if (elements.langToggle) elements.langToggle.addEventListener('click', toggleLanguage);
    if (elements.themeToggle) elements.themeToggle.addEventListener('click', toggleDarkMode);
    
    // Search & Filters
    if (elements.searchInput) elements.searchInput.addEventListener('input', handleSearch);
    
    // Filter buttons - potrebno pronaci dugmice sa data-filter atributima
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filter = e.target.dataset.filter;
            if (filter) setFilter(filter);
        });
    });
    
    if (elements.categoryFilter) elements.categoryFilter.addEventListener('change', handleCategoryFilter);
    if (elements.sortSelect) elements.sortSelect.addEventListener('change', handleSort);
    
    // Add Task
    if (elements.addBtn) elements.addBtn.addEventListener('click', addTask);
    if (elements.taskInput) {
        elements.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTask();
        });
    }
    if (elements.toggleNoteBtn) elements.toggleNoteBtn.addEventListener('click', toggleNoteField);
    
    // Bulk Actions
    if (elements.markAllBtn) elements.markAllBtn.addEventListener('click', markAllComplete);
    if (elements.deleteCompletedBtn) elements.deleteCompletedBtn.addEventListener('click', deleteCompleted);
    if (elements.deleteAllBtn) elements.deleteAllBtn.addEventListener('click', deleteAllTasks);
    if (elements.exportBtn) elements.exportBtn.addEventListener('click', exportTasks);
    if (elements.importBtn) elements.importBtn.addEventListener('click', () => elements.importFile.click());
    if (elements.importFile) elements.importFile.addEventListener('change', importTasks);
    
    // Edit Modal
    if (elements.saveEditBtn) elements.saveEditBtn.addEventListener('click', saveEdit);
    if (elements.cancelEditBtn) elements.cancelEditBtn.addEventListener('click', closeEditModal);
    if (elements.editModal) {
        elements.editModal.addEventListener('click', (e) => {
            if (e.target === elements.editModal) closeEditModal();
        });
    }
    if (elements.editTaskInput) {
        elements.editTaskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') saveEdit();
        });
    }
    
    // Stats Modal
    if (elements.showStatsBtn) elements.showStatsBtn.addEventListener('click', showStats);
    if (elements.closeStatsBtn) elements.closeStatsBtn.addEventListener('click', closeStatsModal);
    if (elements.statsModal) {
        elements.statsModal.addEventListener('click', (e) => {
            if (e.target === elements.statsModal) closeStatsModal();
        });
    }
    
    // Subtasks Modal
    if (elements.addSubtaskBtn) elements.addSubtaskBtn.addEventListener('click', addSubtask);
    if (elements.closeSubtasksBtn) elements.closeSubtasksBtn.addEventListener('click', closeSubtasksModal);
    if (elements.subtasksModal) {
        elements.subtasksModal.addEventListener('click', (e) => {
            if (e.target === elements.subtasksModal) closeSubtasksModal();
        });
    }
    if (elements.subtaskInput) {
        elements.subtaskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addSubtask();
        });
    }
    
    // Settings Modal
    if (elements.settingsBtn) elements.settingsBtn.addEventListener('click', openSettingsModal);
    if (elements.saveSettingsBtn) elements.saveSettingsBtn.addEventListener('click', saveSettings);
    if (elements.closeSettingsBtn) elements.closeSettingsBtn.addEventListener('click', closeSettingsModal);
    if (elements.settingsModal) {
        elements.settingsModal.addEventListener('click', (e) => {
            if (e.target === elements.settingsModal) closeSettingsModal();
        });
    }
    
    // Toast
    if (elements.undoBtn) elements.undoBtn.addEventListener('click', undoDelete);
    
    // Keyboard Shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Drag and Drop
    if (elements.taskList) {
        elements.taskList.addEventListener('dragover', handleDragOver);
        elements.taskList.addEventListener('drop', handleDrop);
    }
}

// ==================== LANGUAGE ====================
function toggleLanguage() {
    currentLanguage = currentLanguage === 'sr' ? 'en' : 'sr';
    localStorage.setItem('language', currentLanguage);
    applyLanguage();
    renderTasks();
}

function applyLanguage() {
    const t = translations[currentLanguage];
    
    // Update all translatable elements
    Object.keys(t).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = t[key];
            } else {
                element.textContent = t[key];
            }
        }
    });
    
    // Update select options
    const sortOptions = elements.sortSelect.options;
    sortOptions[0].text = t.sortDateDesc;
    sortOptions[1].text = t.sortDateAsc;
    sortOptions[2].text = t.sortAlphaAsc;
    sortOptions[3].text = t.sortAlphaDesc;
    sortOptions[4].text = t.sortPriority;
    sortOptions[5].text = t.sortDueDate;
}

function t(key) {
    return translations[currentLanguage][key] || key;
}

// ==================== DARK MODE ====================
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    localStorage.setItem('darkMode', isDarkMode);
    applyDarkMode();
}

function applyDarkMode() {
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        if (elements.themeToggle) elements.themeToggle.textContent = '☀️';
    } else {
        document.body.classList.remove('dark-mode');
        if (elements.themeToggle) elements.themeToggle.textContent = '🌙';
    }
}

// ==================== ADD TASK ====================
function addTask() {
    const text = elements.taskInput.value.trim();
    
    if (!text) {
        alert(t('emptyInput'));
        return;
    }
    
    const newTask = {
        id: Date.now(),
        text: text,
        note: elements.noteInput ? elements.noteInput.value.trim() : '',
        completed: false,
        priority: elements.prioritySelect.value,
        category: elements.categorySelect.value,
        dueDate: elements.dueDateInput.value,
        createdAt: new Date().toISOString(),
        subtasks: []
    };
    
    tasks.unshift(newTask);
    saveTasks();
    renderTasks();
    updateStats();
    
    // Clear inputs
    elements.taskInput.value = '';
    if (elements.noteInput) elements.noteInput.value = '';
    if (elements.noteSection) elements.noteSection.style.display = 'none';
    if (elements.dueDateInput) elements.dueDateInput.value = '';
    elements.taskInput.focus();
}

function toggleNoteField() {
    if (elements.noteSection) {
        const isVisible = elements.noteSection.style.display !== 'none';
        elements.noteSection.style.display = isVisible ? 'none' : 'block';
        if (!isVisible && elements.noteInput) elements.noteInput.focus();
    }
}

// ==================== RENDER TASKS ====================
function renderTasks() {
    elements.taskList.innerHTML = '';
    
    let filteredTasks = filterTasks(tasks);
    filteredTasks = sortTasks(filteredTasks);
    
    if (filteredTasks.length === 0 && (currentFilter !== 'all' || elements.searchInput.value)) {
        elements.taskList.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-secondary);">📭 Nema rezultata</div>';
        return;
    }
    
    filteredTasks.forEach(task => {
        const li = createTaskElement(task);
        elements.taskList.appendChild(li);
    });
}

function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item priority-${task.priority}`;
    if (task.completed) li.classList.add('completed');
    if (isOverdue(task)) li.classList.add('overdue');
    li.dataset.id = task.id;
    li.draggable = true;
    
    li.addEventListener('dragstart', handleDragStart);
    li.addEventListener('dragend', handleDragEnd);
    
    // Task header
    const header = document.createElement('div');
    header.className = 'task-header';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(task.id));
    
    const content = document.createElement('div');
    content.className = 'task-content';
    
    const titleRow = document.createElement('div');
    titleRow.className = 'task-title-row';
    
    const text = document.createElement('span');
    text.className = 'task-text';
    text.textContent = task.text;
    
    const badges = document.createElement('div');
    badges.className = 'task-badges';
    
    // Category badge
    const categoryBadge = document.createElement('span');
    categoryBadge.className = 'badge badge-category';
    categoryBadge.textContent = getCategoryIcon(task.category);
    badges.appendChild(categoryBadge);
    
    // Due date badge
    if (task.dueDate) {
        const dueBadge = document.createElement('span');
        dueBadge.className = isOverdue(task) ? 'badge badge-overdue' : 'badge badge-due';
        dueBadge.textContent = formatDueDate(task.dueDate);
        badges.appendChild(dueBadge);
    }
    
    titleRow.appendChild(text);
    titleRow.appendChild(badges);
    content.appendChild(titleRow);
    
    // Note
    if (task.note) {
        const note = document.createElement('div');
        note.className = 'task-note';
        note.textContent = task.note;
        content.appendChild(note);
    }
    
    // Subtasks
    if (task.subtasks && task.subtasks.length > 0) {
        const subtasksDiv = document.createElement('div');
        subtasksDiv.className = 'task-subtasks';
        const completedSubtasks = task.subtasks.filter(st => st.completed).length;
        subtasksDiv.innerHTML = `<small>📋 ${completedSubtasks}/${task.subtasks.length} podzadataka</small>`;
        content.appendChild(subtasksDiv);
    }
    
    // Actions
    const actions = document.createElement('div');
    actions.className = 'task-actions';
    
    const editBtn = document.createElement('button');
    editBtn.className = 'task-btn btn-edit';
    editBtn.innerHTML = '✏️';
    editBtn.onclick = () => openEditModal(task.id);
    
    const subtasksBtn = document.createElement('button');
    subtasksBtn.className = 'task-btn btn-subtasks';
    subtasksBtn.innerHTML = '📋';
    subtasksBtn.onclick = () => openSubtasksModal(task.id);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'task-btn btn-delete';
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.onclick = () => deleteTask(task.id);
    
    actions.appendChild(editBtn);
    actions.appendChild(subtasksBtn);
    actions.appendChild(deleteBtn);
    
    content.appendChild(actions);
    header.appendChild(checkbox);
    header.appendChild(content);
    li.appendChild(header);
    
    return li;
}

// ==================== FILTER & SORT ====================
function filterTasks(taskList) {
    let filtered = [...taskList];
    
    // Filter by status
    if (currentFilter === 'active') {
        filtered = filtered.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filtered = filtered.filter(t => t.completed);
    }
    
    // Filter by category
    if (currentCategory !== 'all') {
        filtered = filtered.filter(t => t.category === currentCategory);
    }
    
    // Search filter
    const searchTerm = elements.searchInput.value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(t => 
            t.text.toLowerCase().includes(searchTerm) ||
            (t.note && t.note.toLowerCase().includes(searchTerm))
        );
    }
    
    return filtered;
}

function sortTasks(taskList) {
    const sorted = [...taskList];
    
    switch (currentSort) {
        case 'date-desc':
            return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        case 'date-asc':
            return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        case 'alpha-asc':
            return sorted.sort((a, b) => a.text.localeCompare(b.text));
        case 'alpha-desc':
            return sorted.sort((a, b) => b.text.localeCompare(a.text));
        case 'priority':
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        case 'duedate':
            return sorted.sort((a, b) => {
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
            });
        default:
            return sorted;
    }
}

function setFilter(filter) {
    currentFilter = filter;
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (filter === 'all') elements.filterAll.classList.add('active');
    else if (filter === 'active') elements.filterActive.classList.add('active');
    else if (filter === 'completed') elements.filterCompleted.classList.add('active');
    
    renderTasks();
}

function handleSearch() {
    renderTasks();
}

function handleCategoryFilter(e) {
    currentCategory = e.target.value;
    renderTasks();
}

function handleSort(e) {
    currentSort = e.target.value;
    renderTasks();
}

// ==================== TASK ACTIONS ====================
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date().toISOString() : null;
        saveTasks();
    }
}

function deleteTask(id) {
    if (confirm(t('deleteConfirm'))) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            deletedTasks = [task];
            tasks = tasks.filter(t => t.id !== id);
            saveTasks();
            showToast(t('taskDeleted'));
        }
    }
}

function openEditModal(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    currentEditId = id;
    elements.editTaskInput.value = task.text;
    if (elements.editNoteInput) elements.editNoteInput.value = task.note || '';
    if (elements.editPrioritySelect) elements.editPrioritySelect.value = task.priority;
    if (elements.editCategorySelect) elements.editCategorySelect.value = task.category;
    if (elements.editDueDateInput) elements.editDueDateInput.value = task.dueDate || '';
    
    elements.editModal.classList.add('show');
    elements.editTaskInput.focus();
}

function saveEdit() {
    const text = elements.editTaskInput.value.trim();
    
    if (!text) {
        alert(t('emptyTask'));
        return;
    }
    
    const taskIndex = tasks.findIndex(t => t.id === currentEditId);
    if (taskIndex !== -1) {
        tasks[taskIndex].text = text;
        tasks[taskIndex].note = elements.editNoteInput ? elements.editNoteInput.value.trim() : '';
        tasks[taskIndex].priority = elements.editPrioritySelect.value;
        tasks[taskIndex].category = elements.editCategorySelect.value;
        tasks[taskIndex].dueDate = elements.editDueDateInput.value;
        saveTasks();
        renderTasks();
        updateStats();
    }
    
    closeEditModal();
}

function closeEditModal() {
    elements.editModal.classList.remove('show');
    currentEditId = null;
}

// ==================== SUBTASKS ====================
function openSubtasksModal(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    currentSubtaskId = id;
    if (!task.subtasks) task.subtasks = [];
    
    renderSubtasks(task.subtasks);
    elements.subtasksModal.classList.add('show');
    elements.subtaskInput.focus();
}

function renderSubtasks(subtasks) {
    if (!elements.subtaskList) return;
    elements.subtaskList.innerHTML = '';
    
    subtasks.forEach((subtask, index) => {
        const div = document.createElement('div');
        div.className = 'subtask-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = subtask.completed;
        checkbox.addEventListener('change', () => toggleSubtask(index));
        
        const text = document.createElement('span');
        text.textContent = subtask.text;
        if (subtask.completed) text.style.textDecoration = 'line-through';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'task-btn btn-delete';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.style.marginLeft = 'auto';
        deleteBtn.onclick = () => deleteSubtask(index);
        
        div.appendChild(checkbox);
        div.appendChild(text);
        div.appendChild(deleteBtn);
        if (elements.subtaskList) elements.subtaskList.appendChild(div);
    });
}

function addSubtask() {
    const text = elements.subtaskInput.value.trim();
    if (!text) return;
    
    const task = tasks.find(t => t.id === currentSubtaskId);
    if (task) {
        if (!task.subtasks) task.subtasks = [];
        task.subtasks.push({ text, completed: false });
        saveTasks();
        renderSubtasks(task.subtasks);
        elements.subtaskInput.value = '';
    }
}

function toggleSubtask(index) {
    const task = tasks.find(t => t.id === currentSubtaskId);
    if (task && task.subtasks[index]) {
        task.subtasks[index].completed = !task.subtasks[index].completed;
        saveTasks();
        renderSubtasks(task.subtasks);
    }
}

function deleteSubtask(index) {
    const task = tasks.find(t => t.id === currentSubtaskId);
    if (task) {
        task.subtasks.splice(index, 1);
        saveTasks();
        renderSubtasks(task.subtasks);
    }
}

function closeSubtasksModal() {
    elements.subtasksModal.classList.remove('show');
    currentSubtaskId = null;
}

// ==================== BULK ACTIONS ====================
function markAllComplete() {
    tasks.forEach(task => {
        task.completed = true;
        task.completedAt = new Date().toISOString();
    });
    saveTasks();
}

function deleteCompleted() {
    const completed = tasks.filter(t => t.completed);
    if (completed.length === 0) return;
    
    if (confirm(`${t('deleteConfirm')} (${completed.length})`)) {
        deletedTasks = completed;
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        showToast(t('tasksDeleted'));
    }
}

function deleteAllTasks() {
    if (tasks.length === 0) return;
    
    if (confirm(t('deleteAllConfirm'))) {
        deletedTasks = [...tasks];
        tasks = [];
        saveTasks();
        showToast(t('tasksDeleted'));
    }
}

// ==================== EXPORT / IMPORT ====================
function exportTasks() {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `todo-lista-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

function importTasks(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const imported = JSON.parse(event.target.result);
            if (Array.isArray(imported)) {
                tasks = [...tasks, ...imported];
                saveTasks();
                alert(`✅ Uvezeno ${imported.length} zadataka!`);
            }
        } catch (error) {
            alert('⚠️ Greška pri učitavanju fajla!');
        }
    };
    reader.readAsText(file);
    e.target.value = '';
}

// ==================== DRAG & DROP ====================
let draggedElement = null;

function handleDragStart(e) {
    draggedElement = e.target;
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    const afterElement = getDragAfterElement(elements.taskList, e.clientY);
    const dragging = document.querySelector('.dragging');
    
    if (afterElement == null) {
        elements.taskList.appendChild(dragging);
    } else {
        elements.taskList.insertBefore(dragging, afterElement);
    }
}

function handleDrop(e) {
    e.preventDefault();
    
    // Reorder tasks array based on DOM order
    const newOrder = Array.from(elements.taskList.children).map(li => {
        return tasks.find(t => t.id === parseInt(li.dataset.id));
    }).filter(Boolean);
    
    tasks = newOrder;
    saveTasks();
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// ==================== STATS ====================
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const active = total - completed;
    const streak = calculateStreak();
    
    if (elements.totalTasks) elements.totalTasks.textContent = total;
    if (elements.completedTasks) elements.completedTasks.textContent = completed;
    if (elements.activeTasks) elements.activeTasks.textContent = active;
    if (elements.streakValue) elements.streakValue.textContent = streak + ' 🔥';
}

function updateProgressBar() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    if (elements.progressBar) elements.progressBar.style.width = percentage + '%';
}

function calculateStreak() {
    // Calculate consecutive days with completed tasks
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let currentDate = new Date(today);
    
    while (true) {
        const hasCompletedTask = tasks.some(task => {
            if (!task.completedAt) return false;
            const completedDate = new Date(task.completedAt);
            completedDate.setHours(0, 0, 0, 0);
            return completedDate.getTime() === currentDate.getTime();
        });
        
        if (!hasCompletedTask) break;
        
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
        
        if (streak > 365) break; // Safety limit
    }
    
    return streak;
}

function showStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Calculate average per day
    const firstTaskDate = tasks.length > 0 ? 
        new Date(Math.min(...tasks.map(t => new Date(t.createdAt)))) : new Date();
    const daysSinceFirst = Math.max(1, Math.ceil((new Date() - firstTaskDate) / (1000 * 60 * 60 * 24)));
    const avgPerDay = (total / daysSinceFirst).toFixed(1);
    
    const totalCreatedEl = document.getElementById('total-created');
    const totalCompletedEl = document.getElementById('total-completed-stat');
    const completionRateEl = document.getElementById('completion-rate');
    const avgPerDayEl = document.getElementById('avg-per-day');
    
    if (totalCreatedEl) totalCreatedEl.textContent = total;
    if (totalCompletedEl) totalCompletedEl.textContent = completed;
    if (completionRateEl) completionRateEl.textContent = completionRate + '%';
    if (avgPerDayEl) avgPerDayEl.textContent = avgPerDay;
    
    elements.statsModal.classList.add('show');
    
    // Simple chart visualization (could be enhanced with Chart.js)
    drawSimpleChart();
}

function drawSimpleChart() {
    const canvas = document.getElementById('completion-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    canvas.width = canvas.offsetWidth;
    canvas.height = 250;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Get last 7 days data
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        const count = tasks.filter(task => {
            if (!task.completedAt) return false;
            const completedDate = new Date(task.completedAt);
            completedDate.setHours(0, 0, 0, 0);
            return completedDate.getTime() === date.getTime();
        }).length;
        
        last7Days.push({ date, count });
    }
    
    const maxCount = Math.max(...last7Days.map(d => d.count), 1);
    const barWidth = canvas.width / 7 - 10;
    const barMaxHeight = canvas.height - 40;
    
    // Draw bars
    last7Days.forEach((day, index) => {
        const barHeight = (day.count / maxCount) * barMaxHeight;
        const x = index * (barWidth + 10);
        const y = canvas.height - barHeight - 20;
        
        // Bar
        ctx.fillStyle = getComputedStyle(document.documentElement)
            .getPropertyValue('--primary-color').trim();
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Count
        ctx.fillStyle = getComputedStyle(document.documentElement)
            .getPropertyValue('--text-color').trim();
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(day.count, x + barWidth / 2, y - 5);
        
        // Day label
        const dayLabel = ['Ned', 'Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub'][day.date.getDay()];
        ctx.fillText(dayLabel, x + barWidth / 2, canvas.height - 5);
    });
}

function closeStatsModal() {
    elements.statsModal.classList.remove('show');
}

// ==================== NOTIFICATIONS ====================
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

function showNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
            body: body,
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📝</text></svg>',
            badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📝</text></svg>'
        });
    }
}

function checkNotifications() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    tasks.forEach(task => {
        if (!task.completed && task.dueDate && !task.notified) {
            const dueDate = new Date(task.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            
            if (dueDate.getTime() === now.getTime()) {
                showNotification('📅 Rok danas!', task.text);
                task.notified = true;
                saveTasks();
            }
        }
    });
}

// ==================== TOAST ====================
function showToast(message) {
    elements.toastMessage.textContent = message;
    elements.toast.classList.add('show');
    
    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 5000);
}

function undoDelete() {
    if (deletedTasks.length > 0) {
        tasks = [...tasks, ...deletedTasks];
        deletedTasks = [];
        saveTasks();
        elements.toast.classList.remove('show');
    }
}

// ==================== KEYBOARD SHORTCUTS ====================
function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + K - Focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        elements.searchInput.focus();
    }
    
    // Ctrl/Cmd + N - New task
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        elements.taskInput.focus();
    }
    
    // Escape - Close modals
    if (e.key === 'Escape') {
        closeEditModal();
        closeStatsModal();
        closeSubtasksModal();
        closeSettingsModal();
    }
}

// ==================== SETTINGS MODAL ====================
function openSettingsModal() {
    // Load notification settings
    const notificationSettings = JSON.parse(localStorage.getItem('notificationSettings')) || {
        enabled: true,
        sound: true,
        autoArchive: false
    };
    
    if (elements.notificationsToggle) elements.notificationsToggle.checked = notificationSettings.enabled;
    if (elements.soundToggle) elements.soundToggle.checked = notificationSettings.sound;
    if (elements.autoArchiveToggle) elements.autoArchiveToggle.checked = notificationSettings.autoArchive;
    
    elements.settingsModal.classList.add('show');
}

function closeSettingsModal() {
    elements.settingsModal.classList.remove('show');
}

function saveSettings() {
    // Save notification settings
    const notificationSettings = {
        enabled: elements.notificationsToggle ? elements.notificationsToggle.checked : true,
        sound: elements.soundToggle ? elements.soundToggle.checked : true,
        autoArchive: elements.autoArchiveToggle ? elements.autoArchiveToggle.checked : false
    };
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
    
    // Request notification permission if enabled
    if (notificationSettings.enabled) {
        requestNotificationPermission();
    }
    
    closeSettingsModal();
    showToast('✅ Podešavanja sačuvana!');
}

function clearAllData() {
    const confirmText = currentLanguage === 'sr' 
        ? '⚠️ Da li ste POTPUNO sigurni da želite da obrišete SVE podatke? Ova akcija se NE MOŽE poništiti!'
        : '⚠️ Are you ABSOLUTELY sure you want to delete ALL data? This action CANNOT be undone!';
    
    if (confirm(confirmText)) {
        const doubleConfirm = currentLanguage === 'sr'
            ? 'Potvrdite još jednom: Obrisati SVE podatke?'
            : 'Confirm once more: Delete ALL data?';
        
        if (confirm(doubleConfirm)) {
            // Clear all localStorage
            localStorage.clear();
            
            // Reset tasks
            tasks = [];
            deletedTasks = [];
            
            // Reset to defaults
            isDarkMode = false;
            currentLanguage = 'sr';
            currentFilter = 'all';
            currentCategory = 'all';
            currentSort = 'date-desc';
            
            // Reapply defaults
            applyDarkMode();
            applyLanguage();
            saveTasks();
            
            closeSettingsModal();
            showToast('🗑️ Svi podaci su obrisani!');
        }
    }
}

function calculateDataSize() {
    let totalSize = 0;
    
    // Calculate size of all localStorage items
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            totalSize += localStorage[key].length + key.length;
        }
    }
    
    // Convert to KB
    return (totalSize / 1024).toFixed(2);
}

// ==================== HELPERS ====================
function getCategoryIcon(category) {
    const icons = {
        work: '💼 Posao',
        personal: '👤 Lično',
        shopping: '🛒 Kupovina',
        health: '💪 Zdravlje',
        other: '📌 Ostalo'
    };
    return icons[category] || icons.other;
}

function isOverdue(task) {
    if (!task.dueDate || task.completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
}

function formatDueDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    date.setHours(0, 0, 0, 0);
    
    if (date.getTime() === today.getTime()) {
        return t('dueToday');
    } else if (date.getTime() === tomorrow.getTime()) {
        return t('dueTomorrow');
    } else if (date < today) {
        return t('overdue');
    } else {
        return date.toLocaleDateString('sr-RS', { day: 'numeric', month: 'short' });
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== SERVICE WORKER (PWA) ====================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(registration => {
                console.log('✅ Service Worker registrovan:', registration.scope);
            })
            .catch(error => {
                console.log('❌ Service Worker greška:', error);
            });
    });
}

// ==================== START APP ====================
init();
