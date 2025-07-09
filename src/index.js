import "./styles.css";
import { ProjectManager } from "./modules/ProjectManager";

ProjectManager.addProject('test')
console.log(ProjectManager.getProjectList());
