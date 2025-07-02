from rest_framework import serializers
from django.utils import timezone
from .models import ExpenseClaim
from users.serializers import UserSerializer
from masters.models import ExpenseType


class ExpenseTypeSerializer(serializers.ModelSerializer):
    """Serializer for the ExpenseType model."""

    class Meta:
        model = ExpenseType
        fields = ['id', 'name', 'code', 'max_amount', 'requires_receipt']


class ExpenseClaimSerializer(serializers.ModelSerializer):
    """Serializer for the ExpenseClaim model."""

    user_details = UserSerializer(source='user', read_only=True)
    expense_type_details = ExpenseTypeSerializer(source='expense_type', read_only=True)
    reviewed_by_details = UserSerializer(source='reviewed_by', read_only=True)
    attachment_url = serializers.SerializerMethodField()

    class Meta:
        model = ExpenseClaim
        fields = [
            'id', 'user', 'user_details', 'expense_type', 'expense_type_details',
            'amount', 'date', 'description', 'status', 'submitted_at',
            'reviewed_by', 'reviewed_by_details', 'reviewed_at', 'manager_comments', 'attachment',
            'attachment_url', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user', 'status', 'submitted_at', 'reviewed_by',
            'reviewed_at', 'manager_comments', 'is_active', 'created_at', 'updated_at'
        ]

    def get_attachment_url(self, obj):
        """Get the URL for the attachment."""
        if obj.attachment:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.attachment.url)
            return obj.attachment.url
        return None


class ExpenseClaimCreateSerializer(ExpenseClaimSerializer):
    """Serializer for creating a new expense claim."""

    class Meta(ExpenseClaimSerializer.Meta):
        read_only_fields = [
            'id', 'user', 'status', 'submitted_at', 'reviewed_by',
            'reviewed_at', 'manager_comments', 'is_active', 'created_at', 'updated_at'
        ]

    def validate(self, attrs):
        """Validate the expense claim data."""
        # Check if the expense type requires a receipt
        expense_type = attrs.get('expense_type')
        attachment = attrs.get('attachment')

        if expense_type and expense_type.requires_receipt and not attachment:
            raise serializers.ValidationError(
                {"attachment": f"Receipt is required for expense type '{expense_type.name}'"}
            )

        # Check if the amount exceeds the maximum allowed
        amount = attrs.get('amount')
        if expense_type and expense_type.max_amount > 0 and amount > expense_type.max_amount:
            raise serializers.ValidationError(
                {"amount": f"Amount exceeds maximum allowed ({expense_type.max_amount}) for this expense type"}
            )

        return attrs


class ExpenseClaimUpdateSerializer(ExpenseClaimSerializer):
    """Serializer for updating an expense claim."""

    class Meta(ExpenseClaimSerializer.Meta):
        read_only_fields = [
            'id', 'user', 'submitted_at', 'reviewed_by',
            'reviewed_at', 'manager_comments', 'is_active', 'created_at', 'updated_at'
        ]

    def validate(self, attrs):
        """Validate the expense claim update."""
        # Only allow updates if the expense claim is pending or the user is a manager
        instance = self.instance
        user = self.context['request'].user

        if instance.status != 'pending' and user.role != 'manager' and not user.is_staff:
            raise serializers.ValidationError(
                {"status": "You can only update pending expense claims."}
            )

        # Validate expense type and amount
        expense_type = attrs.get('expense_type', instance.expense_type)
        amount = attrs.get('amount', instance.amount)
        attachment = attrs.get('attachment', instance.attachment)

        if expense_type.requires_receipt and not attachment:
            raise serializers.ValidationError(
                {"attachment": f"Receipt is required for expense type '{expense_type.name}'"}
            )

        if expense_type.max_amount > 0 and amount > expense_type.max_amount:
            raise serializers.ValidationError(
                {"amount": f"Amount exceeds maximum allowed ({expense_type.max_amount}) for this expense type"}
            )

        return super().validate(attrs)


class ExpenseClaimReviewSerializer(serializers.ModelSerializer):
    """Serializer for reviewing (approving/rejecting) an expense claim."""

    class Meta:
        model = ExpenseClaim
        fields = ['status', 'manager_comments']

    def validate_status(self, value):
        """Validate the status field."""
        if value not in ['approved', 'rejected', 'queried']:
            raise serializers.ValidationError(
                "Status must be either 'approved', 'rejected', or 'queried'."
            )
        return value

    def update(self, instance, validated_data):
        """Update the expense claim with review data."""
        # Set the reviewed_by and reviewed_at fields
        validated_data['reviewed_by'] = self.context['request'].user
        validated_data['reviewed_at'] = timezone.now()

        return super().update(instance, validated_data)
