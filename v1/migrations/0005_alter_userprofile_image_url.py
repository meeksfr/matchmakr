# Generated by Django 5.0.2 on 2025-03-09 02:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('v1', '0004_alter_userprofile_image_url'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='image_url',
            field=models.URLField(blank=True, default='https://randomuser.me/api/portraits/men/1.jpg'),
        ),
    ]
