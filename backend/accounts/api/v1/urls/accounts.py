from django.urls import path

from .. import views

urlpatterns = [
    # register
    # registration
    path(
        "registration/",
        views.RegistrationApiView.as_view(),
        name="registration",
    ),
    # activation
    path(
        "activation/confirm/<str:token>/",
        views.ActivationAPIView.as_view(),
        name="activation-confirm",
    ),

    path("test-email/", views.TestEmail.as_view(), name="test-email"),

    # login with jwt


    # change password

    # reset password

]
