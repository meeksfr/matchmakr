from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class TestItem(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name

class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return self.name

class UserProfile(models.Model):
    ROLE_TYPE_CHOICES = [
        ('CANDIDATE', 'Candidate'),
        ('EMPLOYER', 'Employer'),
        ('ADMIN', 'Admin'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    is_employer = models.BooleanField(default=False)
    bio = models.TextField(blank=True)
    image_url = models.URLField(blank=True)
    age = models.PositiveIntegerField(null=True, blank=True)
    location = models.CharField(max_length=200, blank=True)
    role_type = models.CharField(max_length=20, choices=ROLE_TYPE_CHOICES, default='CANDIDATE')
    current_title = models.CharField(max_length=200, blank=True)
    skills = models.ManyToManyField(Skill, related_name='users')
    years_of_experience = models.PositiveIntegerField(default=0)
    resume_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s profile"

class Company(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    website = models.URLField(blank=True)
    location = models.CharField(max_length=200)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Companies"

class JobPosting(models.Model):
    EMPLOYMENT_TYPE_CHOICES = [
        ('FULL_TIME', 'Full Time'),
        ('PART_TIME', 'Part Time'),
        ('CONTRACT', 'Contract'),
        ('INTERNSHIP', 'Internship'),
    ]

    EXPERIENCE_LEVEL_CHOICES = [
        ('ENTRY', 'Entry Level'),
        ('MID', 'Mid Level'),
        ('SENIOR', 'Senior Level'),
        ('LEAD', 'Lead'),
        ('EXECUTIVE', 'Executive'),
    ]

    title = models.CharField(max_length=200)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='job_postings')
    description = models.TextField()
    requirements = models.TextField()
    required_skills = models.ManyToManyField(Skill, related_name='required_by_jobs')
    preferred_skills = models.ManyToManyField(Skill, related_name='preferred_by_jobs')
    location = models.CharField(max_length=200)
    salary_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    salary_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_TYPE_CHOICES)
    experience_level = models.CharField(max_length=20, choices=EXPERIENCE_LEVEL_CHOICES)
    is_remote = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    application_deadline = models.DateTimeField()

    def __str__(self):
        return f"{self.title} at {self.company.name}"

class Application(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending Review'),
        ('REVIEWED', 'Reviewed'),
        ('SHORTLISTED', 'Shortlisted'),
        ('INTERVIEWED', 'Interviewed'),
        ('OFFERED', 'Offer Extended'),
        ('ACCEPTED', 'Offer Accepted'),
        ('REJECTED', 'Rejected'),
        ('WITHDRAWN', 'Withdrawn'),
    ]

    job = models.ForeignKey(JobPosting, on_delete=models.CASCADE, related_name='applications')
    applicant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    cover_letter = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('job', 'applicant')  # Prevent duplicate applications

    def __str__(self):
        return f"{self.applicant.username}'s application for {self.job.title}"

class Match(models.Model):
    MATCH_TYPE_CHOICES = [
        ('ALGORITHM', 'Algorithm Match'),
        ('MANUAL', 'Manual Match'),
    ]

    job = models.ForeignKey(JobPosting, on_delete=models.CASCADE, related_name='matches')
    candidate = models.ForeignKey(User, on_delete=models.CASCADE, related_name='job_matches')
    score = models.DecimalField(max_digits=5, decimal_places=2)  # Matching score percentage
    match_type = models.CharField(max_length=20, choices=MATCH_TYPE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('job', 'candidate')  # Prevent duplicate matches

    def __str__(self):
        return f"Match: {self.candidate.username} - {self.job.title} ({self.score}%)"

class PreviousTitle(models.Model):
    title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    duration = models.CharField(max_length=100)  # e.g. "2020-2023"
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='previous_titles')
    
    def __str__(self):
        return f"{self.title} at {self.company} ({self.duration})"
