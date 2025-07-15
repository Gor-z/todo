import { Project } from "./Project";
import { Todo } from "./Todo";

const ProjectManager = (() => {
    let _projectList = [];
    let _currentProject = null;

    const addProject = (name) => {
        const newProject = Project(name);
        _projectList.push(newProject);
        if (!_currentProject) {
            _currentProject = newProject;
        }
    };

    const deleteProject = (id) => {
        const index = _projectList.findIndex(project => project.getId() === id);
        _projectList.splice(index, 1);
        if (_currentProject && _currentProject.getId() === id) {
            _currentProject = _projectList.length > 0 ? _projectList[0] : null;
        }
    };

    const getProject = (id) => {
        return _projectList.find(project => project.getId() === id) || null;
    };

    const setCurrentProject = (id) => {
        const project = getProject(id);
        if (project) _currentProject = project;
    };

    const getCurrentProject = () => _currentProject;

    const getProjectList = () => [..._projectList];

    const changeProjectName = (id, name) => {
        const project = getProject(id);
        if (project) {
            project.setName(name);
        }
    };

    const loadProjectsFromData = (data, currentId) => {
        _projectList = data.projects.map(projData => {
            const project = Project(projData.name);
            project.getList().splice(0, project.getList().length);

            projData.todos.forEach(todoData => {
                const todo = Todo(
                    todoData.title,
                    todoData.description,
                    todoData.dueDate,
                    todoData.priority,
                    todoData.notes,
                    todoData.checklist
                );

                todo.getId = () => todoData.id;
                todo.setStatus(todoData.status);
                project.addTodo(todo);
            });


            project.getId = () => projData.id;
            return project;
        });

        _currentProject = _projectList.find(p => p.getId() === currentId) || _projectList[0] || null;
    };

    return {
        addProject,
        deleteProject,
        getProject,
        setCurrentProject,
        getCurrentProject,
        getProjectList,
        changeProjectName,
        loadProjectsFromData
    };
})();

export { ProjectManager };