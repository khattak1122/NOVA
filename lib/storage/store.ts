import { Project, ProjectFile, ProjectVersion, ChatSession, UserProfile, SystemHealthStatus } from '@/types/nova';
import { STARTER_PROJECTS } from '@/lib/templates/initial-projects';

const STORAGE_KEY_PROJECTS = 'nova_projects_v1';
const STORAGE_KEY_ACTIVE_PROJECT = 'nova_active_project_id_v1';
const STORAGE_KEY_CHATS = 'nova_chats_v1';
const STORAGE_KEY_USER = 'nova_user_profile_v1';
const STORAGE_KEY_THEME = 'nova_theme_v1';

export class NovaStorage {
  private static isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  public static getProjects(): Project[] {
    if (!this.isBrowser()) return STARTER_PROJECTS;
    try {
      const data = localStorage.getItem(STORAGE_KEY_PROJECTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(STARTER_PROJECTS));
        return STARTER_PROJECTS;
      }
      return JSON.parse(data);
    } catch {
      return STARTER_PROJECTS;
    }
  }

  public static saveProjects(projects: Project[]): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    } catch (err) {
      console.error('Failed to save projects to storage', err);
    }
  }

  public static getActiveProjectId(): string {
    if (!this.isBrowser()) return STARTER_PROJECTS[0].id;
    try {
      return localStorage.getItem(STORAGE_KEY_ACTIVE_PROJECT) || STARTER_PROJECTS[0].id;
    } catch {
      return STARTER_PROJECTS[0].id;
    }
  }

  public static setActiveProjectId(id: string): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_PROJECT, id);
    } catch (err) {
      console.error('Failed to set active project', err);
    }
  }

  public static getActiveProject(): Project {
    const projects = this.getProjects();
    const activeId = this.getActiveProjectId();
    return projects.find((p) => p.id === activeId) || projects[0] || STARTER_PROJECTS[0];
  }

  public static updateProject(updated: Project): void {
    const projects = this.getProjects();
    const index = projects.findIndex((p) => p.id === updated.id);
    if (index >= 0) {
      projects[index] = { ...updated, updatedAt: Date.now() };
    } else {
      projects.push(updated);
    }
    this.saveProjects(projects);
  }

  public static createVersionSnapshot(projectId: string, description: string): ProjectVersion | null {
    const projects = this.getProjects();
    const project = projects.find((p) => p.id === projectId);
    if (!project) return null;

    const newVersionNumber = (project.versions?.length || 0) + 1;
    const version: ProjectVersion = {
      id: `v${newVersionNumber}-${Date.now()}`,
      versionNumber: newVersionNumber,
      timestamp: Date.now(),
      description,
      files: JSON.parse(JSON.stringify(project.files)),
    };

    if (!project.versions) project.versions = [];
    project.versions.unshift(version);
    this.updateProject(project);
    return version;
  }

  public static rollbackToVersion(projectId: string, versionId: string): boolean {
    const projects = this.getProjects();
    const project = projects.find((p) => p.id === projectId);
    if (!project || !project.versions) return false;

    const targetVersion = project.versions.find((v) => v.id === versionId);
    if (!targetVersion) return false;

    // Save current as a safety snapshot before rolling back
    this.createVersionSnapshot(projectId, `Pre-rollback safety snapshot before restoring v${targetVersion.versionNumber}`);

    project.files = JSON.parse(JSON.stringify(targetVersion.files));
    project.updatedAt = Date.now();
    this.updateProject(project);
    return true;
  }

  public static getChatSessions(): ChatSession[] {
    if (!this.isBrowser()) return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY_CHATS);
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  public static saveChatSessions(chats: ChatSession[]): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEY_CHATS, JSON.stringify(chats));
    } catch (err) {
      console.error('Failed to save chats', err);
    }
  }

  public static getUserProfile(): UserProfile {
    if (!this.isBrowser()) {
      return {
        id: 'usr-admin-1',
        name: 'Chief AI Architect',
        email: 'admin@nova-ai.studio',
        role: 'admin',
      };
    }
    try {
      const data = localStorage.getItem(STORAGE_KEY_USER);
      if (!data) {
        const defaultProfile: UserProfile = {
          id: 'usr-admin-1',
          name: 'Chief AI Architect',
          email: 'admin@nova-ai.studio',
          role: 'admin',
        };
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(defaultProfile));
        return defaultProfile;
      }
      return JSON.parse(data);
    } catch {
      return {
        id: 'usr-admin-1',
        name: 'Chief AI Architect',
        email: 'admin@nova-ai.studio',
        role: 'admin',
      };
    }
  }

  public static updateUserProfile(profile: UserProfile): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(profile));
    } catch (err) {
      console.error('Failed to update profile', err);
    }
  }

  public static getTheme(): 'dark' | 'light' {
    if (!this.isBrowser()) return 'dark';
    return (localStorage.getItem(STORAGE_KEY_THEME) as 'dark' | 'light') || 'dark';
  }

  public static setTheme(theme: 'dark' | 'light'): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  }
}
