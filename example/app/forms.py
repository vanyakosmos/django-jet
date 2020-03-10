from django import forms
from django.urls import reverse

from .models import Book, Review


class ReviewForm(forms.ModelForm):
    book2 = forms.ModelChoiceField(
        queryset=Book.objects.all(),
        required=False,
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['book'].url = reverse('book-autocomplete')
        self.fields['book'].widget.data = {
            'blank': True,
            'page_size': 20,
            'placeholder': None,
            'width': 'auto',
            'minimum_input_length': 0,
            'allow-clear': False,
            'delay': 250,
        }
        self.fields['book2'].autocomplete = False

    class Meta:
        model = Review
        fields = '__all__'
