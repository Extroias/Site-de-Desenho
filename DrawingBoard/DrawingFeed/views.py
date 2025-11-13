import re
import base64
from django.core.files.base import ContentFile
from django.shortcuts import render
from django.http import HttpRequest
from django.http import HttpResponse
from django.core.paginator import Paginator
from .models import Artist, Drawing

def Draw(request : HttpRequest):
    if(request.method == "GET"):
        dimensions = request.GET["dimensão"].split("x")
        x = dimensions[0]
        y = dimensions[1]
        nome = request.GET["nome"]
        obra = request.GET["obra"]
        art = Artist.objects.get(name=nome)
        try:
            d = Drawing.objects.get(artist=art, name=obra)
        except:
            d = False
        return render(request, "DrawingFeed/Drawing.html", {"nome": nome, "obra": obra, "x": x, "y": y, "Drawing": d})
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
    elif(request.method == "DELETE"):
        obra = request.GET["obra"]
        nome = request.GET["nome"]
        art = Artist.objects.get(name=nome)
        Drawing.objects.get(artist=art, name=obra).delete()
        return HttpResponse("")

def HomePage(request : HttpRequest):
    if(request.method == "POST"):
        nome = request.POST["nome"]
        art,created = Artist.objects.get_or_create(name=nome)
        art.save()
        return render(request, "DrawingFeed/HomePageLogged.html", {"nome": nome})
    elif(request.method == "GET"):
        nome = request.GET.get("nome")
        if(nome != None): return render(request, "DrawingFeed/HomePageLogged.html", {"nome": nome})
    elif(request.method == "PUT"):
        nome = request.GET.get("nome")
        novonome = request.headers["HX-Prompt"]
        art = Artist.objects.get(name=nome)
        art.name = novonome
        art.save()
        return render(request, "DrawingFeed/HomePageLogged.html", {"nome": novonome})
    elif(request.method == "DELETE"):
        nome = request.GET.get("nome")
        Artist.objects.get(name=nome).delete()
    return render(request, "DrawingFeed/HomePage.html")

def Scroll(request : HttpRequest):
    if(not Drawing.objects.all().exists()): return HttpResponse("")
    pg = Paginator(Drawing.objects.all(), 2)
    pgnum = int(request.GET.get("page"))
    nome = request.GET.get("nome")
    if(pgnum == None or pgnum == pg.num_pages + 1): pgnum = 1
    return render(request, "DrawingFeed/Scroll.html", {"drawings" : pg.get_page(pgnum),
                                                       "page": pgnum,
                                                       "nome": nome})