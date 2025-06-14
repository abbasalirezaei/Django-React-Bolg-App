from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static


from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Django React Blog App",
        default_version='v1',
        description="مستندات API برای پروژه بلاگ با جنگو و ری‌اکت",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(
            email="your_email@example.com", name="Your Name"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)


urlpatterns = [
    path('admin/', admin.site.urls),

    path('posts/', include('posts.urls')),
    path('accounts/', include('accounts.urls')),
    path('advertisements/', include('advertisements.urls')),
    path('', include('notification.urls', namespace='notifications')),
]+static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += [
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0),
         name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger',
         cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc',
         cache_timeout=0), name='schema-redoc'),
]
