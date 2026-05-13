from django.db import migrations, models

import mainapp.models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="BoardState",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("key", models.CharField(default="default", max_length=32, unique=True)),
                ("board_1", models.JSONField(default=list)),
                ("board_2", models.JSONField(default=mainapp.models.default_board_two_positions)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "verbose_name": "Board state",
                "verbose_name_plural": "Board states",
            },
        ),
    ]
