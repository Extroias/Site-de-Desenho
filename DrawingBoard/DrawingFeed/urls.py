from django.urls import path
from . import views

urlpatterns = [
    path("", views.HomePage, name="HomePage"),
    path("Draw", views.Draw, name="Draw"),
    path("Scroll", views.Scroll, name="Scroll")
]