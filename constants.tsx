
import React from 'react';
import { Project, User, UserRole } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'laravel-nexus',
    title: 'Enterprise Laravel SaaS',
    description: 'A powerful multi-tenant SaaS application built with Laravel, featuring robust RBAC and automated billing.',
    techStack: ['Laravel', 'PHP', 'PostgreSQL', 'Livewire', 'Tailwind'],
    liveUrl: 'https://example.com',
    demoUrl: 'https://github.com/example/laravel-enterprise',
    imageUrl: 'https://picsum.photos/seed/laravel/800/600',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'wp-expert',
    title: 'Custom WordPress Architecture',
    description: 'High-performance WordPress site with headless capabilities and optimized custom themes for maximum SEO.',
    techStack: ['WordPress', 'PHP', 'MySQL', 'JavaScript', 'Headless CMS'],
    liveUrl: 'https://example.com',
    demoUrl: 'https://github.com/example/wp-architecture',
    imageUrl: 'https://picsum.photos/seed/wordpress/800/600',
    createdAt: new Date().toISOString(),
  }
];

export const MOCK_ADMIN: User = {
  id: 'admin-001',
  name: 'Eman Haque',
  email: 'admin@devport.com',
  password: 'password',
  role: UserRole.ADMIN,
  createdAt: '2023-01-01T00:00:00Z',
  avatar: 'https://picsum.photos/seed/admin/200',
  bscMajor: 'Computer Science & Engineering',
  graduationYear: '2023'
};
