from django.contrib import admin
from .models import Labour, ContactMessage, Banner, PageContent, Service, MenuItem
from .models import SiteSettings



@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    fieldsets = (
        ('Head Section (<head>)', {'fields': ('head_html',), 'classes': ('wide',)}),
        ('Body End (After Footer)', {'fields': ('body_end_html',), 'classes': ('wide',)}),
    )
    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()
@admin.register(Labour)
class LabourAdmin(admin.ModelAdmin):
    list_display = ('name', 'trade', 'location', 'verified')
    search_fields = ('name', 'trade', 'location')
    list_filter = ('trade', 'verified')

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'created_at')
    readonly_fields = ('created_at',)

@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ('title', 'active', 'order')
    list_editable = ('active', 'order')

@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'link', 'parent', 'order', 'is_active', 'icon')
    list_filter = ('is_active', 'parent')
    search_fields = ('title', 'link')
    list_editable = ('order', 'is_active')

@admin.register(PageContent)
class PageContentAdmin(admin.ModelAdmin):
    # No override needed – RichTextField automatically uses CKEditor
    list_display = ('page', 'title', 'updated_at')
    search_fields = ('page', 'title')
    fields = ('page', 'title', 'subtitle', 'content', 'image', 'updated_at')  # ✅ ADD subtitle
    readonly_fields = ('updated_at',)

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name_en', 'name_hi', 'icon', 'order', 'is_active')
    list_editable = ('order', 'is_active')
    search_fields = ('name_en', 'name_hi')