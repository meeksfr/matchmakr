from rest_framework.routers import DefaultRouter
from django.urls import path, include
from rest_framework.authtoken import views as auth_views
from .views import (
    SkillViewSet, UserProfileViewSet, CompanyViewSet,
    JobPostingViewSet, ApplicationViewSet, MatchViewSet,
    register_user, login_user
)

router = DefaultRouter()
router.register(r'skills', SkillViewSet)
router.register(r'profiles', UserProfileViewSet)
router.register(r'companies', CompanyViewSet)
router.register(r'jobs', JobPostingViewSet)
router.register(r'applications', ApplicationViewSet)
router.register(r'matches', MatchViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', register_user, name='register'),
    path('auth/login/', login_user, name='login'),
] 