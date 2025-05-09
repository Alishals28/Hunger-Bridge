from rest_framework import serializers
from .models import User, Donation, NGO, Volunteer, Request, Transaction, Route


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
    ngo = UserSerializer(read_only=True)  # Display full NGO info
    volunteer = UserSerializer(read_only=True)  # Display full Volunteer info
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
