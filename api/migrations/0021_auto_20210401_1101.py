# Generated by Django 3.1.2 on 2021-04-01 11:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0020_auto_20210401_1101'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notes',
            name='date_created',
            field=models.DateField(auto_now_add=True),
        ),
    ]
