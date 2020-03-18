from django.contrib import admin
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType

from .models import CoreAuthor


@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    list_display = ('content_type', 'codename')


admin.site.register(CoreAuthor)
admin.site.register(ContentType)
