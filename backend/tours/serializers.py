from rest_framework import serializers
from django.utils import timezone
from .models import TourProgram
from users.serializers import UserSerializer
import calendar


class TourProgramSerializer(serializers.ModelSerializer):
    """Serializer for the TourProgram model."""

    user_details = UserSerializer(source='user', read_only=True)
    reviewer_details = UserSerializer(source='reviewed_by', read_only=True)
    month_name = serializers.ReadOnlyField()

    class Meta:
        model = TourProgram
        fields = [
            'id', 'user', 'user_details', 'month', 'month_name', 'year', 
            'area_details', 'status', 'submitted_at', 'reviewed_by', 
            'reviewer_details', 'reviewed_at', 'manager_comments',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user', 'status', 'submitted_at', 'reviewed_by',
            'reviewed_at', 'manager_comments', 'is_active', 'created_at', 'updated_at'
        ]


class TourProgramCreateSerializer(TourProgramSerializer):
    """Serializer for creating a new tour program."""

    class Meta(TourProgramSerializer.Meta):
        read_only_fields = [
            'id', 'user', 'status', 'submitted_at', 'reviewed_by',
            'reviewed_at', 'manager_comments', 'is_active', 'created_at', 'updated_at'
        ]

    def validate(self, attrs):
        """Validate the tour program data."""
        # Set the user to the current user
        attrs['user'] = self.context['request'].user

        # Validate month and year
        month = attrs.get('month')
        year = attrs.get('year')

        if month < 1 or month > 12:
            raise serializers.ValidationError(
                {"month": "Month must be between 1 and 12."}
            )

        # Check if a tour program already exists for this month and year
        user = self.context['request'].user
        instance = self.instance

        if instance:
            # If we're updating an existing tour program, exclude it from the check
            existing_tour_program = TourProgram.objects.filter(
                user=user,
                month=month,
                year=year
            ).exclude(id=instance.id).first()
        else:
            existing_tour_program = TourProgram.objects.filter(
                user=user,
                month=month,
                year=year
            ).first()

        if existing_tour_program:
            raise serializers.ValidationError(
                {"month": f"A tour program already exists for {calendar.month_name[month]} {year}."}
            )

        return attrs


class TourProgramUpdateSerializer(TourProgramCreateSerializer):
    """Serializer for updating a tour program."""

    class Meta(TourProgramCreateSerializer.Meta):
        pass

    def validate(self, attrs):
        """Validate the tour program update."""
        # Only allow updates if the tour program is in draft status
        instance = self.instance
        if instance.status != 'draft':
            raise serializers.ValidationError(
                {"status": "Only draft tour programs can be updated."}
            )

        return super().validate(attrs)


class TourProgramSubmitSerializer(serializers.ModelSerializer):
    """Serializer for submitting a tour program."""

    class Meta:
        model = TourProgram
        fields = ['status']

    def validate_status(self, value):
        """Validate the status field."""
        if value != 'submitted':
            raise serializers.ValidationError(
                "Status must be 'submitted'."
            )
        return value

    def update(self, instance, validated_data):
        """Update the tour program with submit data."""
        # Only allow submitting if the tour program is in draft status
        if instance.status != 'draft':
            raise serializers.ValidationError(
                {"status": "Only draft tour programs can be submitted."}
            )

        # Set the submitted_at field
        validated_data['submitted_at'] = timezone.now()

        return super().update(instance, validated_data)


class TourProgramReviewSerializer(serializers.ModelSerializer):
    """Serializer for reviewing (approving/rejecting) a tour program."""

    class Meta:
        model = TourProgram
        fields = ['status', 'manager_comments']

    def validate_status(self, value):
        """Validate the status field."""
        if value not in ['approved', 'rejected']:
            raise serializers.ValidationError(
                "Status must be either 'approved' or 'rejected'."
            )
        return value

    def update(self, instance, validated_data):
        """Update the tour program with review data."""
        # Only allow reviewing if the tour program is in submitted status
        if instance.status != 'submitted':
            raise serializers.ValidationError(
                {"status": "Only submitted tour programs can be reviewed."}
            )

        # Set the reviewed_by and reviewed_at fields
        validated_data['reviewed_by'] = self.context['request'].user
        validated_data['reviewed_at'] = timezone.now()

        return super().update(instance, validated_data)
