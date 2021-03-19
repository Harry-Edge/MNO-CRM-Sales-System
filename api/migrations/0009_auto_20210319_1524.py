# Generated by Django 3.1.2 on 2021-03-19 15:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_auto_20210317_1159'),
    ]

    operations = [
        migrations.CreateModel(
            name='SpendCaps',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cap_amount', models.CharField(choices=[('None', 'None'), ('0', '0'), ('5', '5'), ('10', '10'), ('20', '20'), ('30', '30'), ('40', '40'), ('50', '50')], max_length=100, null=True)),
                ('cap_name', models.CharField(max_length=200, null=True)),
                ('mrc', models.IntegerField(null=True)),
                ('upfront', models.IntegerField(null=True)),
                ('cap_code', models.CharField(max_length=100, null=True)),
            ],
            options={
                'verbose_name_plural': 'Spend Caps',
            },
        ),
        migrations.AlterField(
            model_name='insurance',
            name='insurance_name',
            field=models.CharField(choices=[('Full Cover £14', 'Full Cover £14'), ('Damage Cover £10', 'Damage Cover £10'), ('Full Cover £12', 'Full Cover £12'), ('Damage Cover £8', 'Damage Cover £8'), ('No Insurance', 'No Insurance')], max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='mobilenumber',
            name='spend_cap',
            field=models.CharField(choices=[('None', 'None'), ('0', '0'), ('5', '5'), ('10', '10'), ('20', '20'), ('30', '30'), ('40', '40'), ('50', '50')], max_length=100, null=True),
        ),
    ]
