from django.db import models

class Artist(models.Model):
    name = models.CharField(max_length=64, unique=True)
    def __str__(self):
        return self.name

class Drawing(models.Model):
    name = models.CharField(max_length=64)
    image = models.ImageField(upload_to="drawings/")
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name='drawings')
    class Meta:
        unique_together = ('name','artist')