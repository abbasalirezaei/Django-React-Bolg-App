from accounts.models import Follow
import pytest
from rest_framework.test import APIClient

from django.urls import reverse
from django.contrib.auth import get_user_model

User = get_user_model()

# Fixtures for reusability


@pytest.fixture
def api_client():
    """Return an API client instance."""
    return APIClient()


@pytest.fixture
def verified_active_user():
    """Create and return a verified, active user."""
    user = User.objects.create_user(
        email=f"testuser_{User.objects.count()}@example.com",
        password="StrongPass123"
    )
    user.verified = True
    user.is_active = True
    user.save()
    return user


@pytest.mark.django_db
def test_user_can_follow_another_user(api_client, verified_active_user):
    """Test that a user can follow another user."""
    from_user = verified_active_user
    to_user = User.objects.create_user(
        email="testuser2@example.com",
        password="StrongPass123"
    )
    to_user.verified = True
    to_user.is_active = True
    to_user.save()

    # Authenticate the client
    api_client.force_authenticate(user=from_user)

    # Send follow request
    # Adjust 'follow-user' to your URL name
    url = reverse("follow:follow-user", kwargs={"user_id": to_user.id})
    response = api_client.post(url)

    # Verify response
    assert response.status_code == 201
    # Adjust based on your API response
    assert response.data.get(
        "message") == "You are now following testuser2@example.com"

    # Verify database state
    assert Follow.objects.filter(from_user=from_user, to_user=to_user).exists()


@pytest.mark.django_db
def test_user_can_unfollow_another_user(api_client, verified_active_user):
    """Test that a user can unfollow another user."""

    from_user = verified_active_user
    to_user = User.objects.create_user(
        email="testuser2@example.com",
        password="StrongPass123"
    )
    # Create a follow relationship
    Follow.objects.create(from_user=from_user, to_user=to_user)

    # Authenticate the client
    api_client.force_authenticate(user=from_user)

    # send Unfollow request
    url = reverse("follow:unfollow-user", kwargs={"user_id": to_user.id})
    response = api_client.post(url)

    # Verify response
    assert response.status_code == 204
    # Verify response message
    assert response.data.get(
        "message") == "You have unfollowed testuser2@example.com"
    # Verify database state
    assert not Follow.objects.filter(
        from_user=from_user, to_user=to_user).exists()


@pytest.mark.django_db
def test_user_can_not_follow_slef(api_client, verified_active_user):
    """Test that a user cannot follow themselves."""
    from_user=verified_active_user
    to_user=verified_active_user
    # authenticate the client
    api_client.force_authenticate(user=from_user)

    # send follow request
    url=reverse("follow:follow-user",kwargs={"user_id":to_user.id})
    response=api_client.post(url)

    # verify response
    assert response.status_code==400    
    # verify response message
    assert response.data.get("error")=="You cannot follow yourself."

    # verify database state
    assert not Follow.objects.filter(from_user=from_user, to_user=to_user).exists()

