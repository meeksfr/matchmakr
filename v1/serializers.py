from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Skill, UserProfile, Company, JobPosting,
    Application, Match
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    skills = SkillSerializer(many=True, read_only=True)
    skill_ids = serializers.PrimaryKeyRelatedField(
        many=True, write_only=True, queryset=Skill.objects.all(), source='skills'
    )

    class Meta:
        model = UserProfile
        fields = '__all__'

class CompanySerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Company
        fields = '__all__'
        read_only_fields = ['created_by']

class JobPostingSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)
    company_id = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=Company.objects.all(), source='company'
    )
    required_skills = SkillSerializer(many=True, read_only=True)
    preferred_skills = SkillSerializer(many=True, read_only=True)
    required_skill_ids = serializers.PrimaryKeyRelatedField(
        many=True, write_only=True, queryset=Skill.objects.all(), source='required_skills'
    )
    preferred_skill_ids = serializers.PrimaryKeyRelatedField(
        many=True, write_only=True, queryset=Skill.objects.all(), source='preferred_skills'
    )
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = JobPosting
        fields = '__all__'
        read_only_fields = ['created_by']

class ApplicationSerializer(serializers.ModelSerializer):
    job = JobPostingSerializer(read_only=True)
    applicant = UserSerializer(read_only=True)
    job_id = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=JobPosting.objects.all(), source='job'
    )

    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ['applicant', 'status']

class MatchSerializer(serializers.ModelSerializer):
    job = JobPostingSerializer(read_only=True)
    candidate = UserSerializer(read_only=True)

    class Meta:
        model = Match
        fields = '__all__'
        read_only_fields = ['score', 'match_type'] 