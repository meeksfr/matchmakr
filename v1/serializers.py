from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Skill, UserProfile, Company, JobPosting,
    Application, Match, PreviousTitle
)

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    is_employer = serializers.BooleanField(write_only=True, required=False, default=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password', 'is_employer']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True}
        }

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        is_employer = validated_data.pop('is_employer', False)
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'description']

class PreviousTitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreviousTitle
        fields = ['id', 'title', 'company', 'duration']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    skills = SkillSerializer(many=True, read_only=True)
    previous_titles = PreviousTitleSerializer(many=True, read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            'id', 'user', 'bio', 'years_of_experience', 'is_employer',
            'skills', 'resume_url', 'linkedin_url', 'image_url',
            'github_url', 'portfolio_url', 'twitter_url', 'personal_website',
            'age', 'location', 'role_type', 'current_title',
            'previous_titles', 'created_at', 'updated_at'
        ]

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