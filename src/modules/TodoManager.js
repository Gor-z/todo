import { ProjectManager } from './ProjectManager';
import { Todo } from './Todo';

const TodoManager = (() => {
    const _getCurrentProject = () => ProjectManager.getCurrentProject();

    const addTodo = (
        title,
        description,
        dueDate,
        priority,
        initialNotes = [],
        initialChecklist = []
    ) => {
        const _currentProject = _getCurrentProject();
        if (!_currentProject) return;

        const _newTodo = Todo(
            title,
            description,
            dueDate,
            priority,
            initialNotes,
            initialChecklist
        );
        _currentProject.addTodo(_newTodo);
    };

    const getTodos = () => {
        const _currentProject = _getCurrentProject();
        return _currentProject ? _currentProject.getList() : [];
    };

    const getTodo = (id) => {
        const _currentProject = _getCurrentProject();
        return _currentProject ? _currentProject.getTodo(id) : null;
    };

    const deleteTodo = (id) => {
        const _currentProject = _getCurrentProject();
        if (!_currentProject) return;
        _currentProject.deleteTodo(id);
    };

    const clearTodos = () => {
        const _currentProject = _getCurrentProject();
        if (!_currentProject) return;
        _currentProject.getList().splice(0);
    };

    return {
        addTodo,
        getTodos,
        getTodo,
        deleteTodo,
        clearTodos,
    };
})();

export { TodoManager };