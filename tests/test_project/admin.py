from django.contrib import admin

from .models import RelatedToTrialModel, TrialModel


class TestModelAdmin(admin.ModelAdmin):
    list_display = ('field1', 'field2')


class RelatedToTestModelAdmin(admin.ModelAdmin):
    pass


admin.site.register(TrialModel, TestModelAdmin)
admin.site.register(RelatedToTrialModel, RelatedToTestModelAdmin)
