import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Project, ProjectDetails} from '../classes/project';
import {map} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private http: HttpClient) { }

  getAllProjects() {
    return this.http.get<Project[]>('/api/projects/all');
  }

  getProjectsCount() {
    return this.getAllProjects().pipe(map(projects => projects.length));
  }

  getAllProjectsWithDetails() {
    return this.http.get<ProjectDetails[]>('/api/projects/all/details');
  }

  getProjectById(id: number) {
    return this.http.get<Project>(`/api/projects/${id}`);
  }

  getProjectByIdWithDetails(id: number) {
    return this.http.get<ProjectDetails>(`/api/projects/${id}/details`);
  }

  createProject(project: Project) {
    return this.http.post<Project>('/api/projects/create', {
      name: project.name,
      description: project.description,
    });
  }

  updateProject(project: Project) {
    return this.http.put<Project>(`/api/projects/update`, {
      id: project.id,
      name: project.name,
      description: project.description,
    });
  }

  archiveProject(id: number) {
    return this.http.patch<Project>(`/api/projects/${id}/archive`, {});
  }
}
