from django.urls import path

from .views import index, move_piece

urlpatterns = [
    path('', index, name='index'),
    path('api/move/', move_piece, name='move-piece'),
]
