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
            "students": len(SubjectStudentRelation.objects.filter(repository__in=Repositories.objects.filter(subject=subject))),
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
                    "students": len(SubjectStudentRelation.objects.filter(repository__in=Repositories.objects.filter(subject=crt_subject))),
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
                repos = Repositories.objects.filter(subject=sub.subject)
                for repo in repos:
                    stud = SubjectStudentRelation.objects.filter(repository=repo)
                    for student in stud:
                        stud_subjects.append({
                            "student": model_to_dict(student.student),
                            "user": model_to_dict(student.student.user)
                        })
            except SubjectStudentRelation.DoesNotExist:
                pass
        return JsonResponse({"users": stud_subjects})

class StudentRepoAdd(generics.GenericAPIView):
    permission_classes = (IsAuthenticated, )
    def get(self, request):
        teacher = Teachers.objects.get(user=request.user)
        subjects = SubjectTeacherRelation.objects.filter(teacher=teacher)
        stud_subjects = []
        for sub in subjects:
            try:
                repos = Repositories.objects.filter(subject=sub.subject)
                for repo in repos:
                    stud = SubjectStudentRelation.objects.filter(repository=repo)
                    for student in stud:
                        stud_subjects.append(student.student.user)
            except SubjectStudentRelation.DoesNotExist:
                pass
        students = Students.objects.exclude(user__in=stud_subjects)
        return JsonResponse({"students": list( students.values())})
    def post(self, request):
        students = request.data['students']
        repositories = request.data['repositories']
        print(students, repositories)
        for student in students:
            for repository in repositories:
                crt_repo = Repositories.objects.get(id=repository['id'])
                crt_student = Students.objects.get(stud_id=student['stud_id'])
                student_subject = SubjectStudentRelation()
                student_subject.student = crt_student
                student_subject.repository = crt_repo
                invitation = rqst.post('https://api.github.com/repos/diplom-project/' + repository['name'] + '/collaborators/' + crt_student.user.username,
                    data=json.dumps({
                        'email': crt_student.user.email
                    }), auth=('CarryMartes','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'),  headers={'accept': 'application/json'})
                print(invitation.json())
                # student_subject.save()
                
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

class AllRepostoriesView(generics.GenericAPIView):
    permission_classes = (IsAuthenticated, )
    def get(self, request):
        subjects = SubjectTeacherRelation.objects.filter(teacher=Teachers.objects.get(user=request.user))
        new_subjects = []
        for i in subjects:
            new_subjects.append(i.subject)
        return JsonResponse({
            "repos": list(Repositories.objects.filter(subject__in=new_subjects).values())
        })