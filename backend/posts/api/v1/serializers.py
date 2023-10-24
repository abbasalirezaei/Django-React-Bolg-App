from rest_framework import serializers
from .services.comment_view import get_user_by_id
from api.models import Profile
from api.serializers import ProfileSerializer
from posts.models import( 
    Post,
    Category,
    BlogLike,
    BlogComment,
    CommentLike,
    Author
    )

class AuthorSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username')
    profile_image = serializers.SerializerMethodField()

    class Meta:
        model = Author
        fields = ['user_name', 'profile_image']

    def get_profile_image(self, obj):
        request = self.context.get('request')
        if obj.user.profile.image:
            return request.build_absolute_uri(obj.user.profile.image.url)
        return None

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return {
            'user_name': representation['user_name'],
            'profile_image': representation['profile_image'],
        }
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
    author = AuthorSerializer()
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
    profile = serializers.SerializerMethodField("get_profile")
    def get_username(self, foo):
        return foo.user.username
    
    def get_profile(self, foo):
        profile = foo.user.profile
        request = self.context.get('request')
        image_url = profile.image.url if profile.image else None

        if image_url and request:
            image_url = request.build_absolute_uri(image_url)

        return {
            "full_name": profile.full_name,
            "bio": profile.bio,
            "image": image_url,
            "verified": profile.verified,
        }
        
    def get_children_comments(self, foo):
        request = self.context.get('request')
        return [
            {
                "id": el.id,
                "user_id": el.user_id,
                "blog_item_id": el.blog_item_id,
                "blog_body": el.blog_body,
                "parent_id": el.parent_id,
                "username": get_user_by_id(el.user_id).username,
                "profile_image": request.build_absolute_uri(get_user_by_id(el.user_id).profile.image.url) if get_user_by_id(el.user_id).profile.image else None,
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
