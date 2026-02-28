<template>
  <div class="min-h-screen bg-background">
    <!-- Hero Section -->
    <section v-if="hero" class="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
      <div class="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />

      <div class="container mx-auto px-4 relative z-10">
        <div class="max-w-4xl mx-auto text-center">
          <MotionDiv
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6 }"
          >
            <h1 class="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              {{ hero.heading }}
            </h1>
            <p class="text-xl md:text-2xl text-muted-foreground mb-8">
              {{ hero.subheading }}
            </p>
            <Button size="lg" class="group" @click="scrollToSection('contact')">
              {{ hero.ctaText }}
              <ArrowRight class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </MotionDiv>
        </div>
      </div>

      <!-- Animated background elements -->
      <div class="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div class="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
    </section>

    <!-- Projects Section -->
    <section id="projects" class="py-20 bg-muted/30">
      <div class="container mx-auto px-4">
        <MotionDiv
          :initial="{ opacity: 0 }"
          :while-in-view="{ opacity: 1 }"
          :transition="{ duration: 0.6 }"
          class="text-center mb-12"
        >
          <h2 class="text-4xl font-bold mb-4">Projects</h2>
          <p class="text-muted-foreground text-lg">Some of my recent work</p>
        </MotionDiv>

        <div v-if="projects.length > 0" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <MotionDiv
            v-for="(project, index) in projects"
            :key="project.id"
            :initial="{ opacity: 0, y: 20 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.5, delay: index * 0.1 }"
          >
            <Card class="overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div v-if="project.imageUrl" class="relative aspect-video overflow-hidden">
                <img
                  :src="project.imageUrl"
                  :alt="project.title"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                  <Button size="sm" variant="secondary" @click="window.open(project.githubLink, '_blank')">
                    <Github class="mr-2 h-4 w-4" />
                    GitHub
                  </Button>
                  <Button v-if="project.liveLink" size="sm" @click="window.open(project.liveLink, '_blank')">
                    <ExternalLink class="mr-2 h-4 w-4" />
                    Live Demo
                  </Button>
                </div>
              </div>
              <CardHeader>
                <CardTitle class="text-xl">{{ project.title }}</CardTitle>
                <CardDescription>{{ project.description }}</CardDescription>
              </CardHeader>
              <CardContent>
                <div class="flex flex-wrap gap-2">
                  <Badge v-for="tag in project.tags" :key="tag" variant="secondary">
                    {{ tag }}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </MotionDiv>
        </div>

        <div v-else class="text-center py-12 text-muted-foreground">
          No projects yet. Check back soon!
        </div>
      </div>
    </section>

    <!-- Skills Section -->
    <section id="skills" class="py-20">
      <div class="container mx-auto px-4">
        <MotionDiv
          :initial="{ opacity: 0 }"
          :while-in-view="{ opacity: 1 }"
          :transition="{ duration: 0.6 }"
          class="text-center mb-12"
        >
          <h2 class="text-4xl font-bold mb-4">Skills</h2>
          <p class="text-muted-foreground text-lg">Technologies I work with</p>
        </MotionDiv>

        <div v-if="skills.length > 0" class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <MotionDiv
            v-for="(skill, index) in groupedSkills"
            :key="skill.category"
            :initial="{ opacity: 0, y: 20 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.5, delay: index * 0.1 }"
          >
            <Card class="h-full">
              <CardHeader>
                <CardTitle class="text-lg flex items-center gap-2">
                  <component :is="getSkillIcon(skill.category)" class="h-5 w-5" />
                  {{ skill.category }}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div class="space-y-3">
                  <div v-for="item in skill.items" :key="item.id" class="space-y-1">
                    <div class="flex justify-between text-sm">
                      <span>{{ item.name }}</span>
                      <span class="text-muted-foreground">{{ item.level }}</span>
                    </div>
                    <Progress :value="getSkillProgress(item.level)" class="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </MotionDiv>
        </div>

        <div v-else class="text-center py-12 text-muted-foreground">
          Skills coming soon!
        </div>
      </div>
    </section>

    <!-- Education Section -->
    <section id="education" class="py-20 bg-muted/30">
      <div class="container mx-auto px-4">
        <MotionDiv
          :initial="{ opacity: 0 }"
          :while-in-view="{ opacity: 1 }"
          :transition="{ duration: 0.6 }"
          class="text-center mb-12"
        >
          <h2 class="text-4xl font-bold mb-4">Education</h2>
          <p class="text-muted-foreground text-lg">My educational background</p>
        </MotionDiv>

        <div v-if="education.length > 0" class="max-w-3xl mx-auto space-y-6">
          <MotionDiv
            v-for="(edu, index) in education"
            :key="edu.id"
            :initial="{ opacity: 0, x: -20 }"
            :while-in-view="{ opacity: 1, x: 0 }"
            :transition="{ duration: 0.5, delay: index * 0.1 }"
          >
            <Card class="relative pl-8 border-l-4 border-primary">
              <div class="absolute left-3 top-8 w-2 h-2 bg-primary rounded-full" />
              <CardHeader>
                <CardTitle class="text-xl">{{ edu.degree }} in {{ edu.field }}</CardTitle>
                <CardDescription>{{ edu.institution }}</CardDescription>
              </CardHeader>
              <CardContent>
                <div class="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div class="flex items-center gap-1">
                    <Calendar class="h-4 w-4" />
                    <span>{{ formatDate(edu.startDate) }} - {{ edu.endDate ? formatDate(edu.endDate) : 'Present' }}</span>
                  </div>
                </div>
                <p v-if="edu.description" class="text-sm">{{ edu.description }}</p>
              </CardContent>
            </Card>
          </MotionDiv>
        </div>

        <div v-else class="text-center py-12 text-muted-foreground">
          Education details coming soon!
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-20">
      <div class="container mx-auto px-4">
        <MotionDiv
          :initial="{ opacity: 0 }"
          :while-in-view="{ opacity: 1 }"
          :transition="{ duration: 0.6 }"
          class="text-center mb-12"
        >
          <h2 class="text-4xl font-bold mb-4">Get in Touch</h2>
          <p class="text-muted-foreground text-lg">Let's work together</p>
        </MotionDiv>

        <div v-if="contact" class="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle class="text-2xl text-center">Contact Me</CardTitle>
              <CardDescription class="text-center">Feel free to reach out!</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="grid gap-6">
                <div v-if="contact.email" class="flex items-center gap-3">
                  <div class="p-2 bg-primary/10 rounded-full">
                    <Mail class="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p class="text-sm text-muted-foreground">Email</p>
                    <a :href="`mailto:${contact.email}`" class="font-medium hover:text-primary transition-colors">
                      {{ contact.email }}
                    </a>
                  </div>
                </div>

                <div v-if="contact.phone" class="flex items-center gap-3">
                  <div class="p-2 bg-primary/10 rounded-full">
                    <Phone class="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p class="text-sm text-muted-foreground">Phone</p>
                    <a :href="`tel:${contact.phone}`" class="font-medium hover:text-primary transition-colors">
                      {{ contact.phone }}
                    </a>
                  </div>
                </div>

                <div v-if="contact.linkedin" class="flex items-center gap-3">
                  <div class="p-2 bg-primary/10 rounded-full">
                    <Linkedin class="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p class="text-sm text-muted-foreground">LinkedIn</p>
                    <a :href="contact.linkedin" target="_blank" rel="noopener" class="font-medium hover:text-primary transition-colors">
                      Connect
                    </a>
                  </div>
                </div>

                <div v-if="contact.github" class="flex items-center gap-3">
                  <div class="p-2 bg-primary/10 rounded-full">
                    <Github class="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p class="text-sm text-muted-foreground">GitHub</p>
                    <a :href="contact.github" target="_blank" rel="noopener" class="font-medium hover:text-primary transition-colors">
                      Follow
                    </a>
                  </div>
                </div>

                <div v-if="contact.address" class="flex items-center gap-3">
                  <div class="p-2 bg-primary/10 rounded-full">
                    <MapPin class="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p class="text-sm text-muted-foreground">Location</p>
                    <p class="font-medium">{{ contact.address }}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <!-- Comments Section -->
    <section class="py-20 bg-muted/30">
      <div class="container mx-auto px-4">
        <MotionDiv
          :initial="{ opacity: 0 }"
          :while-in-view="{ opacity: 1 }"
          :transition="{ duration: 0.6 }"
          class="text-center mb-12"
        >
          <h2 class="text-4xl font-bold mb-4">Leave a Comment</h2>
          <p class="text-muted-foreground text-lg">Share your thoughts</p>
        </MotionDiv>

        <div class="max-w-2xl mx-auto space-y-8">
          <!-- Comment Form -->
          <Card>
            <CardHeader>
              <CardTitle>Add Comment</CardTitle>
              <CardDescription>Your comment will be reviewed before appearing</CardDescription>
            </CardHeader>
            <CardContent>
              <form @submit.prevent="submitComment" class="space-y-4">
                <div class="grid gap-4 md:grid-cols-2">
                  <div class="space-y-2">
                    <Label for="name">Name</Label>
                    <Input id="name" v-model="commentForm.name" placeholder="Your name" required />
                  </div>
                  <div class="space-y-2">
                    <Label for="email">Email</Label>
                    <Input id="email" v-model="commentForm.email" type="email" placeholder="your@email.com" required />
                  </div>
                </div>
                <div class="space-y-2">
                  <Label for="message">Message</Label>
                  <Textarea
                    id="message"
                    v-model="commentForm.message"
                    placeholder="Your message..."
                    rows="4"
                    required
                  />
                </div>
                <Button type="submit" :disabled="submittingComment">
                  <Loader2 v-if="submittingComment" class="mr-2 h-4 w-4 animate-spin" />
                  Submit Comment
                </Button>
              </form>
            </CardContent>
          </Card>

          <!-- Comments List -->
          <div v-if="comments.length > 0" class="space-y-4">
            <MotionDiv
              v-for="(comment, index) in comments"
              :key="comment.id"
              :initial="{ opacity: 0, y: 20 }"
              :while-in-view="{ opacity: 1, y: 0 }"
              :transition="{ duration: 0.5, delay: index * 0.1 }"
            >
              <Card>
                <CardContent class="pt-6">
                  <div class="flex items-start justify-between gap-4">
                    <div class="flex-1">
                      <div class="flex items-center gap-2 mb-2">
                        <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User class="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p class="font-medium">{{ comment.name }}</p>
                          <p class="text-sm text-muted-foreground">{{ comment.email }}</p>
                        </div>
                      </div>
                      <p class="text-sm">{{ comment.message }}</p>
                    </div>
                    <div class="text-xs text-muted-foreground">
                      {{ formatDate(comment.createdAt) }}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </MotionDiv>
          </div>

          <div v-else class="text-center py-12 text-muted-foreground">
            No comments yet. Be the first to share your thoughts!
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t bg-card">
      <div class="container mx-auto py-12 px-4">
        <div class="grid gap-8 md:grid-cols-3">
          <div>
            <h3 class="font-bold text-xl mb-4">AbdurBlog</h3>
            <p class="text-muted-foreground text-sm">
              Building amazing digital experiences one project at a time.
            </p>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Quick Links</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#projects" class="text-muted-foreground hover:text-foreground transition-colors">Projects</a></li>
              <li><a href="#skills" class="text-muted-foreground hover:text-foreground transition-colors">Skills</a></li>
              <li><a href="#education" class="text-muted-foreground hover:text-foreground transition-colors">Education</a></li>
              <li><a href="#contact" class="text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Connect</h4>
            <div v-if="contact" class="flex gap-3">
              <a v-if="contact.github" :href="contact.github" target="_blank" rel="noopener" class="p-2 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors">
                <Github class="h-5 w-5" />
              </a>
              <a v-if="contact.linkedin" :href="contact.linkedin" target="_blank" rel="noopener" class="p-2 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors">
                <Linkedin class="h-5 w-5" />
              </a>
              <a v-if="contact.twitter" :href="contact.twitter" target="_blank" rel="noopener" class="p-2 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors">
                <Twitter class="h-5 w-5" />
              </a>
              <a v-if="contact.email" :href="`mailto:${contact.email}`" class="p-2 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors">
                <Mail class="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div class="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {{ new Date().getFullYear() }} AbdurBlog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRuntimeConfig } from '#app';
import { MotionDiv } from '@/components/motion';
import {
  ArrowRight,
  Github,
  ExternalLink,
  Calendar,
  Mail,
  Phone,
  Linkedin,
  MapPin,
  User,
  Loader2,
  Twitter,
  Code2,
  Database,
  Layout,
  Cpu,
} from 'lucide-vue-next';

interface Hero {
  id: string;
  heading: string;
  subheading: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string | null;
}

interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  githubLink: string;
  liveLink: string | null;
  tags: string[];
}

interface Skill {
  id: string;
  name: string;
  level: string;
  category: string;
  icon: string | null;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
}

interface Contact {
  id: string;
  email: string;
  phone: string | null;
  linkedin: string | null;
  github: string | null;
  twitter: string | null;
  address: string | null;
}

interface Comment {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

const config = useRuntimeConfig();

const hero = ref<Hero | null>(null);
const projects = ref<Project[]>([]);
const skills = ref<Skill[]>([]);
const education = ref<Education[]>([]);
const contact = ref<Contact | null>(null);
const comments = ref<Comment[]>([]);

const commentForm = ref({
  name: '',
  email: '',
  message: '',
});

const submittingComment = ref(false);

const groupedSkills = computed(() => {
  const groups = skills.value.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return Object.entries(groups).map(([category, items]) => ({
    category,
    items: items.sort((a, b) => a.order - b.order),
  }));
});

const getSkillIcon = (category: string) => {
  const icons: Record<string, any> = {
    Frontend: Layout,
    Backend: Code2,
    Database: Database,
    DevOps: Cpu,
  };
  return icons[category] || Code2;
};

const getSkillProgress = (level: string) => {
  const levels: Record<string, number> = {
    Beginner: 25,
    Intermediate: 50,
    Advanced: 75,
    Expert: 100,
  };
  return levels[level] || 50;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
};

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const submitComment = async () => {
  submittingComment.value = true;
  try {
    const response = await fetch(`${config.public.apiBase}/api/portfolio/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentForm.value),
    });

    if (response.ok) {
      commentForm.value = { name: '', email: '', message: '' };
      await fetchComments();
    }
  } catch (error) {
    console.error('Error submitting comment:', error);
  } finally {
    submittingComment.value = false;
  }
};

const fetchPortfolioData = async () => {
  try {
    const [heroRes, projectsRes, skillsRes, educationRes, contactRes, commentsRes] = await Promise.all([
      fetch(`${config.public.apiBase}/api/portfolio/hero`),
      fetch(`${config.public.apiBase}/api/portfolio/projects`),
      fetch(`${config.public.apiBase}/api/portfolio/skills`),
      fetch(`${config.public.apiBase}/api/portfolio/education`),
      fetch(`${config.public.apiBase}/api/portfolio/contact`),
      fetch(`${config.public.apiBase}/api/portfolio/comments`),
    ]);

    if (heroRes.ok) hero.value = await heroRes.json();
    if (projectsRes.ok) projects.value = await projectsRes.json();
    if (skillsRes.ok) skills.value = await skillsRes.json();
    if (educationRes.ok) education.value = await educationRes.json();
    if (contactRes.ok) contact.value = await contactRes.json();
    if (commentsRes.ok) comments.value = await commentsRes.json();
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
  }
};

const fetchComments = async () => {
  try {
    const response = await fetch(`${config.public.apiBase}/api/portfolio/comments`);
    if (response.ok) {
      comments.value = await response.json();
    }
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
};

onMounted(() => {
  fetchPortfolioData();
});

useHead({
  title: 'Portfolio - AbdurBlog',
});
</script>
