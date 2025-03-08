from django.shortcuts import render
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Q
from django.contrib.auth.models import User
from .models import (
    Skill, UserProfile, Company, JobPosting,
    Application, Match
)
from .serializers import (
    UserSerializer, SkillSerializer, UserProfileSerializer,
    CompanySerializer, JobPostingSerializer, ApplicationSerializer,
    MatchSerializer
)

# Create your views here.

class TestItemViewSet(viewsets.ModelViewSet):
    queryset = TestItem.objects.all()
    serializer_class = TestItemSerializer
    permission_classes = [AllowAny]  # For testing purposes only

class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Users can only see their own profile unless they're staff
        if self.request.user.is_staff:
            return UserProfile.objects.all()
        return UserProfile.objects.filter(user=self.request.user)

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description', 'location']

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class JobPostingViewSet(viewsets.ModelViewSet):
    queryset = JobPosting.objects.all()
    serializer_class = JobPostingSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'description', 'requirements', 'location']

    def get_queryset(self):
        queryset = JobPosting.objects.all()
        
        # Filter by active status
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        # Filter by employment type
        employment_type = self.request.query_params.get('employment_type', None)
        if employment_type:
            queryset = queryset.filter(employment_type=employment_type)
        
        # Filter by experience level
        experience_level = self.request.query_params.get('experience_level', None)
        if experience_level:
            queryset = queryset.filter(experience_level=experience_level)
        
        # Filter by remote status
        is_remote = self.request.query_params.get('is_remote', None)
        if is_remote is not None:
            queryset = queryset.filter(is_remote=is_remote.lower() == 'true')
        
        return queryset

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'])
    def apply(self, request, pk=None):
        job = self.get_object()
        
        # Check if user has already applied
        if Application.objects.filter(job=job, applicant=request.user).exists():
            return Response(
                {'detail': 'You have already applied for this job.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = ApplicationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(job=job, applicant=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.profile.is_employer:
            # Employers see applications for their company's jobs
            return Application.objects.filter(job__company__created_by=user)
        else:
            # Applicants see their own applications
            return Application.objects.filter(applicant=user)

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        application = self.get_object()
        new_status = request.data.get('status')
        
        if not new_status:
            return Response(
                {'detail': 'Status is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if new_status not in dict(Application.STATUS_CHOICES):
            return Response(
                {'detail': 'Invalid status.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        application.status = new_status
        application.save()
        serializer = ApplicationSerializer(application)
        return Response(serializer.data)

class MatchViewSet(viewsets.ModelViewSet):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.profile.is_employer:
            # Employers see matches for their company's jobs
            return Match.objects.filter(job__company__created_by=user)
        else:
            # Candidates see their matches
            return Match.objects.filter(candidate=user)

    @action(detail=False, methods=['get'])
    def calculate_matches(self, request):
        """
        Calculate matches for a user (either for their job postings or as a candidate)
        """
        user = request.user
        if user.profile.is_employer:
            # Calculate matches for employer's job postings
            jobs = JobPosting.objects.filter(company__created_by=user)
            # TODO: Implement matching algorithm
            return Response({'detail': 'Matches calculation initiated'})
        else:
            # Calculate matches for candidate
            # TODO: Implement matching algorithm
            return Response({'detail': 'Matches calculation initiated'})
