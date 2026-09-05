"""
URL configuration for aiskillsetu project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from core.views import ConfirmPasswordReset, RequestPasswordResetEmail, WorkerProfileView, MenuView, MenuItemDetailView,PageContentView, ServiceListView,ContactView,RegisterView, LoginView
from django.contrib.auth import views as auth_views
from django.conf.urls.static import static
from django.conf import settings




urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/menu/', MenuView.as_view(), name='menu'),
    path('api/menu/<int:pk>/', MenuItemDetailView.as_view(), name='menu-item-detail'),
    path('api/page-content/<str:page>/', PageContentView.as_view(), name='page-content'),
    path('api/services/', ServiceListView.as_view(), name='services'),
    path('api/contact/', ContactView.as_view(), name='contact'),   # <-- add this line
     path('api/auth/register/', RegisterView.as_view(), name='register'),
    path('api/auth/login/', LoginView.as_view(), name='login'),
    path('api/profile/', WorkerProfileView.as_view(), name='profile'),
    path('api/auth/request-reset-email/', RequestPasswordResetEmail.as_view(), name='request-reset-email'),
    path('api/auth/confirm-reset-password/', ConfirmPasswordReset.as_view(), name='confirm-reset-password'),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
