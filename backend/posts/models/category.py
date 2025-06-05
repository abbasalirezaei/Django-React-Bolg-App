from django.db import models
from django.utils.translation import gettext_lazy as _

class Category(models.Model):
    name = models.CharField(_("Category name"), max_length=100)
    body = models.TextField(_("Category body"), blank=True, null=True)
    img = models.ImageField(upload_to="category_image/", blank=True, null=True)

    class Meta:
        verbose_name = _("Category")
        verbose_name_plural = _("Categories")

    def __str__(self):
        return self.name
