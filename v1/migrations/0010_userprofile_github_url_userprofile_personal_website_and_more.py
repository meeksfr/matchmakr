# Generated by Django 5.0.2 on 2025-03-09 04:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('v1', '0009_alter_skill_name_alter_userprofile_image_url_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='github_url',
            field=models.URLField(blank=True),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='personal_website',
            field=models.URLField(blank=True),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='portfolio_url',
            field=models.URLField(blank=True),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='twitter_url',
            field=models.URLField(blank=True),
        ),
    ]
