from django.urls import path, re_path
from django.views.i18n import JavaScriptCatalog

from jet.dashboard import dashboard
from jet.dashboard.views import UpdateDashboardModuleView, add_user_dashboard_module_view, load_dashboard_module_view, \
    remove_dashboard_module_view, reset_dashboard_view, update_dashboard_module_collapse_view, \
    update_dashboard_modules_view


app_name = 'dashboard'

urlpatterns = [
    re_path(
        r'^module/(?P<pk>\d+)/$',
        UpdateDashboardModuleView.as_view(),
        name='update_module'
    ),
    path(
        'update_dashboard_modules/',
        update_dashboard_modules_view,
        name='update_dashboard_modules'
    ),
    path(
        'add_user_dashboard_module/',
        add_user_dashboard_module_view,
        name='add_user_dashboard_module'
    ),
    path(
        'update_dashboard_module_collapse/',
        update_dashboard_module_collapse_view,
        name='update_dashboard_module_collapse'
    ),
    path(
        'remove_dashboard_module/',
        remove_dashboard_module_view,
        name='remove_dashboard_module'
    ),
    re_path(
        r'^load_dashboard_module/(?P<pk>\d+)/$',
        load_dashboard_module_view,
        name='load_dashboard_module'
    ),
    path(
        'reset_dashboard/',
        reset_dashboard_view,
        name='reset_dashboard'
    ),
    path(
        'jsi18n/',
        JavaScriptCatalog.as_view(),
        {'packages': 'jet'},
        name='jsi18n'
    ),
]

urlpatterns += dashboard.urls.get_urls()
