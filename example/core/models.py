from app.models import Author


class CoreAuthor(Author):
    class Meta:
        proxy = True
