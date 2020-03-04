import logging
from importlib import import_module
from jet.dashboard import settings


logger = logging.getLogger(__name__)


def get_current_dashboard(location):
    if location == 'index':
        path = settings.JET_INDEX_DASHBOARD
    elif location == 'app_index':
        path = settings.JET_APP_INDEX_DASHBOARD
    else:
        raise ValueError('Unknown dashboard location: %s' % location)

    module, cls = path.rsplit('.', 1)

    try:
        module = import_module(module)
        index_dashboard_cls = getattr(module, cls)
    except ImportError:
        index_dashboard_cls = None

    if index_dashboard_cls is None:
        logger.warning(f"Unable to import dashboard from {path!r}. "
                       f"Make sure that JET_INDEX_DASHBOARD and JET_APP_INDEX_DASHBOARD "
                       f"are configured correctly.")
    return index_dashboard_cls
