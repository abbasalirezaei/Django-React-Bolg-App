from django.urls import path

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from . import views


urlpatterns = [
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('register/', views.RegisterView.as_view(), name='auth_register'),

    
    path('register/author/', views.RegisterAuthorView.as_view(), name='auth_register_author'),
    path('test/', views.testEndPoint, name='test'),
    path('', views.getRoutes),
]