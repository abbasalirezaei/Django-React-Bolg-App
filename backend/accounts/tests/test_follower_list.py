from django.urls import reverse
from accounts.models import Follow
from .factories import UserFactory
from .conftest import api_client, verified_active_user
import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.mark.django_db
def test_follower_list_success(api_client, verified_active_user):
    """Test retrieving the list of followers for a user."""
    user = verified_active_user
    follower1 = UserFactory()
    follower2 = UserFactory()
    Follow.objects.create(from_user=follower1, to_user=user)
    Follow.objects.create(from_user=follower2, to_user=user)

    api_client.force_authenticate(user=user)
    url = reverse("follow:followers-list", kwargs={"user_id": user.id})
    response = api_client.get(url)

    assert response.status_code == 200
    assert len(response.data) == 2
    assert response.data[0]["from_user"] in [follower1.email, follower2.email]
    assert response.data[1]["from_user"] in [follower1.email, follower2.email]

@pytest.mark.django_db
def test_follower_list_empty(api_client, verified_active_user):
    """Test that the follower list is empty when there are no followers."""
    user = verified_active_user
    api_client.force_authenticate(user=user)
    url = reverse("follow:followers-list", kwargs={"user_id": user.id})
    response = api_client.get(url)

    assert response.status_code == 200
    assert response.data == []

@pytest.mark.django_db
def test_follower_list_nonexistent_user(api_client, verified_active_user):
    """Test requesting the follower list for a non-existent user."""
    user = verified_active_user
    api_client.force_authenticate(user=user)
    url = reverse("follow:followers-list", kwargs={"user_id": 9999})
    response = api_client.get(url)

    assert response.status_code == 404
    assert "not found" in response.data.get("error", "").lower()

@pytest.mark.django_db
def test_follower_list_unauthenticated(api_client, verified_active_user):
    """Test accessing the follower list without authentication."""
    url = reverse("follow:followers-list", kwargs={"user_id": verified_active_user.id})
    response = api_client.get(url)

    assert response.status_code == 401  # or 403 depending on access policy
    assert response.data.get("detail") == "Authentication credentials were not provided." 
'''
@pytest.mark.django_db
def test_follower_list_excludes_inactive_users(api_client, verified_active_user):
    """Test that inactive users are excluded from the follower list."""
    user = verified_active_user
    inactive_follower = UserFactory()
    inactive_follower.is_active = False
    inactive_follower.save()    
    Follow.objects.create(from_user=inactive_follower, to_user=user)

    api_client.force_authenticate(user=user)
    url = reverse("follow:followers-list", kwargs={"user_id": user.id})
    response = api_client.get(url)

    assert response.status_code == 200
    assert len(response.data) == 0  # inactive users are excluded

@pytest.mark.django_db
def test_follower_list_excludes_unverified_users(api_client, verified_active_user):
    """Test that unverified users are excluded from the follower list."""
    user = verified_active_user
    unverified_user = UserFactory()
    unverified_user.verified = False
    unverified_user.save()
    Follow.objects.create(from_user=unverified_user, to_user=user)

    api_client.force_authenticate(user=user)
    url = reverse("follow:followers-list", kwargs={"user_id": user.id})
    response = api_client.get(url)

    assert response.status_code == 200
    assert len(response.data) == 0  # unverified users are excluded
    '''