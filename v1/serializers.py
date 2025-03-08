from rest_framework import serializers
from .models import TestItem

class TestItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestItem
        fields = ['id', 'name', 'description', 'created_at'] 