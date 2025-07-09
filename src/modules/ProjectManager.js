import { Project } from "./Project";

const ProjectManager = (() => {
    let _projectList = [];
    let _currentProject = null;

    if (_projectList.length === 0) {
        const defaultProject = Project("Default");
        _projectList.push(defaultProject);
        _currentProject = defaultProject;
    }

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

    return {
        addProject,
        deleteProject,
        getProject,
        setCurrentProject,
        getCurrentProject,
        getProjectList,
        changeProjectName
    };
})();

export { ProjectManager };