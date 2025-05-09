from django.contrib import admin
from .models import *

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'first_name', 'last_name', 'email', 'user_type', 'registration_date')
    search_fields = ('first_name', 'last_name', 'email')

@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = ('donation_id', 'donor', 'quantity', 'status', 'pickup_time', 'posted_at')
    list_filter = ('status',)

@admin.register(NGO)
class NGOAdmin(admin.ModelAdmin):
    list_display = ('ngo_id', 'user', 'organization_name', 'license_number', 'verification_status')
    list_filter = ('verification_status',)

@admin.register(Volunteer)
class VolunteerAdmin(admin.ModelAdmin):
    list_display = ('volunteer_id', 'user', 'availability_status', 'preferred_area')
    list_filter = ('availability_status',)

@admin.register(Request)
class RequestAdmin(admin.ModelAdmin):
    list_display = ('request_id', 'donation', 'volunteer', 'ngo', 'priority', 'status', 'requested_at')
    list_filter = ('priority', 'status')

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('transaction_id', 'donation', 'volunteer', 'ngo', 'pickup_time', 'delivery_time')

@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):
    list_display = ('route_id', 'volunteer', 'donation', 'ngo')

