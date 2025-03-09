# Sample Data for Matchmakr

This directory contains sample data to populate your Matchmakr database with test users, profiles, skills, and work experience.

## How to Load the Data

1. Make sure you have Django installed and your database is set up
2. Run migrations first:
   ```bash
   python manage.py migrate
   ```
3. Load the sample data:
   ```bash
   python manage.py loaddata sample_data/initial_data.json
   ```

## What's Included

The sample data includes:
- 2 users (alex_dev and sarah_design)
- Complete user profiles with images, bios, and professional details
- Skills (React, Python, Figma)
- Previous work experience
- User-skill relationships

## Note About Passwords

The sample users have placeholder hashed passwords. To set up working passwords:

1. Create the users first:
   ```bash
   python manage.py createsuperuser
   ```
2. Then load the rest of the data:
   ```bash
   python manage.py loaddata sample_data/initial_data.json
   ```

## Image Credits

Profile images are from Unsplash and are free to use. 