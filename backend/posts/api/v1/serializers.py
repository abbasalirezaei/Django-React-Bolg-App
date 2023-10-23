from rest_framework import serializers
from .services.comment_view import get_user_by_id

from posts.models import( 
    Post,
    Category,
    BlogLike,
    BlogComment,
    CommentLike
    )


class LikeGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogLike
        fields = "__all__"


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogLike
        fields = ("blog_item",)


class PostSerializer(serializers.ModelSerializer):
    # product_ratings=serializers.StringRelatedField(many=True,read_only=True)
    # product_imaags=ProductImagesSerializer(many=True,read_only=True)
    author = serializers.StringRelatedField(source='author.user.username')
    class Meta:
        model=Post
        fields =[
            'id','title','slug','author','body','categories','status','created_at','updated_at','img',
            'get_tag_list','views'
                    ]
        
    def __init__(self, *args, **kwargs):
        super(PostSerializer, self).__init__(*args, **kwargs)
        self.Meta.depth=1
class CategorySerializer(serializers.ModelSerializer):
 
    class Meta:
        model=Category
        fields =[
            'id','name', 'body','img'
                    ]
        
    def __init__(self, *args, **kwargs):
        super(CategorySerializer, self).__init__(*args, **kwargs)
        self.Meta.depth=1




class CommentPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogComment
        fields = "blog_item", "blog_body", "parent"


class CommentPutSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogComment
        fields = "blog_item", "blog_body", "user", "parent"


class CommentGetSerializer(serializers.ModelSerializer):

    username = serializers.SerializerMethodField("get_username")
    children_comments = serializers.SerializerMethodField("get_children_comments")

    def get_username(self, foo):
        return foo.user.username

    def get_children_comments(self, foo):

        return [
            {
                "id": el.id,
                "user_id": el.user_id,
                "blog_item_id": el.blog_item_id,
                "blog_body": el.blog_body,
                "parent_id": el.parent_id,
                "username": get_user_by_id(el.user_id).username,
            }
            for el in foo.children()
        ]

    class Meta:
        model = BlogComment
        fields = "__all__"


class CommentLikeGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentLike
        fields = "__all__"


class CommentLikePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentLike
        fields = ("comment_blog_item",)
