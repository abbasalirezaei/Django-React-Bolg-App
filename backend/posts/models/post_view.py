from django.db import models
from django.utils.translation import gettext_lazy as _



class PostView(models.Model):
    post = models.ForeignKey("Post", on_delete=models.CASCADE, related_name="view_records", verbose_name=_("Post"))
    ip_address = models.GenericIPAddressField(_("IP Address"))
    created_at = models.DateTimeField(_("Viewed at"), auto_now_add=True)

    class Meta:
        unique_together = ('post', 'ip_address')
        verbose_name = _("Post view")
        verbose_name_plural = _("Post views")

    def __str__(self):
        return f"{self.ip_address} viewed {self.post.title}"
