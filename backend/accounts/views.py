raise Exception("🔥 I FOUND THE REAL VIEWS FILE! 🔥")
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, LoginSerializer
import logging
print("🔥🔥🔥 ACCOUNTS VIEWS.PY IS DEFINITELY LOADED 🔥🔥🔥")  # <-- ADD THIS LINE
logger = logging.getLogger(__name__)


class RegisterView(APIView):
    def post(self, request):
        print(f"🔍 Role received from core/views: {request.data.get('role')}")  # <-- ADD THIS
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # --- Send emails for contractor signup ---
            role = request.data.get('role')
            if role in ['company', 'contractor']:
                try:
                    company = user.company  # requires related_name='company' in Company model
                except:
                    company = None

                if company and user.email:
                    try:
                        # 1. Email to contractor (user)
                        subject = "Thank you for your interest – AI Skill Setu"
                        message = f"""
Dear {user.first_name} {user.last_name},

Thank you for registering as a contractor on AI Skill Setu.

Your company: {company.company_name}
Your requirements: {company.requirements}

We will review your profile and get back to you soon. If you have any questions, please contact us on WhatsApp at +91 6205386407.

Best regards,
AI Skill Setu Team
                        """
                        send_mail(
                            subject,
                            message,
                            settings.DEFAULT_FROM_EMAIL,
                            [user.email],
                            fail_silently=False,
                        )

                        # 2. Email to admin
                        admin_email = getattr(settings, 'ADMIN_EMAIL', 'admin@aiskillsetu.com')
                        if admin_email:
                            subject = "New Contractor Registration on AI Skill Setu"
                            message = f"""
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
                            send_mail(
                                subject,
                                message,
                                settings.DEFAULT_FROM_EMAIL,
                                [admin_email],
                                fail_silently=False,
                            )
                        logger.info("Emails sent successfully for contractor signup")
                        print("Email sent successfully!")  # <--- ADD THIS

                    except Exception as e:
                        logger.error(f"Email sending failed: {e}")

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