from rest_framework import serializers
from django.utils import timezone
from .models import LeaveRequest
from users.serializers import UserSerializer
from masters.models import LeaveType


class LeaveTypeSerializer(serializers.ModelSerializer):
    """Serializer for the LeaveType model."""

    class Meta:
        model = LeaveType
        fields = ['id', 'name', 'code', 'is_paid', 'max_days_per_year']


class LeaveRequestSerializer(serializers.ModelSerializer):
    """Serializer for the LeaveRequest model."""

    user_details = UserSerializer(source='user', read_only=True)
    leave_type_details = LeaveTypeSerializer(source='leave_type', read_only=True)
    days_count = serializers.SerializerMethodField()

    class Meta:
        model = LeaveRequest
        fields = [
            'id', 'user', 'user_details', 'leave_type', 'leave_type_details',
            'start_date', 'end_date', 'days_count', 'reason', 'status',
            'requested_at', 'reviewed_by', 'reviewed_at', 'manager_comments',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user', 'status', 'requested_at', 'reviewed_by',
            'reviewed_at', 'manager_comments', 'is_active', 'created_at', 'updated_at'
        ]

    def get_days_count(self, obj):
        """Calculate the number of days for the leave request."""
        if obj.start_date and obj.end_date:
            return (obj.end_date - obj.start_date).days + 1
        return 0

    def validate(self, attrs):
        """Validate the leave request data."""
        # Set the user to the current user
        attrs['user'] = self.context['request'].user

        # Validate start_date and end_date
        start_date = attrs.get('start_date')
        end_date = attrs.get('end_date')

        if start_date and end_date and start_date > end_date:
            raise serializers.ValidationError(
                {"end_date": "End date must be after or equal to start date."}
            )

        # Validate that start_date is not in the past
        if start_date and start_date < timezone.now().date():
            raise serializers.ValidationError(
                {"start_date": "Start date cannot be in the past."}
            )

        # Calculate days count
        if start_date and end_date:
            days_count = (end_date - start_date).days + 1

            # Validate against leave type max_days_per_year if applicable
            leave_type = attrs.get('leave_type')
            if leave_type and leave_type.max_days_per_year > 0:
                # Get all approved leave requests for this user and leave type in the current year
                current_year = timezone.now().year
                user = self.context['request'].user

                # If we're updating an existing leave request, exclude it from the count
                instance = self.instance
                if instance:
                    approved_leaves = LeaveRequest.objects.filter(
                        user=user,
                        leave_type=leave_type,
                        status='approved',
                        start_date__year=current_year
                    ).exclude(id=instance.id)
                else:
                    approved_leaves = LeaveRequest.objects.filter(
                        user=user,
                        leave_type=leave_type,
                        status='approved',
                        start_date__year=current_year
                    )

                # Calculate days for each leave request
                used_days = [
                    (leave.end_date - leave.start_date).days + 1
                    for leave in approved_leaves
                ]

                total_used_days = sum(used_days)

                if total_used_days + days_count > leave_type.max_days_per_year:
                    remaining_days = leave_type.max_days_per_year - total_used_days
                    raise serializers.ValidationError(
                        {
                            "leave_type": f"You have only {remaining_days} days remaining for this leave type in the current year."
                        }
                    )

        return attrs


class LeaveRequestCreateSerializer(LeaveRequestSerializer):
    """Serializer for creating a new leave request."""

    class Meta(LeaveRequestSerializer.Meta):
        read_only_fields = [
            'id', 'user', 'status', 'requested_at', 'reviewed_by',
            'reviewed_at', 'manager_comments', 'is_active', 'created_at', 'updated_at'
        ]


class LeaveRequestUpdateSerializer(LeaveRequestSerializer):
    """Serializer for updating a leave request."""

    class Meta(LeaveRequestSerializer.Meta):
        read_only_fields = [
            'id', 'user', 'leave_type', 'requested_at', 'reviewed_by',
            'reviewed_at', 'manager_comments', 'is_active', 'created_at', 'updated_at'
        ]

    def validate(self, attrs):
        """Validate the leave request update."""
        # Only allow updates if the leave request is pending or the user is a manager
        instance = self.instance
        user = self.context['request'].user

        if instance.status != 'pending' and user.role != 'manager' and not user.is_staff:
            raise serializers.ValidationError(
                {"status": "You can only update pending leave requests."}
            )

        return super().validate(attrs)


class LeaveRequestReviewSerializer(serializers.ModelSerializer):
    """Serializer for reviewing (approving/rejecting) a leave request."""

    class Meta:
        model = LeaveRequest
        fields = ['status', 'manager_comments']

    def validate_status(self, value):
        """Validate the status field."""
        if value not in ['approved', 'rejected']:
            raise serializers.ValidationError(
                "Status must be either 'approved' or 'rejected'."
            )
        return value

    def update(self, instance, validated_data):
        """Update the leave request with review data."""
        # Set the reviewed_by and reviewed_at fields
        validated_data['reviewed_by'] = self.context['request'].user
        validated_data['reviewed_at'] = timezone.now()

        return super().update(instance, validated_data)