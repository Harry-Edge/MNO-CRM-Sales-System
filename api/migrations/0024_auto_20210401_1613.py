# Generated by Django 3.1.2 on 2021-04-01 16:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0023_auto_20210401_1555'),
    ]

    operations = [
        migrations.AddField(
            model_name='mobilenumber',
            name='account_last_accessed_by',
            field=models.CharField(max_length=10, null=True),
        ),
        migrations.AddField(
            model_name='mobilenumber',
            name='account_last_accessed_date_time',
            field=models.DateTimeField(null=True),
        ),
    ]
