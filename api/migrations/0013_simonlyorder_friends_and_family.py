# Generated by Django 3.1.2 on 2021-03-26 13:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_auto_20210324_1754'),
    ]

    operations = [
        migrations.AddField(
            model_name='simonlyorder',
            name='friends_and_family',
            field=models.BooleanField(default=False, null=True),
        ),
    ]
