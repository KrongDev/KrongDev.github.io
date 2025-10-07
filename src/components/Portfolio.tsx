import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Mail, Github, Linkedin, ExternalLink, Calendar, MapPin, Briefcase, GraduationCap, Code2, Award } from 'lucide-react';

export function Portfolio() {
  // 포트폴리오 데이터 (나중에 JSON이나 마크다운으로 분리 가능)
  const profile = {
    name: 'Geon Lee',
    title: 'Full Stack Developer',
    bio: '보다 넓은 시야를 가지고 싶은 개발자입니다. 문제 해결을 즐기고, 새로운 기술을 배우는 것을 좋아합니다.',
    location: 'Seoul, South Korea',
    email: 'your.email@example.com',
    github: 'https://github.com/KrongDev',
    linkedin: 'https://linkedin.com/in/yourprofile',
    avatar: 'https://github.com/KrongDev.png',
  };

  const skills = [
    {
      category: 'Frontend',
      items: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Vite'],
    },
    {
      category: 'Backend',
      items: ['Node.js', 'Express', 'Spring Boot', 'Python', 'FastAPI'],
    },
    {
      category: 'Database',
      items: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis'],
    },
    {
      category: 'DevOps',
      items: ['Docker', 'AWS', 'GitHub Actions', 'Nginx'],
    },
    {
      category: 'Tools',
      items: ['Git', 'VS Code', 'Postman', 'Figma'],
    },
  ];

  const experiences = [
    {
      company: 'Tech Company',
      position: 'Senior Full Stack Developer',
      period: '2023.01 - Present',
      description: '웹 애플리케이션 개발 및 아키텍처 설계를 담당하고 있습니다.',
      achievements: [
        '마이크로서비스 아키텍처 도입으로 시스템 안정성 30% 향상',
        'CI/CD 파이프라인 구축으로 배포 시간 50% 단축',
        '성능 최적화를 통해 페이지 로딩 속도 40% 개선',
      ],
    },
    {
      company: 'Startup Inc.',
      position: 'Full Stack Developer',
      period: '2021.03 - 2022.12',
      description: '스타트업에서 다양한 프로젝트를 경험하며 성장했습니다.',
      achievements: [
        'React 기반 관리자 페이지 개발',
        'RESTful API 설계 및 구현',
        '데이터베이스 최적화 및 쿼리 튜닝',
      ],
    },
  ];

  const projects = [
    {
      title: 'GitHub Pages Blog',
      description: 'React와 TypeScript로 구축한 정적 블로그. 마크다운 기반 포스팅과 태그/카테고리 검색 기능을 제공합니다.',
      tags: ['React', 'TypeScript', 'Vite', 'GitHub Pages'],
      link: 'https://krongdev.github.io',
      github: 'https://github.com/KrongDev/KrongDev.github.io',
    },
    {
      title: 'E-Commerce Platform',
      description: '풀스택 전자상거래 플랫폼. 결제 시스템, 재고 관리, 주문 추적 기능을 포함합니다.',
      tags: ['Next.js', 'Node.js', 'PostgreSQL', 'Redis', 'Stripe'],
      link: 'https://example.com',
      github: 'https://github.com/yourusername/project',
    },
    {
      title: 'Real-time Chat Application',
      description: 'WebSocket을 활용한 실시간 채팅 애플리케이션. 그룹 채팅, 파일 공유, 읽음 표시 기능을 지원합니다.',
      tags: ['React', 'Socket.io', 'Express', 'MongoDB'],
      link: 'https://example.com',
      github: 'https://github.com/yourusername/project',
    },
    {
      title: 'Task Management System',
      description: '팀 협업을 위한 태스크 관리 시스템. 칸반 보드, 타임라인 뷰, 알림 기능을 제공합니다.',
      tags: ['Vue.js', 'Spring Boot', 'MySQL', 'Docker'],
      link: 'https://example.com',
      github: 'https://github.com/yourusername/project',
    },
  ];

  const education = [
    {
      school: 'University Name',
      degree: 'Bachelor of Science in Computer Science',
      period: '2017.03 - 2021.02',
      description: '컴퓨터 공학 전공, GPA 3.8/4.0',
    },
  ];

  const certifications = [
    { name: 'AWS Certified Solutions Architect', year: '2023' },
    { name: 'Google Cloud Professional Developer', year: '2022' },
    { name: '정보처리기사', year: '2021' },
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg -z-10"></div>
        <div className="flex flex-col md:flex-row items-center gap-8 p-8 md:p-12">
          <Avatar className="w-32 h-32 ring-4 ring-primary/20">
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback className="text-2xl">GL</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center md:text-left">
            <h1 className="mb-2">{profile.name}</h1>
            <p className="text-xl text-primary mb-4">{profile.title}</p>
            <p className="text-muted-foreground mb-6 max-w-2xl">{profile.bio}</p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {profile.location}
              </div>
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                Email
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Code2 className="w-6 h-6 text-primary" />
          <h2>Skills</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skillGroup) => (
            <Card key={skillGroup.category}>
              <CardHeader>
                <CardTitle className="text-lg">{skillGroup.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Experience Section */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Briefcase className="w-6 h-6 text-primary" />
          <h2>Experience</h2>
        </div>
        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <Card key={index} className="hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <CardTitle>{exp.position}</CardTitle>
                    <CardDescription className="text-base mt-1">{exp.company}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {exp.period}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{exp.description}</p>
                <ul className="space-y-2">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-sm">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Projects Section */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Code2 className="w-6 h-6 text-primary" />
          <h2>Projects</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <Card key={index} className="hover:border-primary transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {project.title}
                  <div className="flex gap-2">
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Education & Certifications */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Education */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <GraduationCap className="w-6 h-6 text-primary" />
            <h2>Education</h2>
          </div>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{edu.degree}</CardTitle>
                  <CardDescription>{edu.school}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="w-4 h-4" />
                    {edu.period}
                  </div>
                  <p className="text-sm">{edu.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-6 h-6 text-primary" />
            <h2>Certifications</h2>
          </div>
          <Card>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                {certifications.map((cert, index) => (
                  <li key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span>{cert.name}</span>
                    <Badge variant="secondary">{cert.year}</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="pt-6 pb-6">
            <h3 className="mb-4">Let's Work Together</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              새로운 프로젝트나 협업 기회가 있으시다면 언제든지 연락주세요!
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <a href={`mailto:${profile.email}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Me
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={profile.github} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  View GitHub
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

