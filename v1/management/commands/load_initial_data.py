from django.core.management.base import BaseCommand
from django.core.management import call_command

class Command(BaseCommand):
    help = 'Load initial data for the application'

    def handle(self, *args, **kwargs):
        self.stdout.write('Loading initial data...')
        
        # Load the fixture
        call_command('loaddata', 'initial_data.json')
        
        self.stdout.write(self.style.SUCCESS('Successfully loaded initial data')) 