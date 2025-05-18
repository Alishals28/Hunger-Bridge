from rest_framework import viewsets,permissions, status,generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework import filters
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from .models import User, Donation, NGO, Volunteer, Request, Transaction, Route
from .serializers import RegisterSerializer
import logging
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import (
    UserSerializer,
    DonationSerializer,
    NGO_Serializer,
    VolunteerSerializer,
    RequestSerializer,
    TransactionSerializer,
    RouteSerializer, 
    NotificationSerializer,
    CustomTokenObtainPairSerializer,
    DonationSerializer,
    TokenObtainPairSerializer
)
from .permissions import IsDonor, IsVolunteer, IsNGO, IsAdminUserType
from django.utils import timezone
from .mongodb import notifications_collection
from django.conf import settings
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
from django.http import JsonResponse
from api.utils.notifications import send_notification
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from .filters import RequestFilter

# User ViewSet
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


# Donation ViewSet
class DonationViewSet(viewsets.ModelViewSet):
    queryset = Donation.objects.none()
    serializer_class = DonationSerializer
    permission_classes = [IsAuthenticated & IsDonor]
    filterset_fields = ['status', 'quantity']
    search_fields = ['food_description', 'donor__first_name', 'donor__email']

    def perform_create(self, serializer):
        donation = serializer.save(donor=self.request.user)

        # 🔔 Send notification to all NGOs about this donation
        ngos = User.objects.filter(user_type='NGO')
        for ngo in ngos:
            send_notification(
                user_id=ngo.id,
                message=f"New donation posted by {self.request.user.first_name}: '{donation.food_description}'"
            )

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

        # Directly compare user to transaction.ngo
        try:
            ngo = NGO.objects.get(user=user)
        except NGO.DoesNotExist:
            raise PermissionDenied("Only NGOs can add feedback.")

        if transaction.ngo != ngo:
            raise PermissionDenied("You are not authorized to add feedback to this transaction.")

        if transaction.feedback_given:
            return Response({"detail": "Feedback has already been provided and cannot be changed."},
                        status=status.HTTP_400_BAD_REQUEST)
        
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
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_class = RequestFilter
    
    # These fields will be used in ?status= and ?priority=
    filterset_fields = ['status', 'priority']

    # Enable sorting by date or priority: ?ordering=-created_at
    ordering_fields = ['created_at', 'priority']

    # Enable text search (optional): ?search=rice
    search_fields = [
        'donation__food_description',
        'donation__location',
        'ngo__user__first_name',
        'ngo__user__last_name',
        'ngo__organization_name',
        'volunteer__user__first_name',
        'volunteer__user__last_name',
        'volunteer__user__id',
        'volunteer__preferred_area',
    ]

    def get_queryset(self):
        user = self.request.user
        if self.action == 'list':
            if user.user_type == 'NGO':
                return Request.objects.filter(ngo=user)
            elif user.user_type == 'Volunteer':
                return Request.objects.filter(volunteer=user)
            elif user.user_type == 'Donor':
                # Show only requests related to the donor's donations
                return Request.objects.filter(donation__donor=user)
            else:
                return Request.objects.none()
        return Request.objects.all()

    
    def perform_create(self, serializer):
        user = self.request.user
        if user.user_type != 'NGO':
            raise PermissionDenied("Only NGOs can create requests.")

        donation = serializer.validated_data['donation']
        if donation.status != 'Available':
            raise PermissionDenied("Donation is not available for request.")

        request_instance = serializer.save(ngo=user)

        # ✅ Send notification to donor
        donor = donation.donor
        message = f"{user.first_name} (NGO) has requested your donation: '{donation.food_description}'"
        send_notification(str(donor.id), message)
        print("Notification sent to donor:", donor.email)

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

        if req.status != 'Pending':
            return Response({"detail": "Request is not pending and cannot be claimed."},
                            status=status.HTTP_400_BAD_REQUEST)

        #Assign volunteer and update statuses
        req.volunteer = user
        req.status = 'In Transit'  # NEW
        req.save()

        req.donation.status = 'Picked Up'  # NEW
        req.donation.save()

        #DEBUG: Check user info before notification
        # try:
        #     print("NGO user ID:", req.ngo.user.user_id)
        #     print("Volunteer name:", user.name)
        # except Exception as debug_e:
        #     print("DEBUG ERROR:", debug_e)

        #Send notification to NGO
        try:
            request_id = req.request_id  # Use the correct primary key field
            ngo_user_id = req.ngo.user_id  # Assuming NGO is a OneToOneField to User
            volunteer_name = user.first_name  # Your User model has first_name

            message = f"Your request (ID: {request_id}) has been claimed by volunteer {volunteer_name}"
            send_notification(str(ngo_user_id), message)
            print("Notification sent successfully.")
        except Exception as notif_error:
            print("Failed to send notification:", notif_error)

        serializer = self.get_serializer(req)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated], url_path='mark-delivered')
    def mark_delivered(self, request, pk=None):
        user = request.user
        req = self.get_object()

        # Ensure the assigned volunteer is making the request
        if req.volunteer.id != user.id:
            raise PermissionDenied("Only the assigned volunteer can mark this request as delivered.")

        # ✅ Fix: Check for 'In Transit' instead of 'Claimed'
        if req.status != 'In Transit':
            return Response({"detail": "Request must be 'In Transit' to be marked as delivered."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Update statuses
        req.status = 'Delivered'
        req.save()

        req.donation.status = 'Delivered'
        req.donation.save()

        # Resolve NGO and Volunteer instances
        ngo_instance = NGO.objects.get(user=req.ngo)
        volunteer_instance = Volunteer.objects.get(user=req.volunteer)

        # Create Transaction
        delivery_time = timezone.now()
        Transaction.objects.create(
            donation=req.donation,
            volunteer=volunteer_instance,
            ngo=ngo_instance,
            pickup_time=req.donation.pickup_time,
            delivery_time=delivery_time
        )

        # Format timestamp for notification
        readable_time = delivery_time.strftime("%B %d, %Y at %I:%M %p")

        # Send notification to NGO
        try:
            message = f"Your requested donation '{req.donation.food_description}' was delivered by {user.first_name} on {readable_time}."
            send_notification(str(req.ngo.user_id), message)
            print("Delivery notification sent to NGO.")
        except Exception as notif_error:
            print("Failed to send delivery notification to NGO:", notif_error)

        # Send notification to Donor
        try:
            donor = req.donation.donor
            donor_message = f"Your donation '{req.donation.food_description}' was successfully delivered by {user.first_name} on {readable_time}."
            send_notification(str(donor.user_id), donor_message)  # 🔧 FIX: use donor.user_id not donor.id if donor is a User
            print("Delivery notification sent to Donor.")
        except Exception as notif_error:
            print("Failed to send delivery notification to Donor:", notif_error)

        return Response(self.get_serializer(req).data, status=status.HTTP_200_OK)

# Test Notification Endpoint  
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def test_notification(request):
    user = request.user
    notifications_collection.insert_one({
        "message": "Test notification from API",
        "user_id": str(user.user_id),
        "timestamp": timezone.now().isoformat()
    })
    return Response({"detail": "Notification logged successfully"})   

# Notification ViewSet
class NotificationViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        user_id = str(request.user.id)  # ✅ Safely cast to string

        print("DEBUG - Authenticated user ID:", user_id)

        # Connect to MongoDB
        client = MongoClient('mongodb://localhost:27017/')
        db = client['hungerbridge_db']  # Adjust if your DB is actually 'hungerbridge_db'
        collection = db['notifications']

        # Fetch and sort notifications by timestamp (descending)
        notifications = collection.find({"user_id": {"$in": [user_id, int(user_id)]}}).sort("timestamp", -1)


        # Manual serialization of MongoDB documents
        data = []
        for n in notifications:
            print("DEBUG - Notification from DB:", n)
            data.append({
                "_id": str(n.get("_id")),
                "user_id": n.get("user_id"),
                "message": n.get("message"),
                "timestamp": n.get("timestamp").isoformat() if isinstance(n.get("timestamp"), datetime) else n.get("timestamp")
            })

        return Response(data)
        
# test mongodb connection
def test_mongo_connection(request):
    try:
        client = MongoClient("mongodb://localhost:27017/")
        db = client["hungerbridge_db"]
        collection = db["notifications"]

        doc = collection.find_one()

        if doc:
            return JsonResponse({"status": "success", "sample_doc": str(doc)})
        else:
            return JsonResponse({"status": "success", "message": "Connected but collection is empty"})

    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)})



class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['email'] = self.user.email
        data['user_type'] = self.user.user_type
        data['first_name'] = self.user.first_name
        data['id'] = self.user.user_id
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer



class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class DonationListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # List only donations by the logged-in user
        donations = Donation.objects.filter(donor=request.user).order_by('-posted_at')
        serializer = DonationSerializer(donations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        # Create a donation with donor from request.user
        serializer = DonationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(donor=request.user)  # donor is not passed from frontend
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DonationViewSet(viewsets.ModelViewSet):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
# class RequestListView(generics.ListAPIView):
#     serializer_class = Request_Serializer
#     permission_classes = [IsAuthenticated]
#     pagination_class = None

#     def get_queryset(self):
#         queryset = Request.objects.all()
#         print(f"Queryset count: {queryset.count()}")  # Should print non-zero if data exists
#         return queryset










