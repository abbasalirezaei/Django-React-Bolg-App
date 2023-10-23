from rest_framework import generics, pagination,viewsets
from rest_framework.permissions import IsAuthenticated

from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from django.http import JsonResponse

from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.contrib.auth import get_user_model
User = get_user_model()
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from django.db import IntegrityError
from ipware import get_client_ip


from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .services.like_view import press_like_to_product
from django.db.models import Count
from .serializers import (
   PostSerializer,
   CategorySerializer,
   LikeGetSerializer,
   LikeSerializer,
   
)

from posts.models import (
    Post,
    Category,
    BlogLike

)

class PostList(generics.ListCreateAPIView):
    # queryset=Post.objects.all()
    serializer_class=PostSerializer
    def get_queryset(self):
        category = self.request.query_params.get('category', None)
        if category:
            queryset = Post.objects.filter(categories=category)
        else:
            queryset = Post.objects.all()
        return queryset
class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset=Post.objects.all()
    # permission_classes=[IsAuthenticated]
    serializer_class=PostSerializer
    lookup_field = 'pk'
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.increase_views()
        """
        when deply it in a host you can increse by evey ip
        """
        # Get the user's IP address
        # ip_address, _ = get_client_ip(request)


        # if ip_address:  # If IP is detected
        #     instance.increment_views(ip_address)  # Call the increment_views method

        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class CategoryList(generics.ListCreateAPIView):
    queryset=Category.objects.all()
    # permission_classes=[IsAuthenticated]
    serializer_class=CategorySerializer


# popular post

class MostViewedPostsAPIView(generics.ListAPIView):
    queryset = Post.objects.filter(status=True).order_by('-views')[:8]  # Query for popular posts
    serializer_class = PostSerializer

class MostLikedPostsAPIView(generics.ListAPIView):
    queryset = Post.objects.filter(status=True).annotate(like_count=Count('bloglike')).order_by('-like_count')[:8]
    serializer_class = PostSerializer
# Blog tags list  
class TagBlogList(generics.ListCreateAPIView):
    serializer_class=PostSerializer
    def get_queryset(self):
        tag=self.kwargs['tag']
        queryset = Post.objects.filter(tags__icontains=tag)
        return queryset



class LikeView(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        if kwargs:
            queryset = BlogLike.objects.filter(blog_item__pk=kwargs["blog_item_pk"])
            serializer = LikeGetSerializer(queryset, many=True)
        else:
            queryset = BlogLike.objects.all()
            serializer = LikeGetSerializer(queryset, many=True)

        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        
      
        user=User.objects.get(pk=int(request.data["user_id"]))
        post=Post.objects.get(pk=int(request.data["blog_item"]))
        like = BlogLike.objects.filter(user=user, blog_item=post)
        if like:
            like.like_status="false"
            like.delete()
            msg=False
        else:
            BlogLike.objects.create(user=user ,blog_item=post,like_status=True)  
            msg=True
        return Response({"msg":msg})
 