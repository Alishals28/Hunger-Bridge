from rest_framework import serializers
from .models import User, Donation, NGO, Volunteer, Request, Transaction, Route
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password', 'phone', 'address', 'user_type']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims to JWT token
        token['user_type'] = user.user_type
        token['email'] = user.email

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        # Add extra user info to the response
        data['user_type'] = self.user.user_type
        data['email'] = self.user.email

        return data

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ['password']  # Exclude password from user info


# Donation Serializer
class DonationSerializer(serializers.ModelSerializer):
    donor = UserSerializer(read_only=True)  # Nested user info

    class Meta:
        model = Donation
        fields = '__all__'
        read_only_fields = ['donor']  # prevent donor from being set by client


# NGO Serializer
class NGO_Serializer(serializers.ModelSerializer):
    class Meta:
        model = NGO
        fields = '__all__'


# Volunteer Serializer
class VolunteerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Volunteer
        fields = '__all__'


# Request Serializer
# In serializers.py

# class RequestSerializer(serializers.ModelSerializer):
#     ngo = UserSerializer(read_only=True)
#     volunteer = UserSerializer(read_only=True)
#     donation = DonationSerializer(read_only=True)

#     donation_id = serializers.PrimaryKeyRelatedField(
#         queryset=Donation.objects.all(), write_only=True, source='donation'
#     )

#     class Meta:
#         model = Request
#         fields = [
#             'request_id',
#             'donation', 'donation_id',
#             'ngo',
#             'volunteer',
#             'priority',
#             'status',
#             'requested_at'
#         ]
#         read_only_fields = ['request_id', 'ngo', 'volunteer', 'donation', 'requested_at']

#     def update(self, instance, validated_data):
#         """
#         Allow volunteer assignment in the claim request view.
#         Only 'status' is allowed to be updated here manually.
#         'volunteer' will be set in the view, not via request body.
#         """
#         instance.status = validated_data.get('status', instance.status)
#         instance.save()
#         return instance


class DonationSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='donation_id', read_only=True)
    
    class Meta:
        model = Donation
        fields = ['id','food_description', 'quantity', 'pickup_time', 'status']  # Include all required fields
        
class RequestSerializer(serializers.ModelSerializer):
    ngo = UserSerializer(read_only=True)
    volunteer = UserSerializer(read_only=True)
    donation = DonationSerializer(read_only=True)

    donation_id = serializers.PrimaryKeyRelatedField(
        queryset=Donation.objects.all(), write_only=True, source='donation'
    )

    # New fields:
    food_description = serializers.SerializerMethodField()
    volunteer_or_ngo_name = serializers.SerializerMethodField()
    request_description = serializers.SerializerMethodField()
    donation_description = serializers.SerializerMethodField()
    ngo_name = serializers.SerializerMethodField()
    volunteer_name = serializers.SerializerMethodField()

    class Meta:
        model = Request
        fields = [
            'request_id',
            'donation', 'donation_id',
            'ngo',
            'volunteer',
            'priority',
            'status',
            'requested_at',
            'request_description',
            'donation_description',
            'ngo_name',
            'volunteer_name',
            'food_description',
            'volunteer_or_ngo_name',
        ]
        read_only_fields = ['request_id', 'ngo', 'volunteer', 'donation', 'requested_at', 
                            'request_description',
                            'donation_description','ngo_name','volunteer_name','food_description', 'volunteer_or_ngo_name']

    def get_food_description(self, obj):
        return obj.donation.food_description if obj.donation else None
    
    def get_ngo_name(self, obj):
        if obj.ngo:
            return f"{obj.ngo.first_name} {obj.ngo.last_name}".strip()
        return None

    def get_volunteer_name(self, obj):
        if obj.volunteer:
            return f"{obj.volunteer.first_name} {obj.volunteer.last_name}".strip()
        return None
    def get_donation_description(self, obj):
        return obj.donation.food_description if obj.donation else None
    def get_volunteer_or_ngo_name(self, obj):
        if obj.volunteer:
            first = obj.volunteer.first_name or ""
            last = obj.volunteer.last_name or ""
            full_name = f"{first} {last}".strip()
            return full_name if full_name else None
        
        if obj.ngo:
            # Assuming 'first_name' and 'last_name' represent NGO name, else adjust field
            first = obj.ngo.first_name or ""
            last = obj.ngo.last_name or ""
            full_name = f"{first} {last}".strip()
            return full_name if full_name else None
        
        return None
    def get_request_description(self, obj):
        # Return a description string for this request
        return obj.request_description
    def update(self, instance, validated_data):
        """
        Allow volunteer assignment in the claim request view.
        Only 'status' is allowed to be updated here manually.
        'volunteer' will be set in the view, not via request body.
        """
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        return instance
    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

# Transaction Serializer
class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'


# Route Serializer
class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = '__all__'

# Notification Serializer
class NotificationSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    user_id = serializers.CharField()
    message = serializers.CharField()
    timestamp = serializers.DateTimeField()