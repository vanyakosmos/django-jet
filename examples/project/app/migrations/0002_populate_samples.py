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
