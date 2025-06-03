from django.db import models
from django.utils.translation import gettext_lazy as _

class Tag(models.Model):
    name = models.CharField(_("Tag name"), max_length=30, unique=True)

    class Meta:
        db_table = 'Tags'
        managed = True
        verbose_name = _('Tag')
        verbose_name_plural = _('Tags')

    def __str__(self):
        return self.name
