# -*- coding: utf-8 -*-
# Generated by Django 1.11.15 on 2019-06-06 01:25
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import dashboards_app.plugins.task_tracker_client.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('cms', '0020_old_tree_cleanup'),
    ]

    operations = [
        migrations.CreateModel(
            name='PluginPosition',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_resized', models.BooleanField(default=False)),
                ('width', models.CharField(max_length=50, null=True)),
                ('height', models.CharField(max_length=50, null=True)),
                ('top', models.CharField(max_length=50, null=True)),
                ('left', models.CharField(max_length=50, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='TaskDetail',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', models.DateField(default=django.utils.timezone.now)),
                ('date_completed', models.DateField(null=True)),
                ('is_complete', models.BooleanField(default=False)),
                ('task_title', models.CharField(default='New Task', max_length=250)),
                ('task_body', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='TaskHolder',
            fields=[
                ('cmsplugin_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, related_name='task_tracker_client_taskholder', serialize=False, to='cms.CMSPlugin')),
                ('holder_label', models.CharField(max_length=200)),
                ('since_date', models.DateField(default=dashboards_app.plugins.task_tracker_client.models.one_year_before)),
                ('only_completed', models.BooleanField(default=False)),
            ],
            options={
                'abstract': False,
            },
            bases=('cms.cmsplugin',),
        ),
        migrations.AddField(
            model_name='taskdetail',
            name='model',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='task', to='task_tracker_client.TaskHolder'),
        ),
        migrations.AddField(
            model_name='pluginposition',
            name='model',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='task_tracker_client.TaskHolder'),
        ),
    ]
