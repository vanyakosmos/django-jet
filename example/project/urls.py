from django.conf import settings
from django.contrib import admin
from django.urls import include, path
from django.views.generic import RedirectView

from app.views import BookAutocomplete


urlpatterns = [
    path('', RedirectView.as_view(pattern_name='admin:index'), name='index'),
    path('jet/', include('jet.urls', 'jet')),
    path('jet/dashboard/', include('jet.dashboard.urls', 'jet-dashboard')),
    path('admin/', admin.site.urls),
    path(
        'book-autocomplete/',
        BookAutocomplete.as_view(),
        name='book-autocomplete',
    ),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns
