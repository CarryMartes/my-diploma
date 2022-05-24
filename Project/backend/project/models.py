from django.db import models

from auth.models import Students, Teachers

# Create your models here.
class Subjects(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    code = models.CharField(max_length=40)

    def __str__(self) -> str:
        return self.name

class Repositories(models.Model):
    name = models.CharField(max_length=300)
    description = models.TextField()
    subject = models.ForeignKey(Subjects, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return self.name

        
class SubjectStudentRelation(models.Model):
    student = models.ForeignKey(Students, on_delete=models.CASCADE)
    repository = models.ForeignKey(Repositories, on_delete=models.CASCADE, default=0)

class SubjectTeacherRelation(models.Model):
    teacher = models.ForeignKey(Teachers, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subjects, on_delete=models.CASCADE)

