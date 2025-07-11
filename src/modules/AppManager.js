import { TodoManager } from "./TodoManager";
import { ProjectManager } from "./ProjectManager";
import { UI } from "./UI";
const AppManager = (() => {

    const initialize = () => {
        if (getProjectList().length === 0) {
            ProjectManager.addProject('Default')
            const defaultId = getProjectList()[0].getId();
            ProjectManager.setCurrentProject(defaultId);
        }
        UI.renderProjects(getProjectList());
        UI.highlightCurrentProject(getCurrent().getId());
        UI.renderTodos(getTodos())
    }

    const addProject = (name) => {
        ProjectManager.addProject(name);
        const projects = getProjectList();
        const lastProject = projects[projects.length - 1];
        ProjectManager.setCurrentProject(lastProject.getId());
        UI.renderProjects(getProjectList())
        UI.highlightCurrentProject(getCurrent().getId());
        UI.renderTodos(getTodos())
    }

    const deleteProject = (id) => {
        ProjectManager.deleteProject(id)
    }

    const setCurrentProject = (id) => {
        ProjectManager.setCurrentProject(id)
        UI.highlightCurrentProject(id)
        UI.renderTodos(getTodos())
    }

    const getCurrent = () => ProjectManager.getCurrentProject()
    const getProjectList = () => ProjectManager.getProjectList()
    const getTodos = () => TodoManager.getTodos()

    return { initialize, addProject, deleteProject, setCurrentProject, getCurrent, getProjectList, getTodos }
})()


export { AppManager }