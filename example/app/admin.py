from django.contrib import admin

from jet.admin import CompactInline
from jet.filters import RelatedFieldAjaxListFilter
from .models import Author, Book, Review


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('name',)
    list_per_page = 5


class AuthorInline(admin.StackedInline):
    model = Book.authors.through
    extra = 0
    show_change_link = True


class ReviewInline(CompactInline):
    model = Review
    extra = 0
    show_change_link = True


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'published', 'authors_list', 'reviews')
    list_filter = ('authors',)
    inlines = (AuthorInline, ReviewInline)
    list_per_page = 5
    readonly_fields = ('authors',)

    def reviews(self, book: Book):
        return book.review_set.count()


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('short_text',)
    list_filter = (
        ('book', RelatedFieldAjaxListFilter),
    )
    list_per_page = 5
