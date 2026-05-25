from django.contrib import admin
from .models import Point, Route


@admin.register(Point)
class PointAdmin(admin.ModelAdmin):
    list_display = ('slug', 'name', 'zone', 'x', 'y')
    search_fields = ('slug', 'name')


@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):
    list_display = ('source', 'target', 'label')
    search_fields = ('source__slug', 'target__slug', 'label')
