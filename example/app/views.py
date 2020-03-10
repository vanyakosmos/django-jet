from jet.views import ModelLookupView
from .models import Book


class BookAutocomplete(ModelLookupView):
    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return Book.objects.none()

        qs = Book.objects.all()

        if self.q:
            qs = qs.filter(title__icontains=self.q)

        return qs
