from dal_select2.views import Select2QuerySetView

from .models import Book


class BookAutocomplete(Select2QuerySetView):
    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return Book.objects.none()

        qs = Book.objects.all()

        if self.q:
            qs = qs.filter(title__icontains=self.q)

        return qs
