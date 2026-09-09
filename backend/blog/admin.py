from django.contrib import admin
from .models import BlogPost, BlogCategory
from ckeditor.widgets import CKEditorWidget

class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'author', 'status', 'published_at')
    list_filter = ('status', 'category', 'created_at')
    search_fields = ('title', 'content')
    prepopulated_fields = {'slug': ('title',)}  # Auto-fills slug
    fieldsets = (
        ('Content', {
            'fields': ('title', 'slug', 'category', 'author', 'featured_image', 'excerpt', 'content')
        }),
        ('SEO & Meta', {
            'fields': ('meta_title', 'meta_description')
        }),
        ('Publishing', {
            'fields': ('status', 'published_at')
        }),
    )

admin.site.register(BlogPost, BlogPostAdmin)
admin.site.register(BlogCategory)