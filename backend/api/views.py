from rest_framework import viewsets, status, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework import filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User, Donation, NGO, Volunteer, Request, Transaction, Route
from .serializers import (
    UserSerializer,
    DonationSerializer,
    NGO_Serializer,
    VolunteerSerializer,
    RequestSerializer,
    TransactionSerializer,
    RouteSerializer
)
from .permissions import IsDonor, IsVolunteer, IsNGO, IsAdminUserType
from django.utils import timezone

# User ViewSet
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


# Donation ViewSet
class DonationViewSet(viewsets.ModelViewSet):
    queryset = Donation.objects.none()  # Needed for router basename resolution
    serializer_class = DonationSerializer
    permission_classes = [IsAuthenticated & IsDonor]
    filterset_fields = ['status', 'quantity']  # Add other fields as needed
    search_fields = ['food_description', 'donor__first_name', 'donor__email']

    def perform_create(self, serializer):
        serializer.save(donor=self.request.user)

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'Donor':
            return Donation.objects.filter(donor=user)
        elif user.user_type in ['NGO', 'Volunteer']:
            return Donation.objects.filter(status='Available')
        return Donation.objects.none()


# NGO ViewSet
class NGOViewSet(viewsets.ModelViewSet):
    queryset = NGO.objects.all()
    serializer_class = NGO_Serializer


# Volunteer ViewSet
class VolunteerViewSet(viewsets.ModelViewSet):
    queryset = Volunteer.objects.all()
    serializer_class = VolunteerSerializer


# Request ViewSet
class RequestViewSet(viewsets.ModelViewSet):
    queryset = Request.objects.all()
    serializer_class = RequestSerializer


# Transaction ViewSet
class TransactionViewSet(viewsets.ReadOnlyModelViewSet):  # Only GET operations for now
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.user_type == 'Volunteer':
            try:
                volunteer = Volunteer.objects.get(user=user)
                return self.queryset.filter(volunteer=volunteer)
            except Volunteer.DoesNotExist:
                return Transaction.objects.none()

        elif user.user_type == 'NGO':
            try:
                ngo = NGO.objects.get(user=user)
                return self.queryset.filter(ngo=ngo)
            except NGO.DoesNotExist:
                return Transaction.objects.none()

        elif user.is_superuser:
            return self.queryset  # Admins see all

        return Transaction.objects.none()
    
    @action(detail=True, methods=['post'], url_path='add-feedback')
    def add_feedback(self, request, pk=None):
        transaction = self.get_object()
        user = request.user

        # Check if user is the NGO linked to this transaction
        if not hasattr(user, 'ngo') or transaction.ngo.user != user:
            raise PermissionDenied("Only the NGO involved in this transaction can add feedback.")

        feedback = request.data.get('feedback')
        if not feedback:
            return Response({"detail": "Feedback cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

        transaction.feedback_given = feedback
        transaction.save()
        serializer = self.get_serializer(transaction)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], url_path='my-ngo-transactions')
    def my_ngo_transactions(self, request):
        user = request.user
        try:
            ngo = NGO.objects.get(user=user)
        except NGO.DoesNotExist:
            return Response({"detail": "You are not registered as an NGO."}, status=400)

        transactions = Transaction.objects.filter(ngo=ngo)
        serializer = self.get_serializer(transactions, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='my-volunteer-transactions')
    def my_volunteer_transactions(self, request):
        user = request.user
        try:
            volunteer = Volunteer.objects.get(user=user)
        except Volunteer.DoesNotExist:
            return Response({"detail": "You are not registered as a Volunteer."}, status=400)

        transactions = Transaction.objects.filter(volunteer=volunteer)
        serializer = self.get_serializer(transactions, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='my-donor-transactions')
    def my_donor_transactions(self, request):
        user = request.user
        donations = Donation.objects.filter(donor=user, status='Delivered')
        transactions = Transaction.objects.filter(donation__in=donations)
        serializer = self.get_serializer(transactions, many=True)
        return Response(serializer.data)

# Route ViewSet
class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer
    
    
# Request ViewSet
class RequestViewSet(viewsets.ModelViewSet):
    queryset = Request.objects.all()
    serializer_class = RequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if self.action == 'list':
            if user.user_type == 'NGO':
                return Request.objects.filter(ngo=user)
            elif user.user_type == 'Volunteer':
                return Request.objects.filter(volunteer=user)
            return Request.objects.none()
        return Request.objects.all()
    
    def perform_create(self, serializer):
        user = self.request.user
        if user.user_type != 'NGO':
            raise PermissionDenied("Only NGOs can create requests.")

        donation = serializer.validated_data['donation']
        if donation.status != 'Available':
            raise PermissionDenied("Donation is not available for request.")

        serializer.save(ngo=user)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated], url_path='claim')
    def claim_request(self, request, pk=None):
        print("Trying to claim request with ID:", pk)
        try:
            req = self.get_object()
        except Exception as e:
            print("Error fetching request:", e)
            raise

        user = request.user

        if user.user_type != 'Volunteer':
            return Response({"detail": "Only volunteers can claim requests."},
                            status=status.HTTP_403_FORBIDDEN)

        req = self.get_object()

        if req.status != 'Pending':
            return Response({"detail": "Request is not pending and cannot be claimed."},
                            status=status.HTTP_400_BAD_REQUEST)

        req.volunteer = user
        req.status = 'Claimed'
        req.save()

        serializer = self.get_serializer(req)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated], url_path='mark-delivered')
    def mark_delivered(self, request, pk=None):
        user = request.user
        req = self.get_object()

        if user != req.volunteer:
            raise PermissionDenied("Only the assigned volunteer can mark this request as delivered.")

        if req.status != 'Claimed':
            return Response({"detail": "Request is not in 'Claimed' status."}, status=status.HTTP_400_BAD_REQUEST)

        # Update request and donation status
        req.status = 'Delivered'
        req.save()

        req.donation.status = 'Delivered'
        req.donation.save()

        # Get related NGO and Volunteer instances (from their respective models)
        ngo_instance = NGO.objects.get(user=req.ngo)
        volunteer_instance = Volunteer.objects.get(user=req.volunteer)

        # Create a Transaction entry
        Transaction.objects.create(
            donation=req.donation,
            volunteer=volunteer_instance,
            ngo=ngo_instance,
            pickup_time=req.donation.pickup_time,
            delivery_time=timezone.now()
        )

        return Response(self.get_serializer(req).data, status=status.HTTP_200_OK)
    
    