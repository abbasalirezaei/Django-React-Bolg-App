from django.contrib.auth.password_validation import validate_password

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import User,Profile

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model=User
		fields=['id','username','email']

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('image', 'full_name', 'bio', 'verified')


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
	@classmethod
	def get_token(cls,user):
		token=super().get_token(user)

		token['full_name']=user.profile.full_name
		token['bio']=user.profile.bio
		token['image']=str(user.profile.image)
		token['verified']=user.profile.verified

		token['email']=user.email
		token['username']=user.username

		return token

class RegisterSerializer(serializers.ModelSerializer):
	password = serializers.CharField(write_only=True,
		required=True, validators=[validate_password])
	password2 = serializers.CharField(write_only=True,
		required=True)

	class Meta:
		model=User
		fields=['username','email','password','password2']

	def validate(self,attrs):
		if attrs['password']!=attrs['password2']:
			raise serializers.ValidationError(
				{"password":"password fields didn't match."}
				)				
		return attrs

	def create(self,validated_data):
		user =User.objects.create(
			username=validated_data['username'],
			email=validated_data['email']
			)
		user.set_password(validated_data['password'])
		user.save()
		return user