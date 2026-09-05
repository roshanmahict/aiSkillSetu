from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, phone, password=None, **extra_fields):
        if not phone:
            raise ValueError('The Phone number must be set')
        # Ensure email is normalized if provided
        email = extra_fields.get('email')
        if email:
            email = self.normalize_email(email)
            extra_fields['email'] = email
        user = self.model(phone=phone, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, phone, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')  # optional
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(phone, password, **extra_fields)


class User(AbstractUser):
    ROLE_CHOICES = (
        ('worker', 'Worker'),
        ('company', 'Company'),
        ('admin', 'Admin'),
    )
    phone = models.CharField(max_length=10, unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='worker')
    email = models.EmailField(unique=True, blank=True, null=True)
    aadhaar_verified = models.BooleanField(default=False)

    # Use phone as the unique identifier for login
    USERNAME_FIELD = 'phone'
    REQUIRED_FIELDS = ['role']   # 'role' will be prompted during createsuperuser

    # Attach the custom manager
    objects = UserManager()

    def __str__(self):
        return f"{self.phone} ({self.get_role_display()})"