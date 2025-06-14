from django.db import models
from django.utils import timezone

class Advertisement(models.Model):
    title = models.CharField(max_length=255)
    image = models.ImageField(upload_to='ads/')
    url = models.URLField(blank=True, null=True, help_text="Target URL of the advertisement")
    active = models.BooleanField(default=True)
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField(blank=True, null=True, help_text="Expiration date of the advertisement")

    # If you want to show it only to non-premium users
    show_to_premium = models.BooleanField(default=True, help_text="Should this ad be shown to premium users?")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def is_active(self):
        now = timezone.now()
        if not self.active:
            return False
        if self.start_date and now < self.start_date:
            return False
        if self.end_date and now > self.end_date:
            return False
        return True

    def __str__(self):
        return self.title
