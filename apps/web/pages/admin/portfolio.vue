<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-4xl font-bold">Portfolio Management</h1>
      <p class="mt-2 text-muted-foreground">Manage your portfolio content</p>
    </div>

    <!-- Tabs -->
    <Tabs v-model="activeTab" class="space-y-4">
      <TabsList class="grid w-full grid-cols-6">
        <TabsTrigger value="hero">Hero</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
        <TabsTrigger value="skills">Skills</TabsTrigger>
        <TabsTrigger value="education">Education</TabsTrigger>
        <TabsTrigger value="contact">Contact</TabsTrigger>
        <TabsTrigger value="comments">Comments</TabsTrigger>
      </TabsList>

      <!-- Hero Section -->
      <TabsContent value="hero">
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>Customize your landing page hero</CardDescription>
          </CardHeader>
          <CardContent>
            <form @submit.prevent="saveHero" class="space-y-4">
              <div class="space-y-2">
                <Label for="hero-heading">Heading</Label>
                <Input id="hero-heading" v-model="heroForm.heading" required />
              </div>
              <div class="space-y-2">
                <Label for="hero-subheading">Subheading</Label>
                <Textarea id="hero-subheading" v-model="heroForm.subheading" required />
              </div>
              <div class="space-y-2">
                <Label for="hero-cta">CTA Button Text</Label>
                <Input id="hero-cta" v-model="heroForm.ctaText" required />
              </div>
              <div class="space-y-2">
                <Label for="hero-cta-link">CTA Link</Label>
                <Input id="hero-cta-link" v-model="heroForm.ctaLink" required />
              </div>
              <div class="space-y-2">
                <Label for="hero-image">Background Image URL</Label>
                <Input id="hero-image" v-model="heroForm.imageUrl" placeholder="https://..." />
              </div>
              <Button type="submit" :disabled="saving">
                <Loader2 v-if="saving" class="mr-2 h-4 w-4 animate-spin" />
                Save Hero
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Projects Section -->
      <TabsContent value="projects">
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>Manage your portfolio projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="mb-6">
              <Button @click="openProjectDialog()">
                <Plus class="mr-2 h-4 w-4" />
                Add Project
              </Button>
            </div>

            <div class="space-y-4">
              <div
                v-for="project in projects"
                :key="project.id"
                class="flex items-center gap-4 p-4 border rounded-lg"
              >
                <div v-if="project.imageUrl" class="w-16 h-16 rounded overflow-hidden bg-muted">
                  <img :src="project.imageUrl" :alt="project.title" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold">{{ project.title }}</h3>
                  <p class="text-sm text-muted-foreground line-clamp-1">{{ project.description }}</p>
                </div>
                <div class="flex gap-2">
                  <Button size="sm" variant="outline" @click="openProjectDialog(project)">
                    <Edit class="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" @click="deleteProject(project.id)">
                    <Trash2 class="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Skills Section -->
      <TabsContent value="skills">
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
            <CardDescription>Manage your skills and expertise</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="mb-6">
              <Button @click="openSkillDialog()">
                <Plus class="mr-2 h-4 w-4" />
                Add Skill
              </Button>
            </div>

            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div
                v-for="skill in skills"
                :key="skill.id"
                class="p-4 border rounded-lg"
              >
                <div class="flex items-center justify-between mb-2">
                  <Badge>{{ skill.category }}</Badge>
                  <div class="flex gap-1">
                    <Button size="sm" variant="ghost" @click="openSkillDialog(skill)">
                      <Edit class="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" @click="deleteSkill(skill.id)">
                      <Trash2 class="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <h3 class="font-semibold mb-1">{{ skill.name }}</h3>
                <p class="text-sm text-muted-foreground">{{ skill.level }}</p>
                <Progress :value="getSkillProgress(skill.level)" class="mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Education Section -->
      <TabsContent value="education">
        <Card>
          <CardHeader>
            <CardTitle>Education</CardTitle>
            <CardDescription>Manage your educational background</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="mb-6">
              <Button @click="openEducationDialog()">
                <Plus class="mr-2 h-4 w-4" />
                Add Education
              </Button>
            </div>

            <div class="space-y-4">
              <div
                v-for="edu in education"
                :key="edu.id"
                class="p-4 border rounded-lg"
              >
                <div class="flex items-start justify-between">
                  <div>
                    <h3 class="font-semibold">{{ edu.degree }} in {{ edu.field }}</h3>
                    <p class="text-sm text-muted-foreground">{{ edu.institution }}</p>
                    <p class="text-xs text-muted-foreground mt-1">
                      {{ formatDate(edu.startDate) }} - {{ edu.endDate ? formatDate(edu.endDate) : 'Present' }}
                    </p>
                  </div>
                  <div class="flex gap-2">
                    <Button size="sm" variant="outline" @click="openEducationDialog(edu)">
                      <Edit class="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" @click="deleteEducation(edu.id)">
                      <Trash2 class="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Contact Section -->
      <TabsContent value="contact">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Manage your contact details</CardDescription>
          </CardHeader>
          <CardContent>
            <form @submit.prevent="saveContact" class="space-y-4">
              <div class="space-y-2">
                <Label for="contact-email">Email</Label>
                <Input id="contact-email" v-model="contactForm.email" type="email" required />
              </div>
              <div class="space-y-2">
                <Label for="contact-phone">Phone</Label>
                <Input id="contact-phone" v-model="contactForm.phone" />
              </div>
              <div class="space-y-2">
                <Label for="contact-linkedin">LinkedIn</Label>
                <Input id="contact-linkedin" v-model="contactForm.linkedin" />
              </div>
              <div class="space-y-2">
                <Label for="contact-github">GitHub</Label>
                <Input id="contact-github" v-model="contactForm.github" />
              </div>
              <div class="space-y-2">
                <Label for="contact-twitter">Twitter</Label>
                <Input id="contact-twitter" v-model="contactForm.twitter" />
              </div>
              <div class="space-y-2">
                <Label for="contact-address">Address</Label>
                <Textarea id="contact-address" v-model="contactForm.address" />
              </div>
              <Button type="submit" :disabled="saving">
                <Loader2 v-if="saving" class="mr-2 h-4 w-4 animate-spin" />
                Save Contact
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Comments Section -->
      <TabsContent value="comments">
        <Card>
          <CardHeader>
            <CardTitle>Comments</CardTitle>
            <CardDescription>Manage visitor comments</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div
                v-for="comment in comments"
                :key="comment.id"
                class="p-4 border rounded-lg"
              >
                <div class="flex items-start justify-between mb-2">
                  <div>
                    <div class="flex items-center gap-2">
                      <h3 class="font-semibold">{{ comment.name }}</h3>
                      <Badge :variant="comment.approved ? 'default' : 'secondary'">
                        {{ comment.approved ? 'Approved' : 'Pending' }}
                      </Badge>
                    </div>
                    <p class="text-sm text-muted-foreground">{{ comment.email }}</p>
                  </div>
                  <div class="flex gap-2">
                    <Button
                      size="sm"
                      :variant="comment.approved ? 'outline' : 'default'"
                      @click="approveComment(comment.id)"
                    >
                      <Check class="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" @click="deleteComment(comment.id)">
                      <Trash2 class="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p class="text-sm">{{ comment.message }}</p>
                <p class="text-xs text-muted-foreground mt-2">{{ formatDate(comment.createdAt) }}</p>
              </div>
            </div>

            <div v-if="comments.length === 0" class="text-center py-12 text-muted-foreground">
              No comments yet.
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>

    <!-- Project Dialog -->
    <Dialog v-model:open="projectDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{ editingProject ? 'Edit' : 'Add' }} Project</DialogTitle>
          <DialogDescription>Fill in the project details</DialogDescription>
        </DialogHeader>
        <form @submit.prevent="saveProject" class="space-y-4">
          <div class="space-y-2">
            <Label for="project-title">Title</Label>
            <Input id="project-title" v-model="projectForm.title" required />
          </div>
          <div class="space-y-2">
            <Label for="project-description">Description</Label>
            <Textarea id="project-description" v-model="projectForm.description" required />
          </div>
          <div class="space-y-2">
            <Label for="project-image">Image URL</Label>
            <Input id="project-image" v-model="projectForm.imageUrl" placeholder="https://..." />
          </div>
          <div class="space-y-2">
            <Label for="project-github">GitHub Link</Label>
            <Input id="project-github" v-model="projectForm.githubLink" required />
          </div>
          <div class="space-y-2">
            <Label for="project-live">Live Demo Link</Label>
            <Input id="project-live" v-model="projectForm.liveLink" placeholder="https://..." />
          </div>
          <div class="space-y-2">
            <Label for="project-tags">Tags (comma separated)</Label>
            <Input id="project-tags" v-model="projectForm.tagsString" placeholder="React, TypeScript, Node.js" />
          </div>
          <DialogFooter>
            <Button type="submit" :disabled="saving">
              <Loader2 v-if="saving" class="mr-2 h-4 w-4 animate-spin" />
              Save Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <!-- Skill Dialog -->
    <Dialog v-model:open="skillDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{ editingSkill ? 'Edit' : 'Add' }} Skill</DialogTitle>
          <DialogDescription>Fill in the skill details</DialogDescription>
        </DialogHeader>
        <form @submit.prevent="saveSkill" class="space-y-4">
          <div class="space-y-2">
            <Label for="skill-name">Name</Label>
            <Input id="skill-name" v-model="skillForm.name" required />
          </div>
          <div class="space-y-2">
            <Label for="skill-level">Level</Label>
            <Select v-model="skillForm.level" required>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
                <SelectItem value="Expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-2">
            <Label for="skill-category">Category</Label>
            <Select v-model="skillForm.category" required>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Frontend">Frontend</SelectItem>
                <SelectItem value="Backend">Backend</SelectItem>
                <SelectItem value="Database">Database</SelectItem>
                <SelectItem value="DevOps">DevOps</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit" :disabled="saving">
              <Loader2 v-if="saving" class="mr-2 h-4 w-4 animate-spin" />
              Save Skill
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <!-- Education Dialog -->
    <Dialog v-model:open="educationDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{ editingEducation ? 'Edit' : 'Add' }} Education</DialogTitle>
          <DialogDescription>Fill in the education details</DialogDescription>
        </DialogHeader>
        <form @submit.prevent="saveEducation" class="space-y-4">
          <div class="space-y-2">
            <Label for="edu-institution">Institution</Label>
            <Input id="edu-institution" v-model="educationForm.institution" required />
          </div>
          <div class="space-y-2">
            <Label for="edu-degree">Degree</Label>
            <Input id="edu-degree" v-model="educationForm.degree" required />
          </div>
          <div class="space-y-2">
            <Label for="edu-field">Field of Study</Label>
            <Input id="edu-field" v-model="educationForm.field" required />
          </div>
          <div class="space-y-2">
            <Label for="edu-start">Start Date</Label>
            <Input id="edu-start" v-model="educationForm.startDate" type="date" required />
          </div>
          <div class="space-y-2">
            <Label for="edu-end">End Date (leave empty if current)</Label>
            <Input id="edu-end" v-model="educationForm.endDate" type="date" />
          </div>
          <div class="space-y-2">
            <Label for="edu-description">Description</Label>
            <Textarea id="edu-description" v-model="educationForm.description" />
          </div>
          <DialogFooter>
            <Button type="submit" :disabled="saving">
              <Loader2 v-if="saving" class="mr-2 h-4 w-4 animate-spin" />
              Save Education
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRuntimeConfig } from '#app';
import { useAuthStore } from '@/stores/auth';
import {
  Plus,
  Edit,
  Trash2,
  Check,
  Loader2,
} from 'lucide-vue-next';

const config = useRuntimeConfig();
const authStore = useAuthStore();

// Check if admin
const isAdmin = computed(() => authStore.isAdmin);

// Redirect if not admin
if (!isAdmin.value) {
  await navigateTo('/');
}

const activeTab = ref('hero');
const saving = ref(false);

// Hero
const heroForm = ref({
  heading: '',
  subheading: '',
  ctaText: '',
  ctaLink: '',
  imageUrl: '',
});

// Projects
const projects = ref<any[]>([]);
const projectDialogOpen = ref(false);
const editingProject = ref<any>(null);
const projectForm = ref({
  title: '',
  description: '',
  imageUrl: '',
  githubLink: '',
  liveLink: '',
  tagsString: '',
});

// Skills
const skills = ref<any[]>([]);
const skillDialogOpen = ref(false);
const editingSkill = ref<any>(null);
const skillForm = ref({
  name: '',
  level: '',
  category: '',
});

// Education
const education = ref<any[]>([]);
const educationDialogOpen = ref(false);
const editingEducation = ref<any>(null);
const educationForm = ref({
  institution: '',
  degree: '',
  field: '',
  startDate: '',
  endDate: '',
  description: '',
});

// Contact
const contactForm = ref({
  email: '',
  phone: '',
  linkedin: '',
  github: '',
  twitter: '',
  address: '',
});

// Comments
const comments = ref<any[]>([]);

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
    day: 'numeric',
  });
};

const fetchData = async () => {
  try {
    const [heroRes, projectsRes, skillsRes, educationRes, contactRes, commentsRes] = await Promise.all([
      fetch(`${config.public.apiBase}/api/portfolio/hero`),
      fetch(`${config.public.apiBase}/api/portfolio/projects`),
      fetch(`${config.public.apiBase}/api/portfolio/skills`),
      fetch(`${config.public.apiBase}/api/portfolio/education`),
      fetch(`${config.public.apiBase}/api/portfolio/contact`),
      fetch(`${config.public.apiBase}/api/portfolio/comments?includeUnapproved=true`),
    ]);

    if (heroRes.ok) {
      const hero = await heroRes.json();
      heroForm.value = {
        heading: hero.heading,
        subheading: hero.subheading,
        ctaText: hero.ctaText,
        ctaLink: hero.ctaLink,
        imageUrl: hero.imageUrl || '',
      };
    }
    if (projectsRes.ok) projects.value = await projectsRes.json();
    if (skillsRes.ok) skills.value = await skillsRes.json();
    if (educationRes.ok) education.value = await educationRes.json();
    if (contactRes.ok) {
      const contact = await contactRes.json();
      contactForm.value = {
        email: contact.email,
        phone: contact.phone || '',
        linkedin: contact.linkedin || '',
        github: contact.github || '',
        twitter: contact.twitter || '',
        address: contact.address || '',
      };
    }
    if (commentsRes.ok) comments.value = await commentsRes.json();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Hero functions
const saveHero = async () => {
  saving.value = true;
  try {
    const response = await fetch(`${config.public.apiBase}/api/portfolio/hero`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify(heroForm.value),
    });
    if (response.ok) {
      alert('Hero saved successfully!');
      await fetchData();
    } else {
      const error = await response.json();
      alert(`Error saving hero: ${error.error || 'Unknown error'}`);
    }
  } catch (error: any) {
    console.error('Error saving hero:', error);
    alert(`Error saving hero: ${error.message || 'Unknown error'}`);
  } finally {
    saving.value = false;
  }
};

// Project functions
const openProjectDialog = (project?: any) => {
  editingProject.value = project || null;
  if (project) {
    projectForm.value = {
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl || '',
      githubLink: project.githubLink,
      liveLink: project.liveLink || '',
      tagsString: project.tags.join(', '),
    };
  } else {
    projectForm.value = {
      title: '',
      description: '',
      imageUrl: '',
      githubLink: '',
      liveLink: '',
      tagsString: '',
    };
  }
  projectDialogOpen.value = true;
};

const saveProject = async () => {
  saving.value = true;
  try {
    const data = {
      ...projectForm.value,
      tags: projectForm.value.tagsString.split(',').map((tag: string) => tag.trim()).filter(Boolean),
    };
    const method = editingProject.value ? 'PUT' : 'POST';
    const url = editingProject.value
      ? `${config.public.apiBase}/api/portfolio/projects/${editingProject.value.id}`
      : `${config.public.apiBase}/api/portfolio/projects`;

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      projectDialogOpen.value = false;
      await fetchData();
    } else {
      const error = await response.json();
      alert(`Error saving project: ${error.error || 'Unknown error'}`);
    }
  } catch (error: any) {
    console.error('Error saving project:', error);
    alert(`Error saving project: ${error.message || 'Unknown error'}`);
  } finally {
    saving.value = false;
  }
};

const deleteProject = async (id: string) => {
  if (!confirm('Are you sure you want to delete this project?')) return;

  try {
    const response = await fetch(`${config.public.apiBase}/api/portfolio/projects/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });
    if (response.ok) {
      await fetchData();
    } else {
      const error = await response.json();
      alert(`Error deleting project: ${error.error || 'Unknown error'}`);
    }
  } catch (error: any) {
    console.error('Error deleting project:', error);
    alert(`Error deleting project: ${error.message || 'Unknown error'}`);
  }
};

// Skill functions
const openSkillDialog = (skill?: any) => {
  editingSkill.value = skill || null;
  if (skill) {
    skillForm.value = {
      name: skill.name,
      level: skill.level,
      category: skill.category,
    };
  } else {
    skillForm.value = {
      name: '',
      level: '',
      category: '',
    };
  }
  skillDialogOpen.value = true;
};

const saveSkill = async () => {
  saving.value = true;
  try {
    const method = editingSkill.value ? 'PUT' : 'POST';
    const url = editingSkill.value
      ? `${config.public.apiBase}/api/portfolio/skills/${editingSkill.value.id}`
      : `${config.public.apiBase}/api/portfolio/skills`;

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify(skillForm.value),
    });

    if (response.ok) {
      skillDialogOpen.value = false;
      await fetchData();
    } else {
      const error = await response.json();
      alert(`Error saving skill: ${error.error || 'Unknown error'}`);
    }
  } catch (error: any) {
    console.error('Error saving skill:', error);
    alert(`Error saving skill: ${error.message || 'Unknown error'}`);
  } finally {
    saving.value = false;
  }
};

const deleteSkill = async (id: string) => {
  if (!confirm('Are you sure you want to delete this skill?')) return;

  try {
    const response = await fetch(`${config.public.apiBase}/api/portfolio/skills/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });
    if (response.ok) {
      await fetchData();
    } else {
      const error = await response.json();
      alert(`Error deleting skill: ${error.error || 'Unknown error'}`);
    }
  } catch (error: any) {
    console.error('Error deleting skill:', error);
    alert(`Error deleting skill: ${error.message || 'Unknown error'}`);
  }
};

// Education functions
const openEducationDialog = (edu?: any) => {
  editingEducation.value = edu || null;
  if (edu) {
    educationForm.value = {
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field,
      startDate: edu.startDate.split('T')[0],
      endDate: edu.endDate ? edu.endDate.split('T')[0] : '',
      description: edu.description || '',
    };
  } else {
    educationForm.value = {
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      description: '',
    };
  }
  educationDialogOpen.value = true;
};

const saveEducation = async () => {
  saving.value = true;
  try {
    const method = editingEducation.value ? 'PUT' : 'POST';
    const url = editingEducation.value
      ? `${config.public.apiBase}/api/portfolio/education/${editingEducation.value.id}`
      : `${config.public.apiBase}/api/portfolio/education`;

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify(educationForm.value),
    });

    if (response.ok) {
      educationDialogOpen.value = false;
      await fetchData();
    } else {
      const error = await response.json();
      alert(`Error saving education: ${error.error || 'Unknown error'}`);
    }
  } catch (error: any) {
    console.error('Error saving education:', error);
    alert(`Error saving education: ${error.message || 'Unknown error'}`);
  } finally {
    saving.value = false;
  }
};

const deleteEducation = async (id: string) => {
  if (!confirm('Are you sure you want to delete this education?')) return;

  try {
    const response = await fetch(`${config.public.apiBase}/api/portfolio/education/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });
    if (response.ok) {
      await fetchData();
    } else {
      const error = await response.json();
      alert(`Error deleting education: ${error.error || 'Unknown error'}`);
    }
  } catch (error: any) {
    console.error('Error deleting education:', error);
    alert(`Error deleting education: ${error.message || 'Unknown error'}`);
  }
};

// Contact functions
const saveContact = async () => {
  saving.value = true;
  try {
    const response = await fetch(`${config.public.apiBase}/api/portfolio/contact`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify(contactForm.value),
    });
    if (response.ok) {
      alert('Contact saved successfully!');
      await fetchData();
    } else {
      const error = await response.json();
      alert(`Error saving contact: ${error.error || 'Unknown error'}`);
    }
  } catch (error: any) {
    console.error('Error saving contact:', error);
    alert(`Error saving contact: ${error.message || 'Unknown error'}`);
  } finally {
    saving.value = false;
  }
};

// Comment functions
const approveComment = async (id: string) => {
  try {
    const response = await fetch(`${config.public.apiBase}/api/portfolio/comments/${id}/approve`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });
    if (response.ok) {
      await fetchData();
    } else {
      const error = await response.json();
      alert(`Error approving comment: ${error.error || 'Unknown error'}`);
    }
  } catch (error: any) {
    console.error('Error approving comment:', error);
    alert(`Error approving comment: ${error.message || 'Unknown error'}`);
  }
};

const deleteComment = async (id: string) => {
  if (!confirm('Are you sure you want to delete this comment?')) return;

  try {
    const response = await fetch(`${config.public.apiBase}/api/portfolio/comments/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });
    if (response.ok) {
      await fetchData();
    } else {
      const error = await response.json();
      alert(`Error deleting comment: ${error.error || 'Unknown error'}`);
    }
  } catch (error: any) {
    console.error('Error deleting comment:', error);
    alert(`Error deleting comment: ${error.message || 'Unknown error'}`);
  }
};

onMounted(() => {
  fetchData();
});
</script>
