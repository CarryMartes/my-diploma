from django.db import models
from django.contrib.auth.models import User

class Students(models.Model):
    stud_id = models.CharField(max_length=200)
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, default='kask')
    nickname = models.CharField(max_length=200, default="Hi")
    def __str__(self) -> str:
        return self.nickname
    
class Teachers(models.Model):
    subject = models.CharField(max_length=200)
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, default="Ms")
    nickname = models.CharField(max_length=200, default="Hi")
    rating = models.IntegerField(default=5)

    def __str__(self) -> str:
        return self.nickname