import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPortfolio() {
  console.log('Seeding portfolio data with Al Afif Abdurrahman\'s information...');

  // Clear existing data
  await prisma.portfolioHero.deleteMany();
  await prisma.portfolioProject.deleteMany();
  await prisma.portfolioSkill.deleteMany();
  await prisma.portfolioEducation.deleteMany();
  await prisma.portfolioContact.deleteMany();
  await prisma.portfolioComment.deleteMany();

  // Hero Section
  const hero = await prisma.portfolioHero.create({
    data: {
      heading: 'AL AFIF ABDURRAHMAN',
      subheading: 'Full Stack Developer | Building Amazing Digital Experiences',
      ctaText: 'Get in Touch',
      ctaLink: '#contact',
      isActive: true,
    },
  });
  console.log('✓ Hero created');

  // Projects
  const projects = await Promise.all([
    prisma.portfolioProject.create({
      data: {
        title: 'MSME Marketplace Information System Web Development',
        description: 'Built a React.js and Node.js-based web application for digitization of MSME transactions. Designed an efficient MySQL database for stock management and sales reports. Implemented a responsive design for easy access via mobile devices.',
        imageUrl: 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=MSME+Marketplace',
        githubLink: 'https://github.com/AlAfif19/warung.git',
        liveLink: null,
        tags: ['React.js', 'Node.js', 'MySQL', 'Full Stack'],
        isActive: true,
        order: 1,
      },
    }),
    prisma.portfolioProject.create({
      data: {
        title: 'Web Clustering Customer',
        description: 'Developing a web system that integrates clustering algorithms (Python) for customer segmentation. Performing data visualization of processed results to aid business decision-making. Implementing data security standards on Python & MySQL-based web applications.',
        imageUrl: 'https://via.placeholder.com/400x300/10b981/ffffff?text=Customer+Clustering',
        githubLink: 'https://github.com/AlAfif19/customer_clustering.git',
        liveLink: null,
        tags: ['Python', 'Data Science', 'MySQL', 'Clustering', 'CRISP-DM'],
        isActive: true,
        order: 2,
      },
    }),
    prisma.portfolioProject.create({
      data: {
        title: 'Project Software Quality Assurance',
        description: 'Performed black-box testing and security testing on web applications to ensure they are free of critical bugs. Ensured applications meet functional and security standards before deployment.',
        imageUrl: 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=QA+Testing',
        githubLink: 'https://github.com/AlAfif19',
        liveLink: null,
        tags: ['Quality Assurance', 'Testing', 'Security Testing', 'Black-box Testing'],
        isActive: true,
        order: 3,
      },
    }),
    prisma.portfolioProject.create({
      data: {
        title: 'AbdurBlog - Personal Blog & Portfolio',
        description: 'A modern blog platform with portfolio features and admin panel. Built with Vue.js, Nuxt, TypeScript, and Prisma. Includes role-based access control, content management, and responsive design.',
        imageUrl: 'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=AbdurBlog',
        githubLink: 'https://github.com/abdurblog/abdurblog',
        liveLink: null,
        tags: ['Vue.js', 'Nuxt', 'TypeScript', 'Prisma', 'Tailwind CSS'],
        isActive: true,
        order: 4,
      },
    }),
  ]);
  console.log(`✓ ${projects.length} projects created`);

  // Skills
  const skills = await Promise.all([
    // Frontend
    prisma.portfolioSkill.create({
      data: { name: 'React.js', level: 'Advanced', category: 'Frontend', isActive: true, order: 1 },
    }),
    prisma.portfolioSkill.create({
      data: { name: 'Next.js', level: 'Intermediate', category: 'Frontend', isActive: true, order: 2 },
    }),
    prisma.portfolioSkill.create({
      data: { name: 'TypeScript', level: 'Intermediate', category: 'Frontend', isActive: true, order: 3 },
    }),
    prisma.portfolioSkill.create({
      data: { name: 'Tailwind CSS', level: 'Intermediate', category: 'Frontend', isActive: true, order: 4 },
    }),
    // Backend
    prisma.portfolioSkill.create({
      data: { name: 'Node.js', level: 'Advanced', category: 'Backend', isActive: true, order: 1 },
    }),
    prisma.portfolioSkill.create({
      data: { name: 'Python', level: 'Advanced', category: 'Backend', isActive: true, order: 2 },
    }),
    prisma.portfolioSkill.create({
      data: { name: 'Express', level: 'Intermediate', category: 'Backend', isActive: true, order: 3 },
    }),
    // Database
    prisma.portfolioSkill.create({
      data: { name: 'MySQL', level: 'Advanced', category: 'Database', isActive: true, order: 1 },
    }),
    prisma.portfolioSkill.create({
      data: { name: 'PostgreSQL', level: 'Intermediate', category: 'Database', isActive: true, order: 2 },
    }),
    // Other
    prisma.portfolioSkill.create({
      data: { name: 'Microsoft Office', level: 'Advanced', category: 'Other', isActive: true, order: 1 },
    }),
  ]);
  console.log(`✓ ${skills.length} skills created`);

  // Education
  const education = await Promise.all([
    prisma.portfolioEducation.create({
      data: {
        institution: 'University of the Republic of Indonesia',
        degree: 'Bachelor\'s Degree',
        field: 'Information Technology',
        startDate: new Date('2022-09-01'),
        endDate: null,
        description: 'GPA: 3.90 / 4.00 (Cum Laude). Academic Achievement: Highest Grade in Artificial Intelligence Course. Study Focus: Implementation of AI algorithm models using CRISP-DM method for data analysis. Final Project: Development of Customer Clustering Web (Web & Data Science Integration)',
        isActive: true,
        order: 1,
      },
    }),
  ]);
  console.log(`✓ ${education.length} education entries created`);

  // Contact
  const contact = await prisma.portfolioContact.create({
    data: {
      email: 'alafifabdurrahman8@gmail.com',
      phone: '081398180712',
      linkedin: 'https://linkedin.com/al-afif19',
      github: 'https://github.com/AlAfif19',
      twitter: null,
      address: 'BANDUNG, Indonesia',
      isActive: true,
    },
  });
  console.log('✓ Contact info created');

  // Sample Comments (approved)
  await prisma.portfolioComment.create({
    data: {
      name: 'Recruiter',
      email: 'recruiter@company.com',
      message: 'Great portfolio! Impressive work on the MSME Marketplace project. Would love to discuss potential opportunities.',
      approved: true,
    },
  });
  console.log('✓ Sample comment created');

  console.log('\n✅ Portfolio data seeded successfully with Al Afif Abdurrahman\'s information!');
}

seedPortfolio()
  .catch((e) => {
    console.error('Error seeding portfolio:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
