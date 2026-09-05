# accounts/backends.py
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q

User = get_user_model()

class EmailOrPhoneBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        if username is None:
            return None
        try:
            user = User.objects.get(Q(phone=username) | Q(email=username))
            if user.check_password(password):
                return user
        except User.DoesNotExist:
            return None