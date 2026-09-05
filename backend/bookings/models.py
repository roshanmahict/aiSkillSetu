from django.db import models
from django.conf import settings

class Booking(models.Model):
    project = models.ForeignKey('projects.Project', on_delete=models.CASCADE)
    worker = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, limit_choices_to={'role':'worker'})
    status = models.CharField(max_length=20, default='pending')
    travel_organized = models.BooleanField(default=False)
    travel_details = models.JSONField(null=True, blank=True)
    check_in = models.DateTimeField(null=True, blank=True)
    check_out = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.worker.username} – {self.project.title}"