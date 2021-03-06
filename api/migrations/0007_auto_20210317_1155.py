# Generated by Django 3.1.2 on 2021-03-17 11:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_auto_20210313_1337'),
    ]

    operations = [
        migrations.CreateModel(
            name='Insurance',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('insurance_name', models.CharField(choices=[('Full Cover £14 ', 'Full Cover £14'), ('Damage Cover £10', 'Damage Cover £10'), ('Full Cover £12', 'Full Cover £12'), ('Damage Cover £8', 'Damage Cover £8'), ('No Insurance', 'No Insurance')], max_length=200, null=True)),
                ('mrc', models.FloatField(null=True)),
                ('excess_fee', models.CharField(choices=[('120', '120'), ('100', '100')], max_length=200, null=True)),
            ],
            options={
                'verbose_name_plural': 'Insurance',
            },
        ),
        migrations.AddField(
            model_name='mobilenumber',
            name='insurance_option',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.insurance'),
        ),
    ]
