from .views import RepositoriesView, SingleSubjectView, StudentsView, SubjectsView,UserSubjectsView, StudentRepoAdd,AllRepostoriesView
from django.urls import path

urlpatterns = [
    path('subjects/', SubjectsView.as_view(), name='subjects'),
    path('user_subjects/', UserSubjectsView.as_view(), name='user_subjects'),
    path('subjects/<int:pk>', SingleSubjectView.as_view(), name='single_subject'),
    path('students/', StudentsView.as_view(), name='student_view'),
    path('all_students/', StudentRepoAdd.as_view(), name='student_repo_add'),
    path('repositories/', RepositoriesView.as_view(), name='repo_view'),
    path('all_repos/', AllRepostoriesView.as_view(), name='AllRepostoriesView')
]