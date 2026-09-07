from django.db import models
from django.conf import settings
from django.contrib.postgres.fields import ArrayField
from ckeditor.fields import RichTextField
from googletrans import Translator
#from .utils import translate_to_hindi
#from django.db import models

from ckeditor.fields import RichTextField  # <-- IMPORT THIS
from django.core.exceptions import ValidationError



class Labour(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    name = models.CharField(max_length=100)
    trade = ArrayField(
        models.CharField(max_length=50),
        default=list,
        blank=True,
        help_text="List of skills/trades (e.g., Mason, Carpenter)"
    )
    location = models.CharField(max_length=100, verbose_name="City")
    phone = models.CharField(max_length=15, blank=True)
    verified = models.BooleanField(default=False)
    description = models.TextField(blank=True)
    profile_image = models.ImageField(upload_to='labour/', blank=True, null=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)

    # NEW FIELDS
    aadhaar_number = models.CharField(max_length=20, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    area = models.CharField(max_length=100, blank=True, null=True)   # locality/colony
    experience = models.IntegerField(null=True, blank=True)          # years of experience
    aadhar_image = models.ImageField(upload_to='aadhar/', blank=True, null=True)

    def __str__(self):
        return self.name


class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15, blank=True)
    subject = models.CharField(max_length=200, blank=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.name}"
class ContractorProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    company_name = models.CharField(max_length=200)
    address = models.TextField()
    state = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    requirement = models.TextField(blank=True)   # description of project requirements
    phone = models.CharField(max_length=15, blank=True)
    verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.company_name
class Company(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, related_name='company')
    company_name = models.CharField(max_length=200)
    contact_person = models.CharField(max_length=100)
    phone = models.CharField(max_length=15, blank=True)
    email = models.EmailField(blank=True)
    state = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    area = models.CharField(max_length=100, blank=True)
    requirements = models.TextField(blank=True)
    verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.company_name

    
class Banner(models.Model):
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=200, blank=True)
    image = models.ImageField(upload_to='banners/')
    link = models.URLField(blank=True)
    active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title


class MenuItem(models.Model):
    title = models.CharField(max_length=100)
    link = models.CharField(max_length=200, blank=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    icon = models.CharField(max_length=50, blank=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title




class PageContent(models.Model):
    page = models.CharField(max_length=100, unique=True)
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=300, blank=True, null=True)  # ✅ NEW FIELD
    content = RichTextField()  # <-- change from TextField to RichTextField
    image = models.ImageField(upload_to='page_images/', blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.page


class Service(models.Model):
    name_en = models.CharField(max_length=100, verbose_name="Name (English)")
    name_hi = models.CharField(max_length=100, blank=True, verbose_name="Name (Hindi)")
    description_en = models.TextField(verbose_name="Description (English)")
    description_hi = models.TextField(blank=True, verbose_name="Description (Hindi)")
    icon = models.CharField(max_length=50, blank=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    #def save(self, *args, **kwargs):
        # Auto‑translate to Hindi if Hindi fields are empty
      #  if self.name_en and not self.name_hi:
       #     self.name_hi = translate_to_hindi(self.name_en)
       # if self.description_en and not self.description_hi:
         #   self.description_hi = translate_to_hindi(self.description_en)
        #super().save(*args, **kwargs)

    #def __str__(self):
      #  return self.name_en

  

class SiteSettings(models.Model):
    # 1. For the <head> section
    head_html = models.TextField(
        blank=True,
        help_text="HTML/CSS/JS to inject inside <head> (e.g., meta tags, Google Analytics, custom CSS)."
    )

    # 2. For after the footer (<body> end)
    body_end_html = models.TextField(
        blank=True,
        help_text="HTML/JS to inject at the very bottom of the page, after the footer (e.g., LiveChat widgets)."
    )

    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.pk and SiteSettings.objects.exists():
            raise ValidationError('There can be only one SiteSettings instance.')
        super().save(*args, **kwargs)

    def __str__(self):
        return "Site Settings"
