from django.contrib import admin
from django.urls import path, include
from maps import views as maps_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/points/', maps_views.points_list),
    path('api/routes/', maps_views.routes_list),
]
