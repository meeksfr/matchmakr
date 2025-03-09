from v1.models import UserProfile

def fix_profiles():
    default_img = 'https://source.unsplash.com/random/400x600/?professional,portrait,headshot'
    profiles = UserProfile.objects.filter(image_url=default_img)
    
    updates = {
        'sofia': {
            'img': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
            'age': 25,
            'loc': 'Los Angeles, CA',
            'role': 'Full-time',
            'title': 'Frontend Developer'
        },
        'alex': {
            'img': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
            'age': 29,
            'loc': 'Boston, MA',
            'role': 'Remote',
            'title': 'Senior Backend Engineer'
        },
        'matinsarahi': {
            'img': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6',
            'age': 27,
            'loc': 'Chicago, IL',
            'role': 'Full-time',
            'title': 'Mobile Developer'
        },
        'james': {
            'img': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
            'age': 31,
            'loc': 'Denver, CO',
            'role': 'Hybrid',
            'title': 'Senior Product Designer'
        }
    }
    
    for profile in profiles:
        if profile.user.username in updates:
            u = updates[profile.user.username]
            profile.image_url = u['img'] + '?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
            profile.age = u['age']
            profile.location = u['loc']
            profile.role_type = u['role']
            profile.current_title = u['title']
            profile.save()
            print(f"Updated {profile.user.username}'s profile")

if __name__ == '__main__':
    fix_profiles() 