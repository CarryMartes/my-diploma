# Generated by Django 3.2.12 on 2022-04-24 11:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authApp', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='teachers',
            name='rating',
            field=models.IntegerField(default=5),
        ),
    ]