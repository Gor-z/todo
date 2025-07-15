const Storage = (() => {
    const STORAGE_KEY = 'todoAppData';

    const save = (projectList, currentProjectId) => {
        const data = {
            projects: projectList.map(p => ({
                id: p.getId(),
                name: p.getName(),
                todos: p.getList().map(todo => ({
                    id: todo.getId(),
                    title: todo.getTitle(),
                    description: todo.getDescription(),
                    dueDate: todo.getDueDate(),
                    priority: todo.getPriority(),
                    status: todo.getStatus(),
                    notes: todo.getNotes(),
                    checklist: todo.getChecklist()
                }))
            })),
            currentProjectId,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    };

    const load = () => {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    };

    const clear = () => {
        localStorage.removeItem(STORAGE_KEY);
    };

    return { save, load, clear };
})();

export { Storage };