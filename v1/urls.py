from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    SkillViewSet, UserProfileViewSet, CompanyViewSet,
    JobPostingViewSet, ApplicationViewSet, MatchViewSet,
    signup, login_view
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
    path('signup/', signup, name='signup'),
    path('login/', login_view, name='login'),
] 