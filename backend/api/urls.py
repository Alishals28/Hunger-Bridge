from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, DonationViewSet, NGOViewSet, VolunteerViewSet, RequestViewSet, TransactionViewSet, RouteViewSet
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# Create a router and register viewsets
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'donations', DonationViewSet)
router.register(r'ngos', NGOViewSet)
router.register(r'volunteers', VolunteerViewSet)
router.register(r'requests', RequestViewSet)
router.register(r'transactions', TransactionViewSet)
router.register(r'routes', RouteViewSet)

urlpatterns = [
    path('', include(router.urls)),
]


urlpatterns += [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
