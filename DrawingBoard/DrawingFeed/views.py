import re
import base64
from django.core.files.base import ContentFile
from django.shortcuts import render
from django.http import HttpRequest
from django.http import HttpResponse
from .models import Artist, Drawing

def Draw(request : HttpRequest):
    if(request.method == "GET"):
        dimensions = request.GET["dimensão"].split("x")
        x = dimensions[0]
        y = dimensions[1]
        nome = request.GET["nome"]
        obra = request.GET["obra"]
        return render(request, "DrawingFeed/Drawing.html", {"nome": nome, "obra": obra, "x": x, "y": y})
    elif(request.method == "POST"):
        nome = request.POST["artist"]
        art = Artist.objects.get(name=nome)

        obra = request.POST["nome"]
        drawing, created = Drawing.objects.get_or_create(artist=art, name=obra)

        data = request.POST["drawing"]
        base64_data = re.sub(r'^data:image/.+;base64,', '', data)
        file = ContentFile(base64.b64decode(base64_data), obra+".png")

        drawing.image.delete()
        drawing.image = file
        drawing.save()

        return HttpResponse("Salvo!")
    

def HomePage(request : HttpRequest):
    if(request.method == "POST"):
        nome = request.POST["nome"]
        art,created = Artist.objects.get_or_create(name=nome)
        art.save()
        return render(request, "DrawingFeed/HomePageLogged.html", {"nome": nome,})
    elif(request.method == "GET"):
        nome = request.GET.get("nome")
        if(nome == None): return render(request, "DrawingFeed/HomePage.html")
        else: return render(request, "DrawingFeed/HomePageLogged.html", {"nome": nome,})
    else: return render(request, "DrawingFeed/HomePage.html")
