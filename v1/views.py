from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import TestItem
from .serializers import TestItemSerializer

# Create your views here.

class TestItemViewSet(viewsets.ModelViewSet):
    queryset = TestItem.objects.all()
    serializer_class = TestItemSerializer
    permission_classes = [AllowAny]  # For testing purposes only
