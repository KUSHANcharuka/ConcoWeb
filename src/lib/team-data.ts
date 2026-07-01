export interface ExperienceItem {
  role: string
  company: string
  duration: string
  location: string
  description: string
}

export interface EducationItem {
  school: string;
  degree: string;
  duration: string;
}

export interface Leader {
  name: string
  role: string
  bio: string
  image: string
  linkedin: string
  headline: string
  location: string
  connections: string
  bannerGradient: string
  experience: ExperienceItem[]
  education: EducationItem[]
  skills: string[]
}

export const leaders: Leader[] = [
  {
    name: "Charu Dev",
    role: "Founder & CEO",
    bio: "Ex-IT leader for multinational contractors. Dedicated to bridging the gap between site workflows and office finance.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    linkedin: "https://www.linkedin.com/in/charudev",
    headline: "Founder & CEO at Concolabs | Ex-IT Contractor Systems Lead | Forbes 30 Under 30",
    location: "San Francisco, CA",
    connections: "500+ connections",
    bannerGradient: "linear-gradient(135deg, #1e3a8a 0%, #312e81 50%, #0f172a 100%)",
    experience: [
      {
        role: "Founder & CEO",
        company: "Concolabs",
        duration: "2024 - Present • 2 yrs 6 mos",
        location: "San Francisco, CA",
        description: "Leading the next-generation operations and finance platform for builders and heavy construction contractors. Grew from 0 to over $5B in project volume managed."
      },
      {
        role: "Head of IT & Digital Workflows",
        company: "Balfour Beatty plc",
        duration: "2018 - 2023 • 5 yrs",
        location: "London, UK",
        description: "Spearheaded digital transformation initiatives across global infrastructure projects. Saved over 40,000 engineering hours by eliminating disjointed legacy software."
      },
      {
        role: "Senior Project Systems Manager",
        company: "Skanska",
        duration: "2014 - 2018 • 4 yrs",
        location: "New York, NY",
        description: "Implemented enterprise project controls, ERP integrations, and field-to-office sync pipelines for multi-billion dollar commercial developments."
      }
    ],
    education: [
      {
        school: "Stanford University Graduate School of Business",
        degree: "Executive Program in Leadership",
        duration: "2023"
      },
      {
        school: "Imperial College London",
        degree: "B.Sc. in Civil Engineering & Computing",
        duration: "2010 - 2014"
      }
    ],
    skills: ["Construction Tech", "Digital Transformation", "ERP Integrations", "Project Controls", "SaaS Leadership", "Operations", "Venture Capital"]
  },
  {
    name: "Elena Rostova",
    role: "President & CPO",
    bio: "Former product lead at Procore. Leads the vision for Concolabs' unified construction workflow platform.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
    linkedin: "https://www.linkedin.com/in/elenarostova",
    headline: "President & Chief Product Officer at Concolabs | Ex-Procore Product Lead | ConTech Architect",
    location: "Austin, Texas Area",
    connections: "500+ connections",
    bannerGradient: "linear-gradient(135deg, #065f46 0%, #064e3b 50%, #0f172a 100%)",
    experience: [
      {
        role: "President & CPO",
        company: "Concolabs",
        duration: "2024 - Present • 2 yrs 6 mos",
        location: "San Francisco, CA",
        description: "Driving the global product design, management, and long-term roadmap. Architecting the industry's first fully-integrated construction spend engine."
      },
      {
        role: "Director of Product Management (Core Platform)",
        company: "Procore Technologies",
        duration: "2019 - 2023 • 4 yrs",
        location: "Austin, TX",
        description: "Led core system workflows, including RFIs, daily logs, and submittals, scaling active user metrics by 180% year-over-year."
      },
      {
        role: "Senior Product Manager",
        company: "Autodesk",
        duration: "2015 - 2019 • 4 yrs",
        location: "San Francisco, CA",
        description: "Managed features within the BIM 360 and Autodesk Construction Cloud ecosystems, focusing on field productivity and mobile apps."
      }
    ],
    education: [
      {
        school: "University of California, Berkeley",
        degree: "M.S. in Information Management & Systems",
        duration: "2013 - 2015"
      },
      {
        school: "Moscow State University",
        degree: "B.S. in Computer Science",
        duration: "2009 - 2013"
      }
    ],
    skills: ["Product Strategy", "ConTech Product Design", "Agile Roadmap", "SaaS Architecture", "User Experience", "Mobile Apps", "Field Workflows"]
  },
  {
    name: "Marcus Vance",
    role: "Chief Technology Officer",
    bio: "Ex-Autodesk Systems Architect. Designer of our real-time database sync and AI budget prediction engines.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    linkedin: "https://www.linkedin.com/in/marcusvance",
    headline: "Chief Technology Officer at Concolabs | Former Autodesk Systems Architect | Distributed Database Systems",
    location: "London, England, United Kingdom",
    connections: "500+ connections",
    bannerGradient: "linear-gradient(135deg, #6b21a8 0%, #4c1d95 50%, #0f172a 100%)",
    experience: [
      {
        role: "Chief Technology Officer",
        company: "Concolabs",
        duration: "2024 - Present • 2 yrs 6 mos",
        location: "London, UK",
        description: "Leading the technology stack. Built the real-time offline sync engines and the proprietary AI Cost Control prediction engine."
      },
      {
        role: "Principal Systems Architect",
        company: "Autodesk",
        duration: "2018 - 2023 • 5 yrs",
        location: "London, UK",
        description: "Designed core syncing APIs for Revit Cloud Worksharing and cloud coordination pipelines. Focused on performance at petabyte scale."
      },
      {
        role: "Technical Lead (Distributed Systems)",
        company: "MongoDB",
        duration: "2014 - 2018 • 4 yrs",
        location: "Dublin, Ireland",
        description: "Contributed to database engine replication, clustering, and storage virtualization layers for MongoDB Enterprise Server."
      }
    ],
    education: [
      {
        school: "Massachusetts Institute of Technology",
        degree: "M.S. in Electrical Engineering & Computer Science",
        duration: "2012 - 2014"
      },
      {
        school: "University of Cambridge",
        degree: "B.A. in Computer Science (First Class Hons)",
        duration: "2009 - 2012"
      }
    ],
    skills: ["Distributed Systems", "AI / Predictive Budgeting", "Offline-first Sync", "Database Architecture", "React & Next.js", "C++ / Rust", "Cloud Infrastructures"]
  },
  {
    name: "Sarah Jenkins",
    role: "VP of Customer Experience",
    bio: "Former Salesforce CX Director. Dedicated to ensuring construction firms achieve maximum ROI and zero downtime.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    linkedin: "https://www.linkedin.com/in/sarahjenkins",
    headline: "VP of Customer Experience at Concolabs | Ex-Salesforce Director | Construction Ops Customer Success Specialist",
    location: "Chicago, IL",
    connections: "500+ connections",
    bannerGradient: "linear-gradient(135deg, #b45309 0%, #9f1239 50%, #0f172a 100%)",
    experience: [
      {
        role: "VP of Customer Experience",
        company: "Concolabs",
        duration: "2024 - Present • 2 yrs 6 mos",
        location: "Chicago, IL",
        description: "Building a world-class customer success, professional services, and training organization. Reached a 99.8% customer satisfaction score across all builders."
      },
      {
        role: "Director of Customer Success (Enterprise)",
        company: "Salesforce",
        duration: "2020 - 2023 • 3 yrs",
        location: "Chicago, IL",
        description: "Managed customer retention and expansion strategies for global industrial clients, representing $80M+ in annual contract value (ARR)."
      },
      {
        role: "Head of Professional Services",
        company: "PlanGrid (Acquired by Autodesk)",
        duration: "2016 - 2020 • 4 yrs",
        location: "San Francisco, CA",
        description: "Scaled professional services team and custom ERP/accounting integrations pipeline for top-tier general contractors."
      }
    ],
    education: [
      {
        school: "Northwestern University",
        degree: "M.S. in Communication & Enterprise Strategy",
        duration: "2013 - 2015"
      },
      {
        school: "University of Michigan",
        degree: "B.A. in Communications & Business",
        duration: "2009 - 2013"
      }
    ],
    skills: ["Customer Success", "Enterprise SaaS Adoption", "Change Management", "Onboarding Operations", "Strategic Partnerships", "Training & Enablement", "Key Account Management"]
  }
]
