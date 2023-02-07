# Generated by Django 3.2.16 on 2023-02-06 13:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("posthog", "0298_add_insight_queries"),
    ]

    operations = [
        migrations.RunSQL(
            # at the point of this migration, the only team that has templates is the PostHog team in cloud
            """
            UPDATE posthog_dashboardtemplate
            SET team_id = NULL
            WHERE team_id IS NOT NULL
            -- not-null-ignore
            """,
            reverse_sql=migrations.RunSQL.noop,
        ),
    ]
