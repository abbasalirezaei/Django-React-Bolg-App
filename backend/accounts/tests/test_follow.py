
from rest_framework.test import APIClient


from django.urls import reverse
from django.contrib.auth import get_user_model

import pytest


from .conftest import api_client, verified_active_user
from .factories import UserFactory
from accounts.models import Follow
User = get_user_model()


@pytest.mark.django_db
def test_unauthenticated_user_cannot_follow(api_client, verified_active_user):
    """Test that unauthenticated users cannot follow."""
    to_user = verified_active_user
    url = reverse("follow:follow-user", kwargs={"user_id": to_user.id})
    response = api_client.post(url)
    assert response.status_code == 401
    assert response.data.get(
        "detail") == "Authentication credentials were not provided."


@pytest.mark.django_db
def test_user_can_follow_another_user(api_client, verified_active_user):
    """Test that a user can follow another user."""
    from_user = verified_active_user
    to_user = UserFactory()

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
        "message") == f"You are now following {to_user.email}"

    # Verify database state
    assert Follow.objects.filter(from_user=from_user, to_user=to_user).exists()


@pytest.mark.django_db
def test_user_can_unfollow_another_user(api_client, verified_active_user):
    """Test that a user can unfollow another user."""

    from_user = verified_active_user
    to_user = UserFactory()

    # Authenticate the client
    api_client.force_authenticate(user=from_user)

    # Create a follow relationship
    Follow.objects.create(from_user=from_user, to_user=to_user)

    # send Unfollow request
    url = reverse("follow:unfollow-user", kwargs={"user_id": to_user.id})
    response = api_client.post(url)

    # Verify response
    assert response.status_code == 204
    # Verify response message
    assert response.data.get(
        "message") == f"You have unfollowed {to_user.email}"
    # Verify database state
    assert not Follow.objects.filter(
        from_user=from_user, to_user=to_user).exists()


@pytest.mark.django_db
def test_user_can_not_follow_self(api_client, verified_active_user):
    """Test that a user cannot follow themselves."""
    from_user = verified_active_user
    to_user = verified_active_user
    # authenticate the client
    api_client.force_authenticate(user=from_user)

    # send follow request
    url = reverse("follow:follow-user", kwargs={"user_id": to_user.id})
    response = api_client.post(url)

    # verify response
    assert response.status_code == 400
    # verify response message
    assert response.data.get("error") == "You cannot follow yourself."

    # verify database state
    assert not Follow.objects.filter(
        from_user=from_user, to_user=to_user).exists()


@pytest.mark.django_db
def test_user_cannot_follow_inactive_user(api_client, verified_active_user):
    """Test that a user cannot follow an inactive user."""
    from_user = verified_active_user
    to_user = UserFactory()
    to_user.is_active = False
    to_user.save()

    api_client.force_authenticate(user=from_user)

    url = reverse("follow:follow-user", kwargs={"user_id": to_user.id})
    response = api_client.post(url)

    assert response.status_code == 400
    assert "User is not active yet." in response.data.get("error", "")
    assert not Follow.objects.filter(
        from_user=from_user, to_user=to_user).exists()


@pytest.mark.django_db
def test_user_can_not_follow_non_exist_user(api_client, verified_active_user):
    """Test that a user cannot follow a non exist user."""
    from_user = verified_active_user

    # Authenticate the client
    api_client.force_authenticate(user=from_user)

    # Send follow request
    url = reverse("follow:follow-user", kwargs={"user_id": 1000})
    response = api_client.post(url)

    # Verify response
    assert response.status_code == 404
    # Verify response message
    assert response.data.get("error") == "User not found."


@pytest.mark.django_db
def test_user_cannot_follow_twice(api_client, verified_active_user):
    """Test that a user cannot follow the same user twice."""
    from_user = verified_active_user
    to_user = UserFactory()
    Follow.objects.create(from_user=from_user, to_user=to_user)

    api_client.force_authenticate(user=from_user)
    url = reverse("follow:follow-user", kwargs={"user_id": to_user.id})
    response = api_client.post(url)

    assert response.status_code == 400
    assert Follow.objects.filter(
        from_user=from_user, to_user=to_user).count() == 1
