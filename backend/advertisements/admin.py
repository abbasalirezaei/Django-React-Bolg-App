from django.contrib import admin
from .models import Ad

@admin.register(Ad)
class AdAdmin(admin.ModelAdmin):
    list_display = ('title', 'active', 'start_date', 'end_date', 'show_to_premium')
    list_filter = ('active', 'show_to_premium')
    search_fields = ('title',)