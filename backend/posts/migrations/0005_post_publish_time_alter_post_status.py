# Generated by Django 4.2.6 on 2025-06-14 08:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0004_post_view_count'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='publish_time',
            field=models.DateTimeField(blank=True, help_text="If set and status is 'scheduled', will be published automatically at this time", null=True, verbose_name='Scheduled Publish Time'),
        ),
        migrations.AlterField(
            model_name='post',
            name='status',
            field=models.CharField(choices=[('draft', 'Draft'), ('scheduled', 'Scheduled'), ('published', 'Published'), ('archived', 'Archived')], default='draft', max_length=20, verbose_name='Post status'),
        ),
    ]
