from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.conf import settings

# User Role ENUM
class UserRole(models.TextChoices):
    DONOR = 'Donor'
    VOLUNTEER = 'Volunteer'
    NGO = 'NGO'
    ADMIN = 'Admin'


# Donation Status ENUM
class DonationStatus(models.TextChoices):
    AVAILABLE = 'Available'
    PICKED_UP = 'Picked Up'
    CANCELLED = 'Cancelled'
    EXPIRED = 'Expired'


# Verification Status ENUM
class VerificationStatus(models.TextChoices):
    VERIFIED = 'Verified'
    NOT_VERIFIED = 'Not Verified'


# Volunteer Availability Status ENUM
class AvailabilityStatus(models.TextChoices):
    AVAILABLE = 'Available'
    NOT_AVAILABLE = 'Not Available'


# Request Priority ENUM
class RequestPriority(models.TextChoices):
    LOW = 'Low'
    MEDIUM = 'Medium'
    HIGH = 'High'
    URGENT = 'Urgent'


# Request Status ENUM
class RequestStatus(models.TextChoices):
    PENDING = 'Pending'
    APPROVED = 'Approved'
    COMPLETED = 'Completed'


# Users Table
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email must be provided")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)  # Uses Django's password hashing
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('user_type', UserRole.ADMIN)
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    user_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100, null=True, blank=True)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    user_type = models.CharField(max_length=10, choices=UserRole.choices)
    registration_date = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'user_type']

    def __str__(self):
        return self.email
    
    @property
    def id(self):
        return self.user_id
    
# Donations Table
class Donation(models.Model):
    donation_id = models.AutoField(primary_key=True)
    donor = models.ForeignKey(User, on_delete=models.CASCADE)
    food_description = models.CharField(max_length=4000)
    quantity = models.IntegerField()
    pickup_time = models.DateTimeField()
    status = models.CharField(max_length=20, choices=DonationStatus.choices)
    posted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Donation {self.donation_id} by {self.donor.first_name}"


# NGOs Table
class NGO(models.Model):
    ngo_id = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    organization_name = models.CharField(max_length=100)
    license_number = models.CharField(max_length=50)
    verification_status = models.CharField(
        max_length=20, choices=VerificationStatus.choices, default=VerificationStatus.NOT_VERIFIED
    )

    def __str__(self):
        return self.organization_name


# Volunteers Table
class Volunteer(models.Model):
    volunteer_id = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    availability_status = models.CharField(
        max_length=20, choices=AvailabilityStatus.choices
    )
    preferred_area = models.CharField(max_length=500)

    def __str__(self):
        return f"Volunteer {self.user.first_name}"


# Requests Table
# models.py

class Request(models.Model):
    request_id = models.AutoField(primary_key=True)
    donation = models.ForeignKey(Donation, on_delete=models.CASCADE)

    # Allow volunteer to be null and blank
    volunteer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='volunteer_requests'
    )

    # NGO must be provided, so keep it required
    ngo = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='ngo_requests'
    )

    priority = models.CharField(max_length=20, choices=RequestPriority.choices)
    status = models.CharField(max_length=20, choices=RequestStatus.choices)
    requested_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Request {self.request_id}"


# Transactions Table
class Transaction(models.Model):
    transaction_id = models.AutoField(primary_key=True)
    donation = models.ForeignKey(Donation, on_delete=models.CASCADE)
    volunteer = models.ForeignKey(Volunteer, on_delete=models.CASCADE)
    ngo = models.ForeignKey(NGO, on_delete=models.CASCADE)
    pickup_time = models.DateTimeField()
    delivery_time = models.DateTimeField()
    feedback_given = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Transaction {self.transaction_id}"


# Routes Table
class Route(models.Model):
    route_id = models.AutoField(primary_key=True)
    volunteer = models.ForeignKey(Volunteer, on_delete=models.CASCADE)
    donation = models.ForeignKey(Donation, on_delete=models.CASCADE)
    ngo = models.ForeignKey(NGO, on_delete=models.CASCADE)
    donor_location = models.CharField(max_length=500)
    ngo_location = models.CharField(max_length=500)
    optimized_route_data = models.JSONField()

    def __str__(self):
        return f"Route {self.route_id}"
