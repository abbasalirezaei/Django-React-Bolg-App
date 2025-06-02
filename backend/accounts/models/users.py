from django.db import models
from django.contrib.auth.models import AbstractUser
from .profiles import Profile

class User(AbstractUser):
    ROLE_CHOICES = (
        ('author', 'Author'),
        ('reader', 'Reader'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    username = None  # Remove default username
    email = models.EmailField(unique=True)
    
    verified = models.BooleanField(default=False)
    is_online = models.BooleanField(default=False)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []


    class Meta:
        db_table = 'Users'
        managed = True
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    @property
    def profile_or_none(self):
        try:
            return self.profile
        except Profile.DoesNotExist:
            return None