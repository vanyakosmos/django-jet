from django.contrib import admin

from jet.admin import CompactInline
from jet.filters import RelatedFieldAjaxListFilter
from .models import DoubleRelated, Related, Sample


class RelatedInline(admin.StackedInline):
    model = Related
    extra = 0
    show_change_link = True


class DoubleRelatedInline(CompactInline):
    model = DoubleRelated.samples.through
    extra = 0
    show_change_link = True


@admin.register(Sample)
class SampleAdmin(admin.ModelAdmin):
    inlines = (RelatedInline, DoubleRelatedInline)
    # list_filter = (('created', DateRangeFilter),)
    list_per_page = 5


@admin.register(Related)
class RelatedAdmin(admin.ModelAdmin):
    list_filter = (
        ('sample', RelatedFieldAjaxListFilter),
    )


@admin.register(DoubleRelated)
class DoubleRelatedAdmin(admin.ModelAdmin):
    pass
