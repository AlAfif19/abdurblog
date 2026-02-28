<template>
  <div class="min-h-screen bg-background">
    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
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
              Welcome to My Blog
            </h1>
            <p class="text-xl md:text-2xl text-muted-foreground mb-8">
              Exploring technology, sharing knowledge, and building amazing digital experiences
            </p>
            <div class="flex gap-4 justify-center">
              <Button size="lg" class="group" @click="scrollToSection('contact')">
                Contact Me
                <Mail class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" @click="scrollToSection('about')">
                About Me
                <User class="ml-2 h-4 w-4" />
              </Button>
            </div>
          </MotionDiv>
        </div>
      </div>

      <!-- Animated background elements -->
      <div class="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div class="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
    </section>

    <!-- About Me Section -->
    <section id="about" class="py-20 bg-muted/30">
      <div class="container mx-auto px-4">
        <MotionDiv
          :initial="{ opacity: 0 }"
          :while-in-view="{ opacity: 1 }"
          :transition="{ duration: 0.6 }"
          class="max-w-4xl mx-auto"
        >
          <Card class="overflow-hidden">
            <CardContent class="p-0">
              <div class="grid md:grid-cols-3">
                <!-- Profile Image Section -->
                <div class="bg-primary/10 p-8 flex flex-col items-center justify-center">
                  <div class="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                    <User class="h-16 w-16 text-primary" />
                  </div>
                  <h2 class="text-2xl font-bold text-center">AL AFIF ABDURRAHMAN</h2>
                  <p class="text-muted-foreground text-center mt-2">Full Stack Developer</p>
                  <div class="flex gap-3 mt-4">
                    <a href="https://linkedin.com/al-afif19" target="_blank" rel="noopener" class="p-2 bg-primary/20 rounded-lg hover:bg-primary/30 transition-colors">
                      <Linkedin class="h-5 w-5 text-primary" />
                    </a>
                    <a href="https://github.com/AlAfif19" target="_blank" rel="noopener" class="p-2 bg-primary/20 rounded-lg hover:bg-primary/30 transition-colors">
                      <Github class="h-5 w-5 text-primary" />
                    </a>
                  </div>
                </div>

                <!-- Details Section -->
                <div class="md:col-span-2 p-8">
                  <div class="space-y-6">
                    <!-- Contact Info -->
                    <div class="grid md:grid-cols-2 gap-4">
                      <div class="flex items-center gap-3">
                        <MapPin class="h-5 w-5 text-primary" />
                        <div>
                          <p class="text-sm text-muted-foreground">Location</p>
                          <p class="font-medium">BANDUNG</p>
                        </div>
                      </div>
                      <div class="flex items-center gap-3">
                        <Phone class="h-5 w-5 text-primary" />
                        <div>
                          <p class="text-sm text-muted-foreground">Phone</p>
                          <p class="font-medium">081398180712</p>
                        </div>
                      </div>
                      <div class="flex items-center gap-3">
                        <Mail class="h-5 w-5 text-primary" />
                        <div>
                          <p class="text-sm text-muted-foreground">Email</p>
                          <a href="mailto:alafifabdurrahman8@gmail.com" class="font-medium hover:text-primary transition-colors">
                            alafifabdurrahman8@gmail.com
                          </a>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <!-- Summary -->
                    <div>
                      <h3 class="text-lg font-semibold mb-2">Summary</h3>
                      <p class="text-sm text-muted-foreground">
                        A dedicated Fresh Graduate in Computer Science with practical experience in full-stack web development. Proficient in modern technologies such as React.js, Python, Node.js, and MySQL. Focused on developing secure systems, responsive UI/UX, and exploring data science implementation in web applications. Committed to making a tangible contribution to a dynamic software development team.
                      </p>
                    </div>

                    <!-- Work Experience -->
                    <div>
                      <h3 class="text-lg font-semibold mb-3">Work Experience</h3>
                      <div class="space-y-4">
                        <Card class="bg-muted/50">
                          <CardContent class="p-4">
                            <h4 class="font-semibold">IT Support Intern (Campus Internship)</h4>
                            <p class="text-sm text-muted-foreground">PT. DiAntara Inter Media | Bandung</p>
                            <p class="text-xs text-muted-foreground mb-2">September 2025 – October 2025</p>
                            <ul class="list-disc list-inside text-sm text-muted-foreground space-y-1">
                              <li>Performed maintenance and troubleshooting of company's network infrastructure and software systems</li>
                              <li>Collaborated with developer team to ensure stability of internal systems</li>
                              <li>Assisted with software installation and configuration and provided technical support to users</li>
                            </ul>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <!-- Skills -->
                    <div>
                      <h3 class="text-lg font-semibold mb-3">Skills</h3>
                      <div class="grid md:grid-cols-2 gap-4">
                        <div>
                          <p class="text-sm font-medium mb-2">Technical</p>
                          <div class="flex flex-wrap gap-2">
                            <Badge v-for="skill in technicalSkills" :key="skill" variant="secondary">
                              {{ skill }}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <p class="text-sm font-medium mb-2">Soft Skills</p>
                          <div class="flex flex-wrap gap-2">
                            <Badge v-for="skill in softSkills" :key="skill" variant="secondary">
                              {{ skill }}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Education -->
                    <div>
                      <h3 class="text-lg font-semibold mb-3">Education</h3>
                      <Card class="bg-muted/50">
                        <CardContent class="p-4">
                          <h4 class="font-semibold">Bachelor's Degree – Information Technology</h4>
                          <p class="text-sm text-muted-foreground">University of the Republic of Indonesia, Bandung</p>
                          <p class="text-xs text-muted-foreground mb-2">2022 – 2026 (Expected Graduation)</p>
                          <div class="space-y-1">
                            <p class="text-sm"><span class="font-medium">GPA:</span> 3.90 / 4.00 (Cum Laude)</p>
                            <p class="text-sm text-muted-foreground">• Academic Achievement: Highest Grade in Artificial Intelligence Course</p>
                            <p class="text-sm text-muted-foreground">• Study Focus: Implementation of AI algorithm models using CRISP-DM method for data analysis</p>
                            <p class="text-sm text-muted-foreground">• Final Project: Development of Customer Clustering Web (Web & Data Science Integration)</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </MotionDiv>
      </div>
    </section>

    <!-- Blog Posts Section -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <MotionDiv
          :initial="{ opacity: 0 }"
          :while-in-view="{ opacity: 1 }"
          :transition="{ duration: 0.6 }"
          class="text-center mb-12"
        >
          <h2 class="text-4xl font-bold mb-4">Latest Posts</h2>
          <p class="text-muted-foreground text-lg">Thoughts, tutorials, and insights</p>
        </MotionDiv>

        <div v-if="pending" class="flex justify-center py-12">
          <div class="text-muted-foreground">Loading posts...</div>
        </div>

        <div v-else-if="error" class="rounded-md bg-destructive/10 p-4 text-destructive text-center">
          Failed to load posts. Please try again later.
        </div>

        <div v-else-if="posts.length === 0" class="py-12 text-center text-muted-foreground">
          No posts yet. Check back soon!
        </div>

        <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <MotionDiv
            v-for="(post, index) in posts"
            :key="post.id"
            :initial="{ opacity: 0, y: 20 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.5, delay: index * 0.1 }"
          >
            <Card
              class="cursor-pointer transition-shadow hover:shadow-lg"
              @click="navigateTo(`/posts/${post.slug}`)"
            >
              <div v-if="post.imageUrl" class="relative aspect-video overflow-hidden">
                <img
                  :src="post.imageUrl"
                  :alt="post.title"
                  class="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <CardHeader>
                <CardTitle class="line-clamp-1">{{ post.title }}</CardTitle>
                <p class="text-sm text-muted-foreground">
                  By {{ post.author?.name || 'Unknown' }}
                  <span class="mx-2">•</span>
                  {{ formatDate(post.createdAt) }}
                </p>
              </CardHeader>
              <CardContent>
                <p class="line-clamp-3 text-muted-foreground">
                  {{ post.content }}
                </p>
              </CardContent>
            </Card>
          </MotionDiv>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-20 bg-muted/30">
      <div class="container mx-auto px-4">
        <MotionDiv
          :initial="{ opacity: 0 }"
          :while-in-view="{ opacity: 1 }"
          :transition="{ duration: 0.6 }"
          class="max-w-2xl mx-auto"
        >
          <Card>
            <CardHeader class="text-center">
              <CardTitle class="text-2xl">Get in Touch</CardTitle>
              <CardDescription>Feel free to reach out for collaborations or just a friendly chat!</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="grid gap-4">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-primary/10 rounded-full">
                    <Mail class="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p class="text-sm text-muted-foreground">Email</p>
                    <a href="mailto:alafifabdurrahman8@gmail.com" class="font-medium hover:text-primary transition-colors">
                      alafifabdurrahman8@gmail.com
                    </a>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <div class="p-2 bg-primary/10 rounded-full">
                    <Phone class="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p class="text-sm text-muted-foreground">Phone</p>
                    <a href="tel:081398180712" class="font-medium hover:text-primary transition-colors">
                      081398180712
                    </a>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <div class="p-2 bg-primary/10 rounded-full">
                    <MapPin class="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p class="text-sm text-muted-foreground">Location</p>
                    <p class="font-medium">BANDUNG, Indonesia</p>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <div class="p-2 bg-primary/10 rounded-full">
                    <Linkedin class="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p class="text-sm text-muted-foreground">LinkedIn</p>
                    <a href="https://linkedin.com/al-afif19" target="_blank" rel="noopener" class="font-medium hover:text-primary transition-colors">
                      linkedin.com/al-afif19
                    </a>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <div class="p-2 bg-primary/10 rounded-full">
                    <Github class="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p class="text-sm text-muted-foreground">GitHub</p>
                    <a href="https://github.com/AlAfif19" target="_blank" rel="noopener" class="font-medium hover:text-primary transition-colors">
                      github.com/AlAfif19
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </MotionDiv>
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
              <li><a href="#about" class="text-muted-foreground hover:text-foreground transition-colors">About</a></li>
              <li><a href="#blog" class="text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
              <li><NuxtLink to="/portfolio" class="text-muted-foreground hover:text-foreground transition-colors">Portfolio</NuxtLink></li>
              <li><a href="#contact" class="text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Connect</h4>
            <div class="flex gap-3">
              <a href="https://github.com/AlAfif19" target="_blank" rel="noopener" class="p-2 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors">
                <Github class="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/al-afif19" target="_blank" rel="noopener" class="p-2 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors">
                <Linkedin class="h-5 w-5" />
              </a>
              <a href="mailto:alafifabdurrahman8@gmail.com" class="p-2 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors">
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
import { ref } from 'vue';
import { useRuntimeConfig } from '#app';
import { MotionDiv } from '@/components/motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
} from 'lucide-vue-next';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  author: {
    name: string | null;
    email: string;
  } | null;
}

const config = useRuntimeConfig();

const { data: posts, pending, error } = await useFetch<Post[]>('/api/posts', {
  baseURL: config.public.apiBase,
});

const technicalSkills = [
  'React.js',
  'Next.js',
  'Python',
  'MySQL',
  'Node.js',
  'TypeScript',
  'Microsoft Office',
];

const softSkills = [
  'Communication',
  'Time Management',
  'Problem Solving',
  'Teamwork',
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

useHead({
  title: 'Home - AbdurBlog',
});
</script>
