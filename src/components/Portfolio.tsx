import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import {
  Mail,
  Github,
  Linkedin,
  ExternalLink,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  Code2,
  Award,
  Presentation
} from 'lucide-react';

export function Portfolio() {
  // 포트폴리오 데이터 (나중에 JSON이나 마크다운으로 분리 가능)
  const profile = {
    name: 'Geon Lee',
    title: 'Full Stack Developer',
    bio: '해결하고자 하는 문제의 가설을 정의하고, 검증하는 것을 좋아합니다.',
    location: 'Seoul, South Korea',
    email: 'leegeondev@gmail.com',
    github: 'https://github.com/KrongDev',
    linkedin: 'https://www.linkedin.com/in/건-이-b459292a0',
    avatar: 'https://github.com/KrongDev.png',
  };

  const skills = [
    {
      category: 'Language',
      items: ['Java', 'C', 'C#', 'Typescript', 'Javascript', 'Python'],
    },
    {
      category: 'Frontend',
      items: ['React', 'Next.js', 'Vite', 'Tailwind CSS'],
    },
    {
      category: 'Backend',
      items: ['Spring', 'Spring Boot', 'Spring JPA', 'Node.js', 'FastAPI'],
    },
    {
      category: 'Database',
      items: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis'],
    },
    {
      category: 'DevOps',
      items: ['Kubernetes', 'Docker', 'AWS', 'GitHub Actions', 'Nginx'],
    },
    {
      category: 'Tools',
      items: ['Git', 'VS Code', 'Intellij', 'Postman', 'DataDog', 'Figma'],
    },
    {
      category: 'AI',
      items: ['GPT', 'Gemini', 'Cursor', 'Claude'],
    },
  ];

  const experiences = [
    {
      company: '투비더원',
      position: 'Full Stack Developer',
      period: '2025.04 - 2025.08',
      description: '웹 애플리케이션 개발 및 아키텍처 설계를 담당하고, 팀리딩을 담당하였습니다.',
      achievements: [
      ],
    },
    {
      company: 'Nextree',
      position: 'Full Stack Developer',
      period: '2021.09 - 2024.10',
      description: '풀스택 개발자로써 다양한 도메인을 가진 프로젝트를 경험하였습니다.',
      achievements: [
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
      title: 'ShushPlace(Qurious)',
      description: 'Amazon Q Developer 해커톤 참여 프로젝트(대회 종료 후 aws resource반환으로 인해 Sample 서비스를 링크합니다.)',
      tags: ['React', 'TypeScript', 'Vite', 'AWS', 'terraform', 'S3', 'DynamoDB', 'Amazon Lambda', 'Amazon Bedrock'],
      link: 'https://spot-map-swart.vercel.app/',
      github: 'https://github.com/qurious-aws-hackathon/team22-aws-hackathon',
      presentation: 'https://docs.google.com/presentation/d/1hVFkY6ZVkvF0UXU3gCZzJPbAq6BWlGeswUbgSlLULLM/edit?slide=id.p1#slide=id.p1',
    },
    {
      title: 'Asyncsite',
      description: '스터디를 모집하거나 참여하고 싶은 개발자들을 위한 플랫폼',
      tags: ['React', 'TypeScript', 'Vite', 'Java', 'Spring Boot', 'Spring Cloud', 'Mysql', 'Kafka'],
      link: 'https://asyncsite.com/',
    }
  ];

  const education = [
    {
      school: '대구공업대학교',
      degree: '항공정비 전문학사',
      period: '2016.03 - 2018.02',
      description: '항공정비 전공, GPA 3.65/4.5',
    },
  ];

  const certifications = [
    { name: '항해플러스 백엔드 5기', from: '항해99', year: '2024', month: '8' },
    { name: 'Java(Basic) Certification', from: 'HackerRank', year: '2024', month: '5'},
    { name: 'SQL(Intermediate) Certification', from: 'HackerRank', year: '2024', month: '5'},
    { name: 'SQL(Basic) Certification', from: 'HackerRank', year: '2024', month: '5'},
  ];

  return (
    <div className="space-y-16 pb-16">
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
        <div className="flex items-center gap-2 mb-8">
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
        <div className="flex items-center gap-2 mb-8">
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
                      <span className="text-primary">•</span>
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
        <div className="flex items-center gap-2 mb-8">
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
                    {project?.github && (
                        <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Github className="w-5 h-5" />
                        </a>
                    )}
                    {project?.presentation && (
                        <a
                            href={project.presentation}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Presentation className="w-5 h-5" />
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
          <div className="flex items-center gap-2 mb-8">
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
        <div style={{ marginTop: "50px" }}>
          <div className="flex items-center gap-2 mb-8">
            <Award className="w-6 h-6 text-primary" />
            <h2>Certifications</h2>
          </div>
          <Card>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                {certifications.map((cert, index) => (
                  <li key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span>{cert.name} - {cert.from}</span>
                    <Badge variant="secondary">{cert.year}/{cert.month}</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

