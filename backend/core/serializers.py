from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from core.models import Labour, Company, MenuItem, PageContent, Service, ContactMessage

User = get_user_model()

# ------------------- Register & Login (FULL VERSION) -------------------
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    # Worker fields
    aadhaar = serializers.CharField(required=False, allow_blank=True)
    trade = serializers.ListField(child=serializers.CharField(), required=False, allow_empty=False)
    experience = serializers.IntegerField(required=False, allow_null=True)
    aadhar_image = serializers.ImageField(required=False, allow_null=True)

    # Common address fields (for both worker and company)
    state = serializers.CharField(required=False, allow_blank=True)
    city = serializers.CharField(required=False, allow_blank=True)
    area = serializers.CharField(required=False, allow_blank=True)

    # Worker description
    description = serializers.CharField(required=False, allow_blank=True)

    # Company fields
    company_name = serializers.CharField(required=False, allow_blank=True)
    requirements = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = [
            'phone', 'email', 'password', 'role',
            'first_name', 'last_name',
            'aadhaar', 'trade', 'experience', 'aadhar_image',
            'state', 'city', 'area',
            'description',
            'company_name', 'requirements',
        ]

    def validate(self, data):
        role = data.get('role')
        phone = data.get('phone')
        email = data.get('email')

        # ---------- Phone validation ----------
        if phone:
            phone_str = str(phone)
            if len(phone_str) != 10:
                raise serializers.ValidationError({"phone": "Phone number must be exactly 10 digits."})
            if not phone_str.isdigit():
                raise serializers.ValidationError({"phone": "Phone number must contain only digits."})
            if phone_str[0] in '12345':
                raise serializers.ValidationError({"phone": "Phone number cannot start with 1,2,3,4,5. Must start with 6,7,8,9."})

        # ---------- Role‑specific validations ----------
        if role == 'worker':
            if not phone:
                raise serializers.ValidationError("Phone is required for workers.")
            if not data.get('state'):
                raise serializers.ValidationError({"state": "State is required for workers."})
            if not data.get('city'):
                raise serializers.ValidationError({"city": "City is required for workers."})
            if not data.get('area'):
                raise serializers.ValidationError({"area": "Area / Locality is required for workers."})
            if not data.get('trade') or len(data.get('trade')) == 0:
                raise serializers.ValidationError({"trade": "At least one skill / trade is required for workers."})
            if data.get('experience') is None:
                raise serializers.ValidationError({"experience": "Years of experience is required for workers."})

        elif role == 'company':
            if not email:
                raise serializers.ValidationError("Email is required for companies.")
            if not data.get('company_name'):
                raise serializers.ValidationError({"company_name": "Company name is required."})
            if not data.get('state'):
                raise serializers.ValidationError({"state": "State is required for companies."})
            if not data.get('city'):
                raise serializers.ValidationError({"city": "City is required for companies."})
        else:
            raise serializers.ValidationError("Invalid role. Must be 'worker' or 'company'.")

        # ---------- Uniqueness checks ----------
        if phone and User.objects.filter(phone=phone).exists():
            raise serializers.ValidationError({"phone": "A user with this phone already exists."})
        if email and User.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": "A user with this email already exists."})

        data['username'] = phone
        return data

    def create(self, validated_data):
        password = validated_data.pop('password')
        role = validated_data.pop('role')

        # Pop worker fields
        aadhaar = validated_data.pop('aadhaar', '')
        trade = validated_data.pop('trade', [])
        experience = validated_data.pop('experience', None)
        aadhar_image = validated_data.pop('aadhar_image', None)
        description = validated_data.pop('description', '')

        # Pop company fields
        company_name = validated_data.pop('company_name', '')
        requirements = validated_data.pop('requirements', '')

        # Pop common address fields
        state = validated_data.pop('state', '')
        city = validated_data.pop('city', '')
        area = validated_data.pop('area', '')

        user = User.objects.create_user(
            username=validated_data.get('phone'),
            phone=validated_data.get('phone'),
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=role,
            password=password
        )

        if role == 'worker':
            Labour.objects.create(
                user=user,
                name=f"{user.first_name} {user.last_name}".strip(),
                phone=user.phone,
                location=city,
                state=state,
                area=area,
                aadhaar_number=aadhaar,
                trade=trade,
                experience=experience,
                aadhar_image=aadhar_image,
                description=description,
                verified=False
            )
        else:  # company
            Company.objects.create(
                user=user,
                company_name=company_name,
                contact_person=f"{user.first_name} {user.last_name}".strip(),
                phone=user.phone,
                email=user.email,
                state=state,
                city=city,
                area=area,
                requirements=requirements,
                verified=False
            )

        return user


class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        identifier = data.get('identifier')
        password = data.get('password')
        user = authenticate(request=self.context.get('request'), username=identifier, password=password)
        if not user:
            raise serializers.ValidationError("Invalid credentials.")
        if not user.is_active:
            raise serializers.ValidationError("User is inactive.")
        data['user'] = user
        return data


# ------------------- PageContentSerializer (DEFINED FIRST) -------------------
class PageContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageContent
        fields = ['title', 'subtitle', 'content', 'image', 'updated_at']  # ✅ ADD 'subtitle'


# ------------------- MenuItemSerializer (Now can reference PageContentSerializer) -------------------
class MenuItemSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    content = serializers.SerializerMethodField()  # <-- Changed to method field

    class Meta:
        model = MenuItem
        fields = ['id', 'title', 'link', 'icon', 'children', 'content']

    def get_title(self, obj):
        request = self.context.get('request')
        if request:
            lang = request.query_params.get('lang', 'en')
            if lang == 'hi':
                return obj.title_hi or obj.title_en
        return obj.title_en

    def get_children(self, obj):
        children = obj.children.filter(is_active=True).order_by('order')
        # ✅ Pass context so children get the language too!
        return MenuItemSerializer(children, many=True, context=self.context).data

    def get_content(self, obj):
        # ✅ Safely return content only if it exists
        if hasattr(obj, 'content') and obj.content:
            return PageContentSerializer(obj.content, context=self.context).data
        return None


# ------------------- Other Serializers -------------------
class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name', 'description', 'icon', 'order']


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'phone', 'subject', 'message']


class LabourSerializer(serializers.ModelSerializer):
    class Meta:
        model = Labour
        fields = '__all__'