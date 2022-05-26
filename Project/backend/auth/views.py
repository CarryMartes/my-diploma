from django.http import JsonResponse
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated  #new here
import requests
from rest_framework import status
from .models import Students, Teachers
from .serializers import LogoutSerializer, RegisterSerializer, UserSerializer
from django.forms.models import model_to_dict
from django.views.generic import TemplateView

def register(request):
    serializer = UserSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    return Response({
        "message": 'User created'
    })

class LogoutAPIView(generics.GenericAPIView):
    serializer_class = LogoutSerializer

    permission_classes = (IsAuthenticated,)

    def post(self, request):

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(status=status.HTTP_204_NO_CONTENT)

class UserProfile(generics.GenericAPIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request):
        try:
            teacher = Teachers.objects.get(user=request.user)
            if teacher is not None:
                return JsonResponse({
                    "nickname": teacher.nickname,
                    "email": request.user.email,
                    "status": "teacher"
                })    
        except Teachers.DoesNotExist:
            student = Students.objects.get(user=request.user)
            return JsonResponse({
                "nickname": student.nickname,
                "email": request.user.email,
                "status": "student"
            })
        return Response(status=status.HTTP_204_NO_CONTENT)

class RegisterApi(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    def post(self, request, *args,  **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        if 'status' in request.data: 
            if request.data['status'] == 'student':
                student = Students()
                student.user = user
                student.nickname = user.username
                student.stud_id = '19'
                student.save()
            else:
                teacher = Teachers()
                teacher.user = user
                teacher.nickname = user.username
                teacher.save()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "message": "User Created Successfully.  Now perform Login",
        })

# token: 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
def getUsersList(request):
    username = request.GET['username']
    response = requests.get("https://api.github.com/users/" + username, auth=('CarryMartes','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'))
    return JsonResponse(response.json())

class Home(TemplateView):
    template_name = "home.html"