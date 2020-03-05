from django.utils.version import get_version


default_app_config = 'jet.apps.JetConfig'

VERSION = (1, 0, 8, 'alpha', 0)
__version__ = get_version(VERSION)
