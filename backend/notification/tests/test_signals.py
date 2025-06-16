import pytest
from .conftest import api_client,verified_active_user
from .factories import UserFactory
from accounts.models import Follow
from notification.models import Notification

@pytest.mark.django_db
def test_create_follow_notification_signal():
    from_user = UserFactory()
    to_user = UserFactory()

    follow = Follow.objects.create(from_user=from_user, to_user=to_user)

    notification_exists = Notification.objects.filter(
        recipient=to_user,
        actor=from_user,
        notification_type='FOLLOW'
    ).exists()

    assert notification_exists
