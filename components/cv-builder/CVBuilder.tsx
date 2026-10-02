'use client';

import React from 'react';
import {
  Briefcase,
  GraduationCap,
  Sparkles,
  Download,
  Plus,
  Trash2,
  Printer,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Award,
} from 'lucide-react';
import { CVData } from '@/types/nova';

export function CVBuilder() {
  const [cv, setCv] = React.useState<CVData>({
    fullName: 'Alexander Vance',
    title: 'Lead Autonomous Systems & AI Architect',
    email: 'alex.vance@nova-ai.studio',
    phone: '+1 (555) 234-8901',
    location: 'San Francisco, CA',
    website: 'https://alexvance.ai',
    summary:
      'Principal AI Systems Engineer with 8+ years designing scalable generative models, autonomous coding agents, and distributed cloud microservices. Proven record leading high-performance engineering teams.',
    template: 'executive',
    photoUrl: 'https://picsum.photos/seed/executive-alex/200/200',
    experiences: [
      {
        id: 'exp-1',
        role: 'Chief AI Architect',
        company: 'Nova Intelligence Labs',
        period: '2023 - Present',
        description: 'Engineered real-time agent execution pipeline supporting tool orchestration, multi-model routing, and sub-100ms latency inference.',
      },
      {
        id: 'exp-2',
        role: 'Senior Fullstack Staff Engineer',
        company: 'Aether Systems Inc.',
        period: '2020 - 2023',
        description: 'Architected edge computing micro-frontends and real-time streaming architectures serving 4.5M monthly active users.',
      },
    ],
    education: [
      {
        id: 'edu-1',
        degree: 'M.S. in Computer Science (Artificial Intelligence)',
        school: 'Stanford University',
        year: '2018 - 2020',
      },
    ],
    skills: ['TypeScript', 'Next.js', 'Python', 'PyTorch', 'System Architecture', 'PostgreSQL', 'Docker', 'Distributed Systems'],
    languages: ['English (Native)', 'French (Fluent)', 'Japanese (Conversational)'],
    certifications: ['Google Cloud Certified Professional Cloud Architect', 'AWS Certified Solutions Architect'],
  });

  const handlePrint = () => {
    window.print();
  };

  const handleAddExperience = () => {
    setCv((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          id: `exp-${Date.now()}`,
          role: 'New Position',
          company: 'Company Name',
          period: '2024 - Present',
          description: 'Description of responsibilities and achievements.',
        },
      ],
    }));
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      {/* Top action toolbar */}
      <div className="h-12 border-b border-border bg-card px-4 flex items-center justify-between gap-4 shrink-0 print:hidden">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
            <Briefcase className="w-3.5 h-3.5" />
            <span>AI CV & Resume Studio</span>
          </div>
          <div className="flex items-center rounded-lg bg-secondary/80 p-0.5 text-xs">
            {(['executive', 'modern', 'minimal'] as const).map((tmpl) => (
              <button
                key={tmpl}
                onClick={() => setCv((prev) => ({ ...prev, template: tmpl }))}
                className={`px-2.5 py-1 rounded-md capitalize transition ${
                  cv.template === tmpl ? 'bg-card text-foreground font-semibold shadow-sm' : 'text-muted-foreground'
                }`}
              >
                {tmpl}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Export / Print PDF</span>
        </button>
      </div>

      {/* Main Split Body: Editor Left, Live Preview Right */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Form Column */}
        <div className="w-full lg:w-1/2 border-r border-border bg-background p-4 sm:p-6 overflow-y-auto space-y-6 print:hidden">
          <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Personal & Career Data
          </h2>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-muted-foreground uppercase mb-1">Full Name</label>
              <input
                type="text"
                value={cv.fullName}
                onChange={(e) => setCv({ ...cv, fullName: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-secondary border border-border text-foreground outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-muted-foreground uppercase mb-1">Professional Title</label>
              <input
                type="text"
                value={cv.title}
                onChange={(e) => setCv({ ...cv, title: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-secondary border border-border text-foreground outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-muted-foreground uppercase mb-1">Email</label>
              <input
                type="email"
                value={cv.email}
                onChange={(e) => setCv({ ...cv, email: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-secondary border border-border text-foreground outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-muted-foreground uppercase mb-1">Phone</label>
              <input
                type="text"
                value={cv.phone}
                onChange={(e) => setCv({ ...cv, phone: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-secondary border border-border text-foreground outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-muted-foreground uppercase mb-1">Executive Summary</label>
            <textarea
              value={cv.summary}
              onChange={(e) => setCv({ ...cv, summary: e.target.value })}
              rows={3}
              className="w-full p-2.5 text-xs rounded-lg bg-secondary border border-border text-foreground outline-none resize-none"
            />
          </div>

          {/* Experience Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-muted-foreground">Work Experience</span>
              <button
                onClick={handleAddExperience}
                className="px-2 py-1 rounded bg-secondary hover:bg-muted text-xs text-indigo-400 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add Position
              </button>
            </div>

            {cv.experiences.map((exp, idx) => (
              <div key={exp.id} className="p-3 rounded-xl bg-card border border-border space-y-2">
                <div className="grid sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={exp.role}
                    onChange={(e) => {
                      const updated = [...cv.experiences];
                      updated[idx].role = e.target.value;
                      setCv({ ...cv, experiences: updated });
                    }}
                    placeholder="Role"
                    className="px-2 py-1 text-xs rounded bg-secondary border border-border"
                  />
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => {
                      const updated = [...cv.experiences];
                      updated[idx].company = e.target.value;
                      setCv({ ...cv, experiences: updated });
                    }}
                    placeholder="Company"
                    className="px-2 py-1 text-xs rounded bg-secondary border border-border"
                  />
                  <input
                    type="text"
                    value={exp.period}
                    onChange={(e) => {
                      const updated = [...cv.experiences];
                      updated[idx].period = e.target.value;
                      setCv({ ...cv, experiences: updated });
                    }}
                    placeholder="Period"
                    className="px-2 py-1 text-xs rounded bg-secondary border border-border"
                  />
                </div>
                <textarea
                  value={exp.description}
                  onChange={(e) => {
                    const updated = [...cv.experiences];
                    updated[idx].description = e.target.value;
                    setCv({ ...cv, experiences: updated });
                  }}
                  rows={2}
                  className="w-full p-2 text-xs rounded bg-secondary border border-border resize-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Live Resume Sheet Preview Column */}
        <div className="flex-1 bg-stone-900/70 p-4 sm:p-8 overflow-y-auto flex justify-center">
          <div className="w-full max-w-2xl bg-white text-stone-900 rounded-xl shadow-2xl p-8 sm:p-12 print:p-0 print:shadow-none print:w-full print:max-w-none min-h-[800px] flex flex-col justify-between font-sans">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between border-b-2 border-stone-800 pb-6 mb-6">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 uppercase">
                    {cv.fullName}
                  </h1>
                  <p className="text-sm font-semibold text-indigo-700 tracking-wide mt-1 uppercase font-mono">
                    {cv.title}
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs text-stone-600 mt-3 font-mono">
                    <span>{cv.email}</span>
                    <span>•</span>
                    <span>{cv.phone}</span>
                    <span>•</span>
                    <span>{cv.location}</span>
                  </div>
                </div>

                {cv.photoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cv.photoUrl}
                    alt={cv.fullName}
                    className="w-20 h-20 rounded-xl object-cover border border-stone-300 shadow-sm"
                  />
                )}
              </div>

              {/* Summary */}
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 font-mono mb-2">
                  Executive Summary
                </h3>
                <p className="text-xs text-stone-700 leading-relaxed">{cv.summary}</p>
              </div>

              {/* Experience */}
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 font-mono mb-3">
                  Professional Experience
                </h3>
                <div className="space-y-4">
                  {cv.experiences.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-sm text-stone-900">{exp.role}</span>
                        <span className="text-xs font-mono text-stone-500">{exp.period}</span>
                      </div>
                      <div className="text-xs font-semibold text-indigo-700 mb-1">{exp.company}</div>
                      <p className="text-xs text-stone-700 leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 font-mono mb-2">
                  Education & Credentials
                </h3>
                {cv.education.map((edu) => (
                  <div key={edu.id} className="flex justify-between text-xs">
                    <span className="font-semibold text-stone-900">{edu.degree} — {edu.school}</span>
                    <span className="text-stone-500 font-mono">{edu.year}</span>
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 font-mono mb-2">
                  Core Competencies
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {cv.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded bg-stone-100 text-stone-800 text-[10px] font-mono border border-stone-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-200 text-center text-[10px] text-stone-400 font-mono print:hidden">
              Generated via NOVA AI Studio Universal Architecture
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
