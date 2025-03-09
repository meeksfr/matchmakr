from v1.models import UserProfile
from django.contrib.auth.models import User

def update_profiles():
    # Update sofia's profile (ID: 7)
    profile = UserProfile.objects.get(user_id=7)
    profile.image_url = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
    profile.age = 25
    profile.location = 'Los Angeles, CA'
    profile.role_type = 'Full-time'
    profile.current_title = 'Frontend Developer'
    profile.save()

    # Update alex's profile (ID: 8)
    profile = UserProfile.objects.get(user_id=8)
    profile.image_url = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
    profile.age = 29
    profile.location = 'Boston, MA'
    profile.role_type = 'Remote'
    profile.current_title = 'Senior Backend Engineer'
    profile.save()

    # Update matinsarahi's profile (ID: 9)
    profile = UserProfile.objects.get(user_id=9)
    profile.image_url = 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
    profile.age = 27
    profile.location = 'Chicago, IL'
    profile.role_type = 'Full-time'
    profile.current_title = 'Mobile Developer'
    profile.save()

    # Update james's profile (ID: 6)
    profile = UserProfile.objects.get(user_id=6)
    profile.image_url = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
    profile.age = 31
    profile.location = 'Denver, CO'
    profile.role_type = 'Hybrid'
    profile.current_title = 'Senior Product Designer'
    profile.save()

if __name__ == '__main__':
    update_profiles() 