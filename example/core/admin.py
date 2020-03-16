from django.contrib import admin

from app.models import Author


class CoreAuthor(Author):
    class Meta:
        proxy = True


admin.site.register(CoreAuthor)
