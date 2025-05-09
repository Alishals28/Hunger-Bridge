# api/permissions.py

from rest_framework.permissions import BasePermission
from api.models import UserRole

class IsDonor(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == UserRole.DONOR

class IsVolunteer(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == UserRole.VOLUNTEER

class IsNGO(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == UserRole.NGO

class IsAdminUserType(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == UserRole.ADMIN
