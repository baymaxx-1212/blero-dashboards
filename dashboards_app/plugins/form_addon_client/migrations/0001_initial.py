# -*- coding: utf-8 -*-
# Generated by Django 1.11.15 on 2019-06-06 01:25
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('blero_grid_client', '0001_initial'),
        ('cms', '0020_old_tree_cleanup'),
    ]

    operations = [
        migrations.CreateModel(
            name='BleroGridFormClient',
            fields=[
                ('blerogrid_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='blero_grid_client.BleroGrid')),
            ],
            options={
                'abstract': False,
            },
            bases=('blero_grid_client.blerogrid',),
        ),
        migrations.CreateModel(
            name='FormBtnPluginPosition',
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
            name='FormInputs',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('input_name', models.CharField(blank=True, max_length=100, null=True)),
                ('input_type', models.CharField(blank=True, choices=[('text', 'TextBox'), ('date', 'Date Field'), ('checkbox', 'Checkbox')], max_length=250, null=True)),
                ('input_value', models.CharField(blank=True, max_length=250, null=True, verbose_name='Default Value')),
            ],
            options={
                'verbose_name_plural': 'New Fields',
                'verbose_name': 'New Field',
            },
        ),
        migrations.CreateModel(
            name='FormPlugin',
            fields=[
                ('cmsplugin_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, related_name='form_addon_client_formplugin', serialize=False, to='cms.CMSPlugin')),
                ('form_name', models.CharField(blank=True, max_length=250, null=True)),
                ('button_name', models.CharField(blank=True, max_length=250, null=True)),
                ('ajax_function', models.CharField(blank=True, max_length=250, null=True)),
                ('py_function', models.CharField(blank=True, max_length=250, null=True)),
            ],
            options={
                'verbose_name_plural': 'Addon Forms New',
                'verbose_name': 'Addon Form New',
            },
            bases=('cms.cmsplugin',),
        ),
        migrations.CreateModel(
            name='InputPluginPosition',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_resized', models.BooleanField(default=False)),
                ('width', models.CharField(max_length=50, null=True)),
                ('height', models.CharField(max_length=50, null=True)),
                ('top', models.CharField(max_length=50, null=True)),
                ('left', models.CharField(max_length=50, null=True)),
                ('model', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='inp_position', to='form_addon_client.FormInputs')),
            ],
        ),
        migrations.CreateModel(
            name='LabelPluginPosition',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_resized', models.BooleanField(default=False)),
                ('width', models.CharField(max_length=50, null=True)),
                ('height', models.CharField(max_length=50, null=True)),
                ('top', models.CharField(max_length=50, null=True)),
                ('left', models.CharField(max_length=50, null=True)),
                ('model', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='label_position', to='form_addon_client.FormInputs')),
            ],
        ),
        migrations.CreateModel(
            name='PluginPosition',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_resized', models.BooleanField(default=False)),
                ('width', models.CharField(max_length=50, null=True)),
                ('height', models.CharField(max_length=50, null=True)),
                ('top', models.CharField(max_length=50, null=True)),
                ('left', models.CharField(max_length=50, null=True)),
                ('model', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='form_addon_client.FormPlugin')),
            ],
        ),
        migrations.AddField(
            model_name='forminputs',
            name='id_fr',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='form_plugin', to='form_addon_client.FormPlugin'),
        ),
        migrations.AddField(
            model_name='formbtnpluginposition',
            name='model',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='btn_position', to='form_addon_client.FormPlugin'),
        ),
        migrations.AddField(
            model_name='blerogridformclient',
            name='parent_form',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='form_addon_client.FormPlugin'),
        ),
    ]
