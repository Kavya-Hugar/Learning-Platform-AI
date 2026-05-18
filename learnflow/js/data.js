// ===== COURSE DATA =====
const COURSES = [
  {
    id: 1,
    title: 'Complete JavaScript Mastery',
    cat: 'programming',
    emoji: '⚡',
    bg: '#1a1a2e',
    rating: 4.9,
    students: 3420,
    price: 49,
    hours: 18,
    level: 'Beginner',
    desc: 'Master JavaScript from fundamentals to advanced — ES6+, async/await, closures, and real production patterns.',
    learns: ['Modern ES6+ syntax', 'Async/await & Promises', 'DOM manipulation', 'Closures & prototypes', 'REST APIs', 'Node.js basics'],
    sections: [
      {
        id: 101,
        title: 'JS Fundamentals',
        vids: [
          { id: 1001, title: 'Introduction to JavaScript', dur: '8:42' },
          { id: 1002, title: 'Variables & Data Types', dur: '12:15' },
          { id: 1003, title: 'Functions & Scope', dur: '15:30' },
          { id: 1004, title: 'Arrays & Objects', dur: '18:20' }
        ]
      },
      {
        id: 102,
        title: 'ES6+ Features',
        vids: [
          { id: 1005, title: 'Arrow Functions & Destructuring', dur: '14:10' },
          { id: 1006, title: 'Spread, Rest & Template Literals', dur: '11:45' },
          { id: 1007, title: 'Classes & Modules', dur: '16:30' }
        ]
      },
      {
        id: 103,
        title: 'Async JavaScript',
        vids: [
          { id: 1008, title: 'Callbacks & Event Loop', dur: '20:15' },
          { id: 1009, title: 'Promises in Depth', dur: '17:40' },
          { id: 1010, title: 'Async/Await Mastery', dur: '22:00' }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'React & Next.js: Full Stack',
    cat: 'programming',
    emoji: '⚛️',
    bg: '#0a192f',
    rating: 4.8,
    students: 2810,
    price: 59,
    hours: 24,
    level: 'Intermediate',
    desc: 'Build production full-stack apps with React 18, Next.js 14 App Router, TypeScript, and Vercel deployment.',
    learns: ['React 18 features', 'Next.js App Router', 'Server Components', 'TypeScript', 'Authentication', 'Vercel deployment'],
    sections: [
      {
        id: 201,
        title: 'React Foundations',
        vids: [
          { id: 2001, title: 'React 18 Overview', dur: '10:20' },
          { id: 2002, title: 'Components & JSX', dur: '14:35' },
          { id: 2003, title: 'State & Effects', dur: '18:50' }
        ]
      },
      {
        id: 202,
        title: 'Next.js App Router',
        vids: [
          { id: 2004, title: 'File-based Routing', dur: '12:30' },
          { id: 2005, title: 'Server Components', dur: '16:45' },
          { id: 2006, title: 'Data Fetching Patterns', dur: '20:10' },
          { id: 2007, title: 'API Routes', dur: '15:25' }
        ]
      },
      {
        id: 203,
        title: 'Production & Deploy',
        vids: [
          { id: 2008, title: 'Auth with NextAuth', dur: '24:00' },
          { id: 2009, title: 'Database with Prisma', dur: '19:30' },
          { id: 2010, title: 'Deploy to Vercel', dur: '11:15' }
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'UI/UX Design Fundamentals',
    cat: 'design',
    emoji: '🎨',
    bg: '#1a0a2e',
    rating: 4.7,
    students: 1940,
    price: 39,
    hours: 12,
    level: 'Beginner',
    desc: 'Learn UI/UX design from wireframing to Figma prototyping, user research, and building beautiful interfaces.',
    learns: ['Design thinking', 'Typography & color', 'Figma from scratch', 'User research', 'Responsive design', 'Accessibility'],
    sections: [
      {
        id: 301,
        title: 'Design Foundations',
        vids: [
          { id: 3001, title: 'Design Thinking Overview', dur: '9:15' },
          { id: 3002, title: 'Typography Basics', dur: '13:40' },
          { id: 3003, title: 'Color Theory', dur: '15:20' }
        ]
      },
      {
        id: 302,
        title: 'Figma Mastery',
        vids: [
          { id: 3004, title: 'Figma Interface Tour', dur: '11:00' },
          { id: 3005, title: 'Components & Variants', dur: '18:30' },
          { id: 3006, title: 'Prototyping & Animations', dur: '16:45' }
        ]
      },
      {
        id: 303,
        title: 'Real Projects',
        vids: [
          { id: 3007, title: 'Mobile App Design', dur: '28:00' },
          { id: 3008, title: 'Design System', dur: '22:15' }
        ]
      }
    ]
  },
  {
    id: 4,
    title: 'Python for Data Science',
    cat: 'data',
    emoji: '🐍',
    bg: '#0a2e1a',
    rating: 4.9,
    students: 4120,
    price: 54,
    hours: 22,
    level: 'Beginner',
    desc: 'Python to machine learning: NumPy, Pandas, Matplotlib, Scikit-learn with real-world data projects.',
    learns: ['Python syntax & OOP', 'NumPy & Pandas', 'Data visualization', 'ML basics', 'Scikit-learn', 'Real datasets'],
    sections: [
      {
        id: 401,
        title: 'Python Essentials',
        vids: [
          { id: 4001, title: 'Python Setup & Syntax', dur: '10:30' },
          { id: 4002, title: 'Data Structures', dur: '16:20' },
          { id: 4003, title: 'Functions & Classes', dur: '19:45' }
        ]
      },
      {
        id: 402,
        title: 'Data Analysis',
        vids: [
          { id: 4004, title: 'NumPy Arrays', dur: '14:10' },
          { id: 4005, title: 'Pandas DataFrames', dur: '22:30' },
          { id: 4006, title: 'Data Cleaning', dur: '18:00' },
          { id: 4007, title: 'Matplotlib & Seaborn', dur: '20:45' }
        ]
      },
      {
        id: 403,
        title: 'Machine Learning',
        vids: [
          { id: 4008, title: 'ML Fundamentals', dur: '15:30' },
          { id: 4009, title: 'Scikit-learn Intro', dur: '24:00' },
          { id: 4010, title: 'Final Project', dur: '35:00' }
        ]
      }
    ]
  },
  {
    id: 5,
    title: 'Docker & Kubernetes',
    cat: 'devops',
    emoji: '🐳',
    bg: '#0a1a2e',
    rating: 4.8,
    students: 1560,
    price: 64,
    hours: 16,
    level: 'Intermediate',
    desc: 'Containerize with Docker, orchestrate with Kubernetes, build CI/CD pipelines and deploy to AWS EKS.',
    learns: ['Docker fundamentals', 'Container networking', 'Kubernetes clusters', 'Helm charts', 'CI/CD pipelines', 'AWS EKS'],
    sections: [
      {
        id: 501,
        title: 'Docker Basics',
        vids: [
          { id: 5001, title: 'Containers vs VMs', dur: '8:45' },
          { id: 5002, title: 'Dockerfile Mastery', dur: '15:20' },
          { id: 5003, title: 'Docker Compose', dur: '18:30' }
        ]
      },
      {
        id: 502,
        title: 'Kubernetes',
        vids: [
          { id: 5004, title: 'K8s Architecture', dur: '12:45' },
          { id: 5005, title: 'Pods & Deployments', dur: '20:10' },
          { id: 5006, title: 'Services & Ingress', dur: '16:30' },
          { id: 5007, title: 'Helm Charts', dur: '22:00' }
        ]
      }
    ]
  },
  {
    id: 6,
    title: 'Product Management 101',
    cat: 'business',
    emoji: '📊',
    bg: '#2e1a0a',
    rating: 4.6,
    students: 980,
    price: 44,
    hours: 10,
    level: 'Beginner',
    desc: 'Modern product management: roadmapping, user research, agile workflows, metrics and stakeholder communication.',
    learns: ['Product vision', 'User research', 'Roadmapping', 'Agile & Scrum', 'Metrics & KPIs', 'Stakeholder mgmt'],
    sections: [
      {
        id: 601,
        title: 'PM Foundations',
        vids: [
          { id: 6001, title: 'What is Product Management?', dur: '9:30' },
          { id: 6002, title: 'Product Lifecycle', dur: '13:45' },
          { id: 6003, title: 'User Research Methods', dur: '17:20' }
        ]
      },
      {
        id: 602,
        title: 'Strategy & Execution',
        vids: [
          { id: 6004, title: 'Writing PRDs', dur: '15:10' },
          { id: 6005, title: 'Agile Ceremonies', dur: '11:45' },
          { id: 6006, title: 'Metrics & OKRs', dur: '14:30' }
        ]
      }
    ]
  }
];
