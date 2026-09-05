from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('project', 'worker', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('project__title', 'worker__username')