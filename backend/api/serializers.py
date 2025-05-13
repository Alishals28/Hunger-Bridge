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

class RequestSerializer(serializers.ModelSerializer):
    ngo = UserSerializer(read_only=True)
    volunteer = UserSerializer(read_only=True)
    donation = DonationSerializer(read_only=True)

    donation_id = serializers.PrimaryKeyRelatedField(
        queryset=Donation.objects.all(), write_only=True, source='donation'
    )

    class Meta:
        model = Request
        fields = [
            'request_id',
            'donation', 'donation_id',
            'ngo',
            'volunteer',
            'priority',
            'status',
            'requested_at'
        ]
        read_only_fields = ['request_id', 'ngo', 'volunteer', 'donation', 'requested_at']

    def update(self, instance, validated_data):
        """
        Allow volunteer assignment in the claim request view.
        Only 'status' is allowed to be updated here manually.
        'volunteer' will be set in the view, not via request body.
        """
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        return instance
        
class DonationSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='donation_id', read_only=True)

    class Meta:
        model = Donation
        fields = ['id','food_description', 'quantity', 'pickup_time', 'status']  # Include all required fields
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