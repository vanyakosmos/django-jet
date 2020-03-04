from django.db import models


class TrialModel(models.Model):
    field1 = models.CharField(max_length=255)
    field2 = models.IntegerField()

    def __str__(self):
        return '%s%d' % (self.field1, self.field2)


class RelatedToTrialModel(models.Model):
    field = models.ForeignKey(TrialModel, on_delete=models.CASCADE)

    def __str__(self):
        return self.field


class SearchableTrialModel(models.Model):
    field1 = models.CharField(max_length=255)
    field2 = models.IntegerField()

    def __str__(self):
        return '%s%d' % (self.field1, self.field2)

    @staticmethod
    def autocomplete_search_fields():
        return 'field1',
