from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import TestItemViewSet

router = DefaultRouter()
router.register(r'test-items', TestItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 