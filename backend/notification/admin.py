from django.contrib import admin
from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'notification_type',
        'actor',
        'recipient',
        'post',
        'read',
        'created_at',
    )
    list_filter = ('notification_type', 'read', 'created_at')
    search_fields = ('actor__email', 'recipient__email', 'post__title')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
    list_editable = ('read',)
    fieldsets = (
        (None, {
            'fields': (
                'notification_type',
                'actor',
                'recipient',
                'post',
                'read'
            )
        }),
        ('Timestamps', {
            'fields': (
                'created_at',
                'updated_at'
            )
        }),
    )

    def get_queryset(self, request):
        """
        Customize the queryset to use select_related for optimization.
        """
        return super().get_queryset(request).select_related('actor', 'recipient', 'post')

    def has_add_permission(self, request):
        """
        Disable manual addition from admin panel.
        """
        return False

    def has_change_permission(self, request, obj=None):
        """
        Allow marking as read, but no full editing.
        """
        return True

    def has_delete_permission(self, request, obj=None):
        """
        Allow deletion if necessary.
        """
        return True
