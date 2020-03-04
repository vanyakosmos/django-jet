define CREATE_SUPERUSER
from django.contrib.auth import get_user_model
User = get_user_model()
User.objects.create_superuser('admin', 'admin@example.com', 'admin')
endef
export CREATE_SUPERUSER

define DATA_MIGRATION
import random
from datetime import timedelta

from django.db import migrations
from django.utils import timezone


def make_core(apps, schema_editor):
    Author = apps.get_model('app', 'Author')
    Book = apps.get_model('app', 'Book')

    authors = [
        Author(name=f'dude #{i}')
        for i in range(100)
    ]
    Author.objects.bulk_create(authors)

    books = [
        Book(title=f'book #{i}', published=timezone.now() + timedelta(days=i))
        for i in range(100)
    ]
    Book.objects.bulk_create(books)


def connect(apps, schema_editor):
    Author = apps.get_model('app', 'Author')
    Book = apps.get_model('app', 'Book')
    Review = apps.get_model('app', 'Review')

    authors = Author.objects.all()
    books = Book.objects.all()

    reviews = []
    for book in random.choices(books, k=20):
        for i in range(random.randint(1, 3)):
            reviews.append(
                Review(book=book, text=f"foo bar {book.title} baz egg spam {i}")
            )
    Review.objects.bulk_create(reviews)

    for book in random.choices(books, k=20):
        for i in range(random.randint(1, 2)):
            a = random.choice(authors)
            book.authors.add(a)


class Migration(migrations.Migration):
    dependencies = [
        ('app', '0001_initial'),
    ]
    operations = [
        migrations.RunPython(make_core),
        migrations.RunPython(connect),
    ]
endef
export DATA_MIGRATION


clearmigrations:
	rm -f db.sqlite3
	find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
	find . -path "*/migrations/*.pyc"  -delete

fastmigrate:
	python manage.py makemigrations
	echo "$$DATA_MIGRATION" > app/migrations/0002_populate_samples.py
	python manage.py migrate

createsuperuser:
	echo "$$CREATE_SUPERUSER" | python manage.py shell

hardmigrate: clearmigrations fastmigrate createsuperuser

run:
	python manage.py runserver 0.0.0.0:8000

hardreset: hardmigrate run
