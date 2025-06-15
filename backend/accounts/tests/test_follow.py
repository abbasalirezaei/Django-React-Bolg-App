from accounts.models import Follow
import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
User = get_user_model()


@pytest.mark.django_db
def test_user_can_follow_another_user():
    client = APIClient()
    from_user = User.objects.create_user(
        email="testuser1@example.com",
        password="StrongPass123"
    )
    from_user.verified = True
    from_user.is_active = True
    from_user.save()

    # login
    client.force_authenticate(user=from_user)

    to_user = User.objects.create_user(
        email="testuser2@example.com",
        password="StrongPass123"
    )
    to_user.verified = True
    to_user.is_active = True
    to_user.save()

    response = client.post(f"/accounts/api/v1/follow/{to_user.id}/")

    assert response.status_code == 201

@pytest.mark.django_db
def test_user_can_unfollow_another_user():
    client=APIClient()

    from_user = User.objects.create_user(
        email="testuser1@example.com",
        password="StrongPass123"
    )
    from_user.verified = True
    from_user.is_active = True
    from_user.save()
    # login
    client.force_authenticate(user=from_user)

    to_user = User.objects.create_user(
        email="testuser2@example.com",
        password="StrongPass123"
    )
    to_user.verified = True
    to_user.is_active = True
    to_user.save()
    response = client.post(f"/accounts/api/v1/follow/{to_user.id}/")
    assert response.status_code == 200