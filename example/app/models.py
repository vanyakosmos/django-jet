from django.db import models


class Author(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

    @staticmethod
    def autocomplete_search_fields():
        return 'name',


class Book(models.Model):
    title = models.CharField(max_length=255)
    authors = models.ManyToManyField(Author)
    published = models.DateTimeField()

    def __str__(self):
        return f"{self.title!r} by {self.authors_list}"

    @property
    def authors_list(self):
        authors = ', '.join(a.name for a in self.authors.all())
        return authors or 'unknown'

    @staticmethod
    def autocomplete_search_fields():
        return 'title', 'authors__name'


class Review(models.Model):
    text = models.TextField()
    book = models.ForeignKey(Book, on_delete=models.CASCADE)

    def __str__(self):
        return self.short_text

    @property
    def short_text(self):
        text = self.text[:100]
        if len(self.text) > 100:
            text += '...'
        return text

    @staticmethod
    def autocomplete_search_fields():
        return 'text',
