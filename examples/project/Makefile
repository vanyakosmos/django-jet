define CREATE_SUPERUSER
from django.contrib.auth import get_user_model
User = get_user_model()
User.objects.create_superuser('admin', 'admin@example.com', 'admin')
endef
export CREATE_SUPERUSER

define DATA_MIGRATION
from django.db import migrations
def run_forward(apps, schema_editor):
    Sample = apps.get_model('app', 'Sample')
    ps = [
        Sample(foo=f'foo{i}', bar=i)
        for i in range(100)
    ]
    Sample.objects.bulk_create(ps)
class Migration(migrations.Migration):
    dependencies = [
        ('app', '0001_initial'),
    ]
    operations = [
        migrations.RunPython(run_forward)
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
