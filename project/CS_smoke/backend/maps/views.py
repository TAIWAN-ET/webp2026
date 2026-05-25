import json
from django.http import JsonResponse
from .models import Point, Route


def points_list(request):
    points = Point.objects.all().values('slug', 'name', 'zone', 'x', 'y', 'note')
    return JsonResponse(list(points), safe=False)


def routes_list(request):
    routes = Route.objects.all().values('source__slug', 'target__slug', 'label', 'note')
    # rename keys
    out = []
    for r in routes:
        out.append({
            'source': r['source__slug'],
            'target': r['target__slug'],
            'label': r['label'],
            'note': r['note'],
        })
    return JsonResponse(out, safe=False)
