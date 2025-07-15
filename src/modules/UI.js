import { AppManager } from "./AppManager";
import { TodoManager } from "./TodoManager";
import { Storage } from './Storage';
import dragula from 'dragula';
import 'dragula/dist/dragula.css';

const UI = (() => {
    const projectsContainer = document.querySelector('#project-list');
    const btnAddProject = document.getElementById('btn-add-project');
    const projectModal = document.getElementById('project-modal');
    const projectForm = document.getElementById('project-form');

    const todoModal = document.getElementById('todo-modal');
    const todoForm = document.getElementById('todo-form');
    const btnAddTodo = document.getElementById('btn-add-todo');

    const notesContainer = document.getElementById('todo-notes-container');
    const checklistContainer = document.getElementById('todo-checklist-container');

    const lists = Array.from(document.querySelectorAll('.todo-list'));

    const openModal = (modal) => modal.classList.remove('hidden');

    const closeModal = (modal) => {
        modal.classList.add('hidden');
        const form = modal.querySelector('form');
        if (form) form.reset();
        if (modal === todoModal) {
            clearContainer(notesContainer);
            clearContainer(checklistContainer);
        }
    };

    const setupModalListeners = () => {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-close')) {
                const modal = e.target.closest('[class$="-modal"]');
                if (modal) closeModal(modal);
            }
            if (e.target.classList.contains('project-modal') || e.target.classList.contains('todo-modal')) {
                closeModal(e.target);
            }
        });
    };

    const clearContainer = (container) => {
        container.textContent = '';
    };

    const renderTodos = (todos) => {
        ['todo', 'doing', 'done'].forEach(status => {
            const column = document.querySelector(`[data-status="${status}"] .todo-list`);
            if (column) clearContainer(column)
        });

        todos.forEach(todo => {
            const card = document.createElement('div');
            const todoTitle = document.createElement('div')
            const todoDate = document.createElement('div')

            todoTitle.textContent = todo.getTitle()
            todoDate.textContent = todo.getDueDate()

            card.dataset.id = todo.getId();
            card.classList.add('todo-card')
            card.classList.add(`priority-${todo.getPriority().toLowerCase()}`);
            card.append(todoTitle, todoDate);

            card.addEventListener('click', () => {
                renderTodoCard(todo);
            });

            const column = document.querySelector(`[data-status="${todo.getStatus()}"] .todo-list`);
            if (column) column.appendChild(card);
        })

    }

    dragula(lists).on('drop', (el, target, source, sibling) => {
        const todoId = el.dataset.id;
        const newStatus = target.closest('[data-status]').dataset.status;

        TodoManager.getTodo(todoId).setStatus(newStatus);
        Storage.save(AppManager.getProjectList(), AppManager.getCurrent()?.getId());
    });

    const renderProjects = (projects) => {
        clearContainer(projectsContainer);

        projects.forEach(project => {
            const item = document.createElement('li');
            item.classList.add('project-item');
            item.dataset.id = project.getId();

            const name = document.createElement('span');
            name.textContent = project.getName();
            name.classList.add('project-name');

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '✖';
            deleteBtn.dataset.id = project.getId();
            deleteBtn.classList.add('delete-project-btn');

            item.append(name, deleteBtn);
            projectsContainer.appendChild(item);
        });
    };

    const highlightCurrentProject = (id) => {
        const allItems = document.querySelectorAll('.project-item');
        allItems.forEach(item => {
            item.classList.toggle('current-project', item.dataset.id === id);
        });
    };

    projectsContainer.addEventListener('click', (e) => {
        const target = e.target;
        const projectItem = target.closest('.project-item');
        if (!projectItem) return;

        const id = projectItem.dataset.id;

        if (target.classList.contains('delete-project-btn')) {
            AppManager.deleteProject(id);
            renderProjects(AppManager.getProjectList());
            highlightCurrentProject(AppManager.getCurrent()?.getId());
            Storage.save(AppManager.getProjectList(), AppManager.getCurrent()?.getId());
        } else {
            AppManager.setCurrentProject(id);
            highlightCurrentProject(id);
            Storage.save(AppManager.getProjectList(), AppManager.getCurrent()?.getId());
        }
    });

    const renderTodoCard = (todo) => {
        let viewModeOn = true;

        const existingModal = document.getElementById('todo-card-modal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'todo-card-modal';
        modal.classList.add('todo-card-modal');

        const content = document.createElement('div');
        content.classList.add('todo-card-content');

        const title = document.createElement('h2');
        const description = document.createElement('p');
        const dueDate = document.createElement('p');
        const priority = document.createElement('p');
        const notesContainer = document.createElement('div');
        notesContainer.classList.add('notes-container');
        const checklist = document.createElement('ul');

        const titleInput = document.createElement('input');
        const descriptionInput = document.createElement('textarea');
        const dueDateInput = document.createElement('input');
        const priorityInput = document.createElement('select');

        let currentNoteIndex = 0;

        ['low', 'medium', 'high'].forEach(level => {
            const option = document.createElement('option');
            option.value = level;
            option.textContent = level.charAt(0).toUpperCase() + level.slice(1);
            if (level === todo.getPriority()) option.selected = true;
            priorityInput.appendChild(option);
        });

        dueDateInput.type = 'date';

        const renderNotes = () => {
            clearContainer(notesContainer);

            const notes = todo.getNotes();
            if (notes.length > 0) {
                const noteDisplay = document.createElement('p');
                noteDisplay.textContent = `Note: ${notes[currentNoteIndex]}`;
                notesContainer.appendChild(noteDisplay);

                if (notes.length > 1) {
                    const navButtons = document.createElement('div');
                    navButtons.classList.add('note-navigation-buttons');

                    const prevNoteBtn = document.createElement('button');
                    prevNoteBtn.textContent = '◀';
                    prevNoteBtn.addEventListener('click', () => {
                        currentNoteIndex = (currentNoteIndex - 1 + notes.length) % notes.length;
                        renderNotes();
                    });

                    const nextNoteBtn = document.createElement('button');
                    nextNoteBtn.textContent = '▶';
                    nextNoteBtn.addEventListener('click', () => {
                        currentNoteIndex = (currentNoteIndex + 1) % notes.length;
                        renderNotes();
                    });

                    navButtons.append(prevNoteBtn, nextNoteBtn);
                    notesContainer.appendChild(navButtons);
                }
            } else {
                const noNotesMessage = document.createElement('p');
                noNotesMessage.textContent = 'No notes for this todo.';
                notesContainer.appendChild(noNotesMessage);
            }
        };

        const renderViewMode = () => {
            title.textContent = `Title: ${todo.getTitle()}`;
            description.textContent = `Description: ${todo.getDescription()}`;
            dueDate.textContent = `Due: ${todo.getDueDate()}`;
            priority.textContent = `Priority: ${todo.getPriority()}`;

            renderNotes();

            checklist.innerHTML = '';
            todo.getChecklist().forEach((item, index) => {
                const li = document.createElement('li');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = item.status;

                checkbox.addEventListener('change', () => {
                    todo.toggleCheckListItem(index);
                    renderViewMode();
                    Storage.save(AppManager.getProjectList(), AppManager.getCurrent()?.getId());
                });

                const textSpan = document.createElement('span');
                textSpan.textContent = item.text;

                li.append(checkbox, textSpan);
                checklist.appendChild(li);
            });

            content.replaceChildren(title, description, dueDate, priority, notesContainer, checklist, buttons);
        };

        const renderEditMode = () => {
            titleInput.value = todo.getTitle();
            descriptionInput.value = todo.getDescription();
            dueDateInput.value = todo.getDueDate();

            content.replaceChildren(
                labelWrap('Title', titleInput),
                labelWrap('Description', descriptionInput),
                labelWrap('Due Date', dueDateInput),
                labelWrap('Priority', priorityInput),
                buttons
            );
        };

        const labelWrap = (labelText, inputEl) => {
            const label = document.createElement('label');
            label.textContent = labelText;
            const div = document.createElement('div');
            div.append(label, inputEl);
            return div;
        };

        const buttons = document.createElement('div');
        buttons.id = 'todo-card-buttons';

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.id = 'todo-card-btn-edit';

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.id = 'todo-card-btn-save';
        saveBtn.classList.add('hidden');

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.id = 'todo-card-btn-close';

        editBtn.addEventListener('click', () => {
            viewModeOn = false;
            editBtn.classList.add('hidden');
            saveBtn.classList.remove('hidden');
            renderEditMode();
        });

        saveBtn.addEventListener('click', () => {
            todo.setTitle(titleInput.value.trim());
            todo.setDescription(descriptionInput.value.trim());
            todo.setDueDate(dueDateInput.value);
            todo.setPriority(priorityInput.value);

            viewModeOn = true;
            editBtn.classList.remove('hidden');
            saveBtn.classList.add('hidden');
            renderViewMode();
            renderTodos(AppManager.getTodos());
            Storage.save(AppManager.getProjectList(), AppManager.getCurrent()?.getId());
        });

        closeBtn.addEventListener('click', () => {
            modal.remove();
        });

        buttons.append(editBtn, saveBtn, closeBtn);
        renderViewMode();

        modal.appendChild(content);
        document.body.appendChild(modal);
    };

    btnAddProject.addEventListener('click', () => openModal(projectModal));
    btnAddTodo.addEventListener('click', () => openModal(todoModal));

    projectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const projectName = projectForm['project-name'].value.trim();
        if (projectName) {
            AppManager.addProject(projectName);
            renderProjects(AppManager.getProjectList());
            highlightCurrentProject(AppManager.getCurrent().getId());
            Storage.save(AppManager.getProjectList(), AppManager.getCurrent().getId());
            closeModal(projectModal);
        }
    });

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = todoForm['todo-title'].value.trim();
        const description = todoForm['todo-description'].value.trim();
        const dueDate = todoForm['todo-due'].value;
        const priority = todoForm['todo-priority'].value;

        const notes = Array.from(document.querySelectorAll('.todo-note-input'))
            .map(input => input.value.trim())
            .filter(value => value !== "");

        const checklist = Array.from(document.querySelectorAll('.checklist-item'))
            .map(item => {
                const text = item.querySelector('.checklist-text')?.value.trim();
                return text ? { text, status: false } : null;
            })
            .filter(value => value !== null);

        if (!title) return;

        TodoManager.addTodo(title, description, dueDate, priority, notes, checklist);
        renderTodos(AppManager.getTodos());
        Storage.save(AppManager.getProjectList(), AppManager.getCurrent()?.getId());
        closeModal(todoModal);
    });

    document.getElementById('add-note-btn').addEventListener('click', () => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('note-item');

        const input = document.createElement('input');
        input.type = 'text';
        input.classList.add('todo-note-input');
        input.placeholder = 'Note...';

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.textContent = '✖';
        removeBtn.classList.add('remove-note-btn');
        removeBtn.addEventListener('click', () => wrapper.remove());

        wrapper.append(input, removeBtn);
        notesContainer.appendChild(wrapper);
    });

    document.getElementById('add-check-item-btn').addEventListener('click', () => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('checklist-item');

        const input = document.createElement('input');
        input.type = 'text';
        input.classList.add('checklist-text');
        input.placeholder = 'Checklist item...';

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.textContent = '✖';
        removeBtn.classList.add('remove-checklist-btn');
        removeBtn.addEventListener('click', () => wrapper.remove());

        wrapper.append(input, removeBtn);
        checklistContainer.appendChild(wrapper);
    });

    setupModalListeners();

    return {
        clearContainer,
        renderProjects,
        renderTodos,
        highlightCurrentProject,
        openModal,
        closeModal,
    };
})();

export { UI };