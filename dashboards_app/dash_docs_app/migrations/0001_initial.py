# -*- coding: utf-8 -*-
# Generated by Django 1.11.15 on 2019-06-06 01:25
from __future__ import unicode_literals

import cms.models.fields
import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('cms', '0020_old_tree_cleanup'),
    ]

    operations = [
        migrations.CreateModel(
            name='DashDoc',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('dash_docs_content', cms.models.fields.PlaceholderField(editable=False, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='documentation_content', slotname='documentation_content', to='cms.Placeholder')),
            ],
        ),
        migrations.CreateModel(
            name='DocumentedModel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('documented_date', models.DateField(default=datetime.date.today)),
                ('holder_plugin', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='holder_plugin', to='cms.CMSPlugin')),
                ('parent_plugin', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='parent_plugin', to='cms.CMSPlugin')),
            ],
        ),
    ]
