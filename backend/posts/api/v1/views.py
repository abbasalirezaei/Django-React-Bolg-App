from posts.models import (
    Post,
    Category,
    BlogLike,
    BlogComment,
    CommentLike,
    Author

)
from .serializers import (
    PostSerializer,
    CategorySerializer,
    LikeGetSerializer,
    LikeSerializer,
    BlogComment,
    CommentGetSerializer,
    CommentPostSerializer,
    CommentPutSerializer,
    AuthorSerializer,
    PostCreateSerializer


)
from django.db.models import Count
from .services.comment_view import create_comment
from .services.like_view import press_like_to_product
from rest_framework.views import APIView
from django.views.decorators.http import require_GET
from django.db.models import Q
# from ipware import get_client_ip
from django.db import IntegrityError
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework import generics, pagination, viewsets
from rest_framework.permissions import IsAuthenticated

from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from django.http import JsonResponse

from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
User = get_user_model()

class AuthorPostsAPIView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.request.user
        author=Author.objects.get(user=user_id)
        return Post.objects.filter(author=author)

class AuthorPostsListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = PostCreateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.request.user
        author = Author.objects.get(user=user_id)
        return Post.objects.filter(author=author)

    def perform_create(self, serializer):
        user_id = self.request.user
        author = Author.objects.get(user=user_id)
        # serializer.save(author=author)
        post = serializer.save(author=author)
        categories = self.request.data.get('categories', [])
        post.categories.set(categories)

class PostUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated] 

class PostList(generics.ListCreateAPIView):
    # queryset=Post.objects.all()
    serializer_class = PostSerializer

    def get_queryset(self):
        category = self.request.query_params.get('category', None)
        title = self.request.query_params.get('title', None)
        if category:
            queryset = Post.objects.filter(categories=category)
        elif title:
            queryset = Post.objects.filter(title__icontains=title)
        else:
            queryset = Post.objects.all()
        return queryset


class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    # permission_classes=[IsAuthenticated]
    serializer_class = PostSerializer
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
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


# popular post

class MostViewedPostsAPIView(generics.ListAPIView):
    queryset = Post.objects.filter(status=True).order_by(
        '-views')[:8]  # Query for popular posts
    serializer_class = PostSerializer


class MostLikedPostsAPIView(generics.ListAPIView):
    queryset = Post.objects.filter(status=True).annotate(
        like_count=Count('bloglike')).order_by('-like_count')[:8]
    serializer_class = PostSerializer
# Blog tags list


class TagBlogList(generics.ListCreateAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        tag = self.kwargs['tag']
        queryset = Post.objects.filter(tags__icontains=tag)
        return queryset


class LikeView(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        if kwargs:
            queryset = BlogLike.objects.filter(
                blog_item__pk=kwargs["blog_item_pk"])
            serializer = LikeGetSerializer(queryset, many=True)
        else:
            queryset = BlogLike.objects.all()
            serializer = LikeGetSerializer(queryset, many=True)

        return Response(serializer.data)

    def post(self, request, *args, **kwargs):

        user = User.objects.get(pk=int(request.data["user_id"]))
        post = Post.objects.get(pk=int(request.data["blog_item"]))
        like = BlogLike.objects.filter(user=user, blog_item=post)
        if like:
            like.like_status = "false"
            like.delete()
            msg = False
        else:
            BlogLike.objects.create(
                user=user, blog_item=post, like_status=True)
            msg = True
        return Response({"msg": msg})


@csrf_exempt
@require_GET
def search_blogs(request):
    search_query = request.GET.get('q', '')

    # Perform the search query on the Blog model
    search_results = Post.objects.filter(
        Q(title__icontains=search_query) | Q(body__icontains=search_query)
    )

    # Serialize the search results
    serialized_results = [{'title': blog.title, 'body': blog.body}
                          for blog in search_results]

    return JsonResponse(serialized_results, safe=False)

#  =========== comments views


class CommentBlogView(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):

        if kwargs:
            queryset = BlogComment.objects.filter(
                blog_item__pk=kwargs["blog_item"], parent=None
            )
            serializer = CommentGetSerializer(
                queryset, many=True, context={'request': request})
        else:
            queryset = BlogComment.objects.all()
            serializer = CommentGetSerializer(
                queryset, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = CommentPostSerializer(data=request.data)
        user = User.objects.get(pk=int(request.data["user_id"]))

        if serializer.is_valid():
            comment = create_comment(**serializer.data, user=user)
            return Response(
                CommentGetSerializer(instance=comment, context={
                                     'request': request}).data,
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        post = BlogComment.objects.get(pk=pk)
        data = {**request.data, "user": request.user.id}
        serializer = CommentPutSerializer(instance=post, data=data)
        if serializer.is_valid():
            instance = serializer.save()
            newSerializer = CommentGetSerializer(
                instance=instance, context={'request': request})
            return Response(newSerializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        post = BlogComment.objects.get(pk=pk)
        post.delete()
        return Response({"message": "Item was successfully deleted"})
# class CommentBlogView(APIView):
#     # permission_classes = [IsAuthenticated]

#     def get(self, request, *args, **kwargs):

#         if kwargs:
#             queryset = BlogComment.objects.filter(
#                 blog_item__pk=kwargs["blog_item"], parent=None
#             )
#             serializer = CommentGetSerializer(queryset, many=True)
#         else:
#             queryset = BlogComment.objects.all()
#             serializer = CommentGetSerializer(queryset, many=True)
#         return Response(serializer.data)

#     def post(self, request, *args, **kwargs):
#         serializer = CommentPostSerializer(data=request.data)
#         user=User.objects.get(pk=int(request.data["user_id"]))

#         if serializer.is_valid():
#             comment = create_comment(**serializer.data, user=user)
#             return Response(
#                 CommentGetSerializer(instance=comment).data,
#                 status=status.HTTP_201_CREATED,
#             )
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def put(self, request, pk):
#         post = BlogComment.objects.get(pk=pk)
#         data = {**request.data, "user": request.user.id}
#         serializer = CommentPutSerializer(instance=post, data=data)
#         if serializer.is_valid():
#             instance = serializer.save()
#             newSerializer = CommentGetSerializer(instance=instance)
#             return Response(newSerializer.data, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def delete(self, requset, pk):
#         post = BlogComment.objects.get(pk=pk)
#         post.delete()
#         return Response({"message": "Item was succesfully deleted"})


# class CommentLikeView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, *args, **kwargs):
#         if kwargs:
#             queryset = CommentLike.objects.filter(
#                 comment_blog_item__blog_item__pk=kwargs["comment_blog_item_pk"]
#             )
#             serializer = CommentLikeGetSerializer(queryset, many=True)
#         else:
#             queryset = CommentLike.objects.all()
#             serializer = CommentLikeGetSerializer(queryset, many=True)

#         return Response(serializer.data)

#     def post(self, request, *args, **kwargs):
#         serializer = CommentLikePostSerializer(data=request.data)
#         if serializer.is_valid():
#             like_id = press_like_to_comment(request, request.data["comment_blog_item"])
#             return Response(
#                 {**serializer.data, "like_id": like_id}, status=status.HTTP_201_CREATED
#             )
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def check_comment_like_exists(request, comment_id):
#     user = request.user
#     try:
#         CommentLike.objects.get(user=user, comment_blog_item__id=comment_id)
#         return Response({"result": True})
#     except Exception as e:
#         return Response({"result": False})


# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def get_blogs_for_user(request):
#     user = request.user
#     queryset = user.blogitem_set.all()

#     serializer = BlogSerializer(queryset, many=True)
#     return Response(serializer.data)
