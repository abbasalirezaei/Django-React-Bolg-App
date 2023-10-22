from rest_framework import serializers
from posts.models import Post,Category 

# class PostLikeSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = PostLike
#         fields = '__all__'


class PostSerializer(serializers.ModelSerializer):
    # product_ratings=serializers.StringRelatedField(many=True,read_only=True)
    # product_imaags=ProductImagesSerializer(many=True,read_only=True)
    author = serializers.StringRelatedField(source='author.user.username')
    class Meta:
        model=Post
        fields =[
            'id','title','slug','author','body','categories','status','created_at','updated_at','img','get_tag_list'
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

