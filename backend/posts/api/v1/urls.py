from django.urls import path
from . import views


urlpatterns = [
    path('blogs/',views.PostList.as_view()),
    path('blog/<int:pk>/',views.PostDetail.as_view()),
    path('blogs/<str:tag>',views.TagBlogList.as_view()),

    path('categories/',views.CategoryList.as_view()),


]