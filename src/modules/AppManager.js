import { TodoManager } from "./TodoManager";
import { ProjectManager } from "./ProjectManager";
import { UI } from "./UI";
import { Storage } from "./Storage";
const AppManager = (() => {

    const initialize = () => {
        const data = Storage.load();
        if (data) {
            ProjectManager.loadProjectsFromData(data, data.currentProjectId);
        } else {
            ProjectManager.addProject('Default');
            const defaultId = ProjectManager.getProjectList()[0].getId();
            ProjectManager.setCurrentProject(defaultId);
        }

        UI.renderProjects(ProjectManager.getProjectList());
        UI.highlightCurrentProject(ProjectManager.getCurrentProject().getId());
        UI.renderTodos(TodoManager.getTodos());
    };

    const addProject = (name) => {
        ProjectManager.addProject(name);
        const projects = getProjectList();
        const lastProject = projects[projects.length - 1];
        ProjectManager.setCurrentProject(lastProject.getId());
        UI.renderProjects(getProjectList())
        UI.highlightCurrentProject(getCurrent().getId());
        UI.renderTodos(getTodos())
        Storage.save(getProjectList(), getCurrent().getId());
    }

    const deleteProject = (id) => {
        ProjectManager.deleteProject(id)
        Storage.save(getProjectList(), getCurrent().getId());
    }

    const setCurrentProject = (id) => {
        ProjectManager.setCurrentProject(id)
        UI.highlightCurrentProject(id)
        UI.renderTodos(getTodos())
        Storage.save(getProjectList(), getCurrent().getId());
    }

    const getCurrent = () => ProjectManager.getCurrentProject()
    const getProjectList = () => ProjectManager.getProjectList()
    const getTodos = () => TodoManager.getTodos()

    return { initialize, addProject, deleteProject, setCurrentProject, getCurrent, getProjectList, getTodos }
})()


export { AppManager }