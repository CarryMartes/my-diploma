import json
from django.http import JsonResponse
from .serializers import SubjectSerializer
from .models import Repositories, SubjectStudentRelation, SubjectTeacherRelation, Subjects
from django.db.models import Q
from auth.models import Teachers,Students
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated  #new here
from rest_framework.decorators import action
from django.forms.models import model_to_dict
import requests as rqst

# Create your views here.
class SubjectsView(generics.GenericAPIView):
    permission_classes = (IsAuthenticated, )
    def get(self, request):
        teacherSubjects = SubjectTeacherRelation.objects.filter(teacher=Teachers.objects.get(user=request.user))
        subjects = []
        for teacherSub in teacherSubjects:
            subjects.append(teacherSub.subject.code)
        new_subjects = Subjects.objects.exclude(code__in=subjects)
        return JsonResponse({
            "data": list(new_subjects.values())
        })

class SingleSubjectView(generics.GenericAPIView):
    permission_classes = (IsAuthenticated, )
    def getSubject(self, pk):
        subject = Subjects.objects.get(id=pk)
        return JsonResponse({
            "subject": model_to_dict(subject),
            "students": len(SubjectStudentRelation.objects.filter(subject=subject)),
            "repositories": len(Repositories.objects.filter(subject=subject))
        })
    def get(self, request, pk):
        return self.getSubject(pk)

class UserSubjectsView(generics.GenericAPIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request): 
        if request.GET.get('status') == 'teacher':
            crt_teacher = Teachers.objects.get(user=request.user)
            teachers = SubjectTeacherRelation.objects.filter(teacher=crt_teacher)
            subjects = []
            for teacher in teachers:
                crt_subject = Subjects.objects.get(id=teacher.subject.id)
                subjects.append({
                    "subject": model_to_dict(crt_subject),
                    "students": len(SubjectStudentRelation.objects.filter(subject=crt_subject)),
                    "repositories": len(Repositories.objects.filter(subject=crt_subject))
                })
            
            return JsonResponse({
                "subjects": subjects
            })
        crt_student = Students.objects.get(user=request.user)
        students = SubjectStudentRelation.objects.filter(student=crt_student)
        subjects = []
        for teacher in students:
            subjects.append({
                "subject": model_to_dict(Subjects.objects.get(id=teacher.subject.id)),
                "repositories": len(Repositories.objects.filter(subject=crt_subject))
            })
        
        return JsonResponse({
            "subjects": subjects
        })
    def post(self, request):
        courses = request.data['courses']
        for course in courses:
            subject = Subjects.objects.get(code=course['code'])
            relation = SubjectTeacherRelation()
            relation.subject = subject
            relation.teacher = Teachers.objects.get(user=request.user)
            relation.save()
        return JsonResponse({
            "data": {}
        })

class StudentsView(generics.GenericAPIView):
    permission_classes = (IsAuthenticated, )
    def get(self, request):
        teacher = Teachers.objects.get(user=request.user)
        subjects = SubjectTeacherRelation.objects.filter(teacher=teacher)
        stud_subjects = []
        for sub in subjects:
            try:
                stud = SubjectStudentRelation.objects.get(subject=sub.subject)
                stud_subjects.append({
                    "student": model_to_dict(stud.student),
                    "user": model_to_dict(stud.student.user)
                })
            except SubjectStudentRelation.DoesNotExist:
                print("doesn't")
        return JsonResponse({"users": stud_subjects})

class StudentRepoAdd(generics.GenericAPIView):
    def post(self, request):
        subject = Subjects.objects.get(id=request.data['id'])
        student = Students.objects.get(id=request.data['stud_id'])
        student_subject = SubjectStudentRelation()
        student_subject.student = student
        student_subject.subject = subject
        student_subject.save()
        return JsonResponse({
            "message": "successfully added"
        })

class RepositoriesView(generics.GenericAPIView):
    permission_classes = (IsAuthenticated, )
    def post(self, request):
        subject = Subjects.objects.get(id=request.data['id'])
        repository = Repositories()
        repository.name = request.data['name']
        repository.description = request.data['description']
        repository.subject = subject
        repository.save()
        print(json.dumps({
            'name': request.data['name']
        }))
        res = rqst.post('https://api.github.com/orgs/diplom-project/repos', data=json.dumps({
            'name': request.data['name']
        }), auth=('CarryMartes','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'),  headers={'accept': 'application/json'})
        return JsonResponse({"message": res.json()})
    def get(self, request):
        subject = Subjects.objects.get(id=request.GET.get('id'))
        repositories = Repositories.objects.filter(subject=subject).values()
        return JsonResponse({
            "repos": list(repositories)
        })