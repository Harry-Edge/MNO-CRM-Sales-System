# Generated by Django 3.1.2 on 2021-03-12 21:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_simonlytariffs'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='simonlytariffs',
            options={'verbose_name_plural': 'Sim Only Tariffs'},
        ),
        migrations.CreateModel(
            name='SimOnlyOrder',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ctn', models.CharField(max_length=11, null=True)),
                ('contract_length', models.CharField(choices=[('1', '1'), ('12', '12'), ('18', '18'), ('24', '24')], max_length=2, null=True)),
                ('contract_type', models.CharField(max_length=30, null=True)),
                ('customer', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.customer')),
                ('tariff', models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.simonlytariffs')),
            ],
        ),
    ]
