from django.urls import path
from . import views


urlpatterns = [
    path('blogs/',views.PostList.as_view()),
    path('blog/<int:pk>/',views.PostDetail.as_view()),
    path('blogs/<str:tag>',views.TagBlogList.as_view()),

    path('categories/',views.CategoryList.as_view()),

    #Likes


    path("likes/<blog_item_pk>/", views.LikeView.as_view(), name="get_likes_for_blog"),
    path("likes/", views.LikeView.as_view(), name="get_all_likes"),
    path("likes/create/", views.LikeView.as_view(), name="create_like"),
    

    # feed
     
    path('most-viewed-posts/', views.MostViewedPostsAPIView.as_view(), name='most_viewed_posts_api'),
    path('most-liked-posts/', views.MostLikedPostsAPIView.as_view(), name='most_liked_posts_api'),


    # comments 

    path("<blog_item>/comments/", views.CommentBlogView.as_view(), name="get_blog_comments"),
    path("comments/", views.CommentBlogView.as_view(), name="get_all_comments"),
    path("comment/create/", views.CommentBlogView.as_view(), name="create_blog_comment"),


    
    # path("comment/<pk>/update/", CommentBlogView.as_view(), name="update_comment"),
    # path("comment/<pk>/delete/", CommentBlogView.as_view(), name="delete_comment"),
    
    # 
    path('search/', views.search_blogs, name='search_blogs'),


    # author list 
    path('authors-blogs/', views.AuthorPostsAPIView.as_view()),
]
