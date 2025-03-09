# Generated by Django 5.0.2 on 2025-03-09 04:41

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Skill',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
                ('description', models.TextField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='TestItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Company',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('website', models.URLField(blank=True)),
                ('location', models.CharField(max_length=200)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name_plural': 'Companies',
            },
        ),
        migrations.CreateModel(
            name='JobPosting',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('requirements', models.TextField()),
                ('location', models.CharField(max_length=200)),
                ('salary_min', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('salary_max', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('employment_type', models.CharField(choices=[('FULL_TIME', 'Full Time'), ('PART_TIME', 'Part Time'), ('CONTRACT', 'Contract'), ('INTERNSHIP', 'Internship')], max_length=20)),
                ('experience_level', models.CharField(choices=[('ENTRY', 'Entry Level'), ('MID', 'Mid Level'), ('SENIOR', 'Senior Level'), ('LEAD', 'Lead'), ('EXECUTIVE', 'Executive')], max_length=20)),
                ('is_remote', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('application_deadline', models.DateTimeField()),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='job_postings', to='v1.company')),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('preferred_skills', models.ManyToManyField(related_name='preferred_by_jobs', to='v1.skill')),
                ('required_skills', models.ManyToManyField(related_name='required_by_jobs', to='v1.skill')),
            ],
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_employer', models.BooleanField(default=False)),
                ('bio', models.TextField(blank=True)),
                ('image_url', models.URLField(blank=True)),
                ('age', models.PositiveIntegerField(blank=True, null=True)),
                ('location', models.CharField(blank=True, max_length=200)),
                ('role_type', models.CharField(choices=[('CANDIDATE', 'Candidate'), ('EMPLOYER', 'Employer'), ('ADMIN', 'Admin')], default='CANDIDATE', max_length=20)),
                ('current_title', models.CharField(blank=True, max_length=200)),
                ('years_of_experience', models.PositiveIntegerField(default=0)),
                ('resume_url', models.URLField(blank=True)),
                ('linkedin_url', models.URLField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('skills', models.ManyToManyField(related_name='users', to='v1.skill')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='PreviousTitle',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('company', models.CharField(max_length=200)),
                ('duration', models.CharField(max_length=100)),
                ('user_profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='previous_titles', to='v1.userprofile')),
            ],
        ),
        migrations.CreateModel(
            name='Application',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cover_letter', models.TextField(blank=True)),
                ('status', models.CharField(choices=[('PENDING', 'Pending Review'), ('REVIEWED', 'Reviewed'), ('SHORTLISTED', 'Shortlisted'), ('INTERVIEWED', 'Interviewed'), ('OFFERED', 'Offer Extended'), ('ACCEPTED', 'Offer Accepted'), ('REJECTED', 'Rejected'), ('WITHDRAWN', 'Withdrawn')], default='PENDING', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('applicant', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='applications', to=settings.AUTH_USER_MODEL)),
                ('job', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='applications', to='v1.jobposting')),
            ],
            options={
                'unique_together': {('job', 'applicant')},
            },
        ),
        migrations.CreateModel(
            name='Match',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('score', models.DecimalField(decimal_places=2, max_digits=5)),
                ('match_type', models.CharField(choices=[('ALGORITHM', 'Algorithm Match'), ('MANUAL', 'Manual Match')], max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('candidate', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='job_matches', to=settings.AUTH_USER_MODEL)),
                ('job', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='matches', to='v1.jobposting')),
            ],
            options={
                'unique_together': {('job', 'candidate')},
            },
        ),
    ]
