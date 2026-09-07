from django.db import models

from django.conf import settings

class Project(models.Model):
    company = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, limit_choices_to={'role':'company'})
    title = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=255, blank=True)   # temporary
    address = models.CharField(max_length=255)
    district = models.CharField(max_length=50)
    required_skills = models.JSONField(default=list)
    required_count = models.PositiveIntegerField(default=1)
    start_date = models.DateField()
    end_date = models.DateField()
    daily_wage = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default='open')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title