=====
Blero Dashboards
=====



Quick start
-----------

1. Add "dashbboards_app" and desired plugins to your INSTALLED_APPS setting like this::

    INSTALLED_APPS = [
        ...

     'dashboards_app',

    'dashboards_app.dash_docs_app',
    'dashboards_app.plugins.blero_container_client',
    'dashboards_app.plugins.form_addon_client',
    'dashboards_app.plugins.blero_grid_client',
    'dashboards_app.plugins.db_addon_client',
    'dashboards_app.plugins.log_terminal_client',
    'dashboards_app.plugins.task_tracker_client',
    'dashboards_app.celery_progress',
    ]

