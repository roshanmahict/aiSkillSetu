from django.contrib import admin
from .models import Project

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'district', 'status', 'start_date')
    list_filter = ('status', 'district')
    search_fields = ('title', 'company__username')