from django.apps import AppConfig


class DashboardApp(AppConfig):
    name = 'jet.dashboard'
    verbose_name = 'Jet Dashboard'

    # noinspection PyUnresolvedReferences
    def ready(self):
        from . import checks
