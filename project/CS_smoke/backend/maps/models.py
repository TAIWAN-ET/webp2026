from django.db import models


class Point(models.Model):
    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=100)
    zone = models.CharField(max_length=50, blank=True)
    x = models.FloatField(null=True, blank=True)
    y = models.FloatField(null=True, blank=True)
    note = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name} ({self.slug})"


class Route(models.Model):
    source = models.ForeignKey(Point, related_name='out_routes', on_delete=models.CASCADE)
    target = models.ForeignKey(Point, related_name='in_routes', on_delete=models.CASCADE)
    label = models.CharField(max_length=120, blank=True)
    note = models.TextField(blank=True)

    def __str__(self):
        return f"{self.source.slug} -> {self.target.slug}"
