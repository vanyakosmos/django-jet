from django.db import models


class Sample(models.Model):
    foo = models.CharField(max_length=255, default='foo')
    bar = models.IntegerField(default=1)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"<Sample {self.foo} {self.bar}>"

    @staticmethod
    def autocomplete_search_fields():
        return 'foo', 'bar'


class Related(models.Model):
    sample = models.ForeignKey(Sample, on_delete=models.CASCADE)
    foo = models.CharField(max_length=255, default='foo')

    def __str__(self):
        return f"<Related {self.sample} {self.foo}>"

    @staticmethod
    def autocomplete_search_fields():
        return 'foo', 'sample__foo'


class DoubleRelated(models.Model):
    samples = models.ManyToManyField(Sample, blank=True)
    bar = models.CharField(max_length=255, default='bar')

    def __str__(self):
        ss = ' | '.join(map(str, self.samples.all()))
        return f"<DoubleRelated {ss!r} {self.bar}>"

    @staticmethod
    def autocomplete_search_fields():
        return 'bar',
