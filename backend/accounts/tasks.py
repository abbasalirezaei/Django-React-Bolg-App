from celery import shared_task
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.utils import timezone
from accounts.models.profiles import Profile
from rest_framework_simplejwt.tokens import RefreshToken


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return str(refresh.access_token)


@shared_task
def send_activation_email_task(user_id, email):
    from django.contrib.auth import get_user_model
    User = get_user_model()
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return "User not found"

    token = get_tokens_for_user(user)
    activation_link = f"http://localhost:8000/accounts/api/v1/activation/confirm/{token}"
    context = {"activation_link": activation_link}

    subject = "Activate Your Account"
    from_email = settings.EMAIL_HOST_USER
    text_content = f"Your account activation link:\n{activation_link}"
    html_content = render_to_string("email/activation_email.html", context)

    msg = EmailMultiAlternatives(subject, text_content, from_email, [email])
    msg.attach_alternative(html_content, "text/html")
    msg.send()


@shared_task
def deactivate_expired_premium_users():
    """
    Deactivates premium status for users whose premium membership has expired,
    and sends them an email notification.
    This task is intended to run periodically (e.g., every minute).
    """

    now = timezone.now()

    # Find all expired premium profiles
    expired_profiles = Profile.objects.filter(
        is_premium=True,
        premium_expiry__lt=now
    )

    for profile in expired_profiles:
        # Update profile
        profile.is_premium = False
        profile.premium_expiry = None
        profile.save()

        # Email content setup
        subject = "Your Premium Account Has Expired"
        from_email = settings.EMAIL_HOST_USER
        to_email = profile.user.email

        context = {
            "user": to_email
        }

        text_content = "Your account is no longer premium."
        html_content = render_to_string("email/expired_profiles.html", context)

        # Send email
        try:
            msg = EmailMultiAlternatives(
                subject, text_content, from_email, [to_email])
            msg.attach_alternative(html_content, "text/html")
            msg.send()
        except Exception as e:
            print(f"❌ Failed to send email to {to_email}: {e}")
