import { useQuery } from '@tanstack/react-query';
import { profileAPI, aboutAPI, skillsAPI, experienceAPI, educationAPI, projectsAPI, servicesAPI, testimonialsAPI, blogAPI, settingsAPI, editsAPI } from '../api';

export const useProfile = () =>
  useQuery({ queryKey: ['profile'], queryFn: () => profileAPI.get().then(r => r.data.data), staleTime: 5 * 60 * 1000 });

export const useAbout = () =>
  useQuery({ queryKey: ['about'], queryFn: () => aboutAPI.get().then(r => r.data.data), staleTime: 5 * 60 * 1000 });

export const useSkills = () =>
  useQuery({ queryKey: ['skills'], queryFn: () => skillsAPI.getAll().then(r => r.data.data), staleTime: 5 * 60 * 1000 });

export const useExperience = () =>
  useQuery({ queryKey: ['experience'], queryFn: () => experienceAPI.getAll().then(r => r.data.data), staleTime: 5 * 60 * 1000 });

export const useEducation = () =>
  useQuery({ queryKey: ['education'], queryFn: () => educationAPI.getAll().then(r => r.data.data), staleTime: 5 * 60 * 1000 });

export const useProjects = (params = {}) =>
  useQuery({ queryKey: ['projects', params], queryFn: () => projectsAPI.getAll(params).then(r => r.data), staleTime: 5 * 60 * 1000 });

export const useProjectBySlug = (slug) =>
  useQuery({ queryKey: ['project', slug], queryFn: () => projectsAPI.getBySlug(slug).then(r => r.data.data), enabled: !!slug });

export const useServices = () =>
  useQuery({ queryKey: ['services'], queryFn: () => servicesAPI.getAll().then(r => r.data.data), staleTime: 5 * 60 * 1000 });

export const useTestimonials = () =>
  useQuery({ queryKey: ['testimonials'], queryFn: () => testimonialsAPI.getAll().then(r => r.data.data), staleTime: 5 * 60 * 1000 });

export const useBlogs = (params = {}) =>
  useQuery({ queryKey: ['blogs', params], queryFn: () => blogAPI.getAll(params).then(r => r.data), staleTime: 5 * 60 * 1000 });

export const useBlogBySlug = (slug) =>
  useQuery({ queryKey: ['blog', slug], queryFn: () => blogAPI.getBySlug(slug).then(r => r.data.data), enabled: !!slug });

export const useSettings = () =>
  useQuery({ queryKey: ['settings'], queryFn: () => settingsAPI.get().then(r => r.data.data), staleTime: 10 * 60 * 1000 });

export const useDashboardStats = () =>
  useQuery({ queryKey: ['dashboard-stats'], queryFn: () => settingsAPI.getDashboardStats().then(r => r.data.data) });

export const useEdits = (params = {}) =>
  useQuery({
    queryKey: ['edits', params],
    queryFn: () => editsAPI.getAll(params).then(r => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

export const useAllEdits = () =>
  useQuery({
    queryKey: ['edits-admin'],
    queryFn: () => editsAPI.getAllAdmin().then(r => r.data.data),
  });