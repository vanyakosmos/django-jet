from django.contrib import admin
from django.urls import reverse_lazy

from jet.admin import CompactInline
from jet.filters import RelatedFieldAjaxListFilter
from .forms import ReviewForm
from .models import Author, Book, Review


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('name', 'has_books')
    list_per_page = 5

    def has_books(self, a: Author):
        return a.book_set.exists()

    has_books.boolean = True


class AuthorInline(admin.StackedInline):
    model = Book.authors.through
    extra = 0
    show_change_link = True
    classes = ('follow',)


class ReviewInline(CompactInline):
    model = Review
    extra = 0
    show_change_link = True
    classes = ('follow',)


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'published', 'authors_list', 'reviews')
    list_filter = ('authors',)
    inlines = (AuthorInline, ReviewInline)
    list_per_page = 5
    readonly_fields = ('authors_list',)
    exclude = ('authors',)
    fieldsets = (
        (None, {'fields': ('title',)}),
        ("Dates", {'fields': ('published',), 'classes': ('follow',)}),
        ("Authors", {'fields': ('authors_list',)}),
    )

    def reviews(self, book: Book):
        return book.review_set.count()


class BookFilter(RelatedFieldAjaxListFilter):
    url = reverse_lazy('book-autocomplete')


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('short_text',)
    list_filter = (
        'text',
        ('book', BookFilter),
    )
    list_per_page = 5
    form = ReviewForm
