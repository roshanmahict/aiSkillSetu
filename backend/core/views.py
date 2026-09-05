import logging

from django.core.mail import send_mail
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import RetrieveAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from .models import MenuItem, PageContent, Service, Labour, ContactMessage
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import get_user_model
from .serializers import (
    MenuItemSerializer,
    PageContentSerializer,
    ServiceSerializer,
    ContactMessageSerializer,
    RegisterSerializer,
    LoginSerializer,
    LabourSerializer,
)

logger = logging.getLogger(__name__)


# ------------------- Registration (with email) -------------------
class RegisterView(APIView):
    def post(self, request):
        print(f"🔍 Role received from core/views: {request.data.get('role')}")

        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            role = request.data.get('role')

            # ---------- Email logic for BOTH roles ----------
            try:
                admin_email = getattr(settings, 'ADMIN_EMAIL', 'admin@aiskillsetu.com')
                subject_admin = ""
                message_admin = ""
                subject_user = ""
                message_user = ""
                recipient_user = user.email if user.email else None

                if role in ['company', 'contractor']:
                    company = getattr(user, 'company', None)
                    if company:
                        # Admin email
                        subject_admin = "New Contractor Registration on AI Skill Setu"
                        message_admin = f"""
A new contractor has registered:

Company Name: {company.company_name}
Contact Person: {user.first_name} {user.last_name}
Email: {user.email}
Phone: {user.phone}
State: {company.state}
City: {company.city}
Area: {company.area or 'N/A'}
Requirements: {company.requirements}

Please review and contact them.
"""
                        # User welcome email
                        subject_user = "Thank you for your interest – AI Skill Setu"
                        message_user = f"""
Dear {user.first_name} {user.last_name},

Thank you for registering as a contractor on AI Skill Setu.

Your company: {company.company_name}
Your requirements: {company.requirements}

We will review your profile and get back to you soon. If you have any questions, please contact us on WhatsApp at +91 6205386407.

Best regards,
AI Skill Setu Team
"""

                elif role == 'worker':
                    labour = getattr(user, 'labour', None)
                    if labour:
                        # Admin email
                        subject_admin = "New Worker Registration on AI Skill Setu"
                        message_admin = f"""
A new worker has registered:

Name: {user.first_name} {user.last_name}
Phone: {user.phone}
Email: {user.email or 'Not provided'}
State: {labour.state}
City: {labour.location}
Area: {labour.area}
Skills: {', '.join(labour.trade) if labour.trade else 'N/A'}
Experience: {labour.experience} years
Description: {labour.description or 'N/A'}

Please review and contact them.
"""
                        # User welcome email (optional, only if user provided email)
                        if recipient_user:
                            subject_user = "Welcome to AI Skill Setu – Worker Registration"
                            message_user = f"""
Dear {user.first_name} {user.last_name},

Thank you for registering as a worker on AI Skill Setu.

Your skills: {', '.join(labour.trade) if labour.trade else 'N/A'}
Experience: {labour.experience} years

We will review your profile and get back to you soon.

Best regards,
AI Skill Setu Team
"""

                # ---------- Send the emails ----------
                # 1. Admin email (always send)
                if admin_email and subject_admin:
                    send_mail(
                        subject_admin,
                        message_admin,
                        settings.DEFAULT_FROM_EMAIL,
                        [admin_email],
                        fail_silently=False,
                    )
                    print(f"✅ Admin email sent for {role}")

                # 2. User welcome email (only if user has email and subject_user is set)
                if recipient_user and subject_user and message_user:
                    send_mail(
                        subject_user,
                        message_user,
                        settings.DEFAULT_FROM_EMAIL,
                        [recipient_user],
                        fail_silently=False,
                    )
                    print(f"✅ Welcome email sent to {recipient_user}")

                logger.info(f"Emails sent successfully for {role} signup")

            except Exception as e:
                print(f"❌ Email error: {e}")
                logger.error(f"Email sending failed for {role}: {e}")

            # ---------- Return response ----------
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': user.id,
                    'phone': user.phone,
                    'email': user.email,
                    'role': user.role,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                }
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ------------------- Login -------------------
class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': user.id,
                    'phone': user.phone,
                    'email': user.email,
                    'role': user.role,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                }
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ------------------- Worker Profile (for authenticated user) -------------------
class WorkerProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        labour, created = Labour.objects.get_or_create(
            user=request.user,
            defaults={
                'name': f"{request.user.first_name} {request.user.last_name}".strip(),
                'phone': request.user.phone,
                'location': '',
                'state': '',
                'area': '',
                'trade': [],
                'experience': 0,
                'description': '',
                'verified': False,
            }
        )
        serializer = LabourSerializer(labour)
        return Response(serializer.data)

    def patch(self, request):
        try:
            labour = Labour.objects.get(user=request.user)
            serializer = LabourSerializer(labour, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        except Labour.DoesNotExist:
            labour = Labour.objects.create(
                user=request.user,
                name=f"{request.user.first_name} {request.user.last_name}".strip(),
                phone=request.user.phone,
                location='',
                state='',
                area='',
                trade=[],
                experience=0,
                description='',
                verified=False,
            )
            serializer = LabourSerializer(labour, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)


# ------------------- Menu -------------------
class MenuView(APIView):
    def get(self, request):
        items = MenuItem.objects.filter(parent__isnull=True, is_active=True).order_by('order')
        serializer = MenuItemSerializer(items, many=True, context={'request': request})
        return Response(serializer.data)


class MenuItemDetailView(RetrieveUpdateDestroyAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [IsAdminUser]


# ------------------- Page Content -------------------
class PageContentView(RetrieveAPIView):
    queryset = PageContent.objects.all()
    serializer_class = PageContentSerializer
    lookup_field = 'page'


# ------------------- Contact -------------------
class ContactView(APIView):
    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        if serializer.is_valid():
            # Save the message to the database
            contact = serializer.save()

            # ---------- Send email notifications ----------
            try:
                admin_email = getattr(settings, 'ADMIN_EMAIL', 'admin@aiskillsetu.com')

                # 1. Admin email
                subject_admin = f"New Contact Message from {contact.name}"
                message_admin = f"""
You have received a new contact message:

Name: {contact.name}
Email: {contact.email or 'Not provided'}
Phone: {contact.phone or 'Not provided'}
Subject: {contact.subject or 'No subject'}
Message:
{contact.message}

Please respond to the user as soon as possible.
"""
                send_mail(
                    subject_admin,
                    message_admin,
                    settings.DEFAULT_FROM_EMAIL,
                    [admin_email],
                    fail_silently=False,
                )
                print("✅ Admin notification email sent for contact form")

                # 2. Auto-reply to the user (if email is provided)
                if contact.email:
                    subject_user = "Thank you for contacting AI Skill Setu"
                    message_user = f"""
Dear {contact.name},

Thank you for reaching out to AI Skill Setu.

We have received your message and will get back to you shortly.

Here is a copy of your message for your reference:
Subject: {contact.subject or 'No subject'}
Message: {contact.message}

Best regards,
AI Skill Setu Team
"""
                    send_mail(
                        subject_user,
                        message_user,
                        settings.DEFAULT_FROM_EMAIL,
                        [contact.email],
                        fail_silently=False,
                    )
                    print(f"✅ Auto-reply sent to {contact.email}")

                logger.info("Contact form emails sent successfully")

            except Exception as e:
                print(f"❌ Contact email error: {e}")
                logger.error(f"Contact email sending failed: {e}")

            return Response({'success': True}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ------------------- Service List -------------------
class ServiceListView(APIView):
    def get(self, request):
        lang = request.query_params.get('lang', 'en')
        services = Service.objects.filter(is_active=True).order_by('order')

        data = []
        for svc in services:
            if lang == 'hi':
                name = svc.name_hi or svc.name_en
                desc = svc.description_hi or svc.description_en
            else:
                name = svc.name_en
                desc = svc.description_en
            data.append({
                'id': svc.id,
                'name': name,
                'description': desc,
                'icon': svc.icon,
                'order': svc.order,
            })
        return Response(data)



User = get_user_model()
token_generator = PasswordResetTokenGenerator()


class RequestPasswordResetEmail(APIView):
    def post(self, request):
        phone = request.data.get('phone')
        
        if not phone:
            return Response(
                {'error': 'Phone number is required.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(phone=phone)
        except User.DoesNotExist:
            # For security, don't reveal if user exists or not
            return Response(
                {'message': 'If this number is registered with an email, we have sent a reset link.'}, 
                status=status.HTTP_200_OK
            )

        # Check if the user has an email
        if not user.email:
            return Response(
                {'error': 'No email address is associated with this account. Please contact admin.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Generate password reset token
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = token_generator.make_token(user)

        # Build the reset link (frontend URL)
        # Change this to your actual frontend URL (e.g., http://localhost:3001)
        frontend_url = "http://localhost:3001" 
        reset_link = f"{frontend_url}/reset-password/{uid}/{token}/"

        # Send the email
        try:
            send_mail(
                subject="Reset Your Password - AI Skill Setu",
                message=f"""
Hello {user.first_name or 'User'},

You requested a password reset for your AI Skill Setu account.

Click the link below to set a new password:
{reset_link}

If you did not request this, please ignore this email.

Best regards,
AI Skill Setu Team
                """,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )
            print(f"✅ Password reset email sent to {user.email}")
            return Response(
                {'message': 'Password reset link has been sent to your registered email.'}, 
                status=status.HTTP_200_OK
            )
        except Exception as e:
            print(f"❌ Failed to send email: {e}")
            return Response(
                {'error': 'Failed to send email. Please try again later.'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ConfirmPasswordReset(APIView):
    def post(self, request):
        uid = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('new_password')

        if not all([uid, token, new_password]):
            return Response(
                {'error': 'UID, Token, and New Password are required.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Decode the UID
        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(
                {'error': 'Invalid reset link.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate the token
        if not token_generator.check_token(user, token):
            return Response(
                {'error': 'The reset link is invalid or has expired.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Set the new password
        user.set_password(new_password)
        user.save()

        return Response(
            {'message': 'Password has been reset successfully. Please login with your new password.'}, 
            status=status.HTTP_200_OK
        )

class SiteSettingsView(APIView):
    def get(self, request):
        settings, created = SiteSettings.objects.get_or_create(id=1)
        return Response({
            'head_html': settings.head_html,
            'body_end_html': settings.body_end_html,
        })