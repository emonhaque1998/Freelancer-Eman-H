
import React from 'react';
import { Project, User, UserRole } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Nexus',
    description: 'A full-featured online retail platform with secure payments and real-time inventory tracking.',
    techStack: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    liveUrl: 'https://example.com',
    demoUrl: 'https://github.com/example/ecommerce',
    imageUrl: 'https://picsum.photos/seed/shop/800/600',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'TaskFlow Pro',
    description: 'Productivity management tool featuring Kanban boards and team collaboration utilities.',
    techStack: ['TypeScript', 'Firebase', 'Tailwind', 'D3.js'],
    liveUrl: 'https://example.com',
    demoUrl: 'https://github.com/example/taskflow',
    imageUrl: 'https://picsum.photos/seed/task/800/600',
    createdAt: new Date().toISOString(),
  }
];

export const MOCK_ADMIN: User = {
  id: 'admin-001',
  name: 'John Developer',
  email: 'admin@devport.com',
  role: UserRole.ADMIN,
  createdAt: '2023-01-01T00:00:00Z',
  avatar: 'https://picsum.photos/seed/admin/200',
  bscMajor: 'Computer Science',
  graduationYear: '2023'
};
