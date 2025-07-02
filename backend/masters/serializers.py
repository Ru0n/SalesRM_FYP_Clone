from rest_framework import serializers
from .models import Doctor, Chemist, DoctorSpecialty, ChemistCategory
from users.serializers import UserSerializer


class DoctorSpecialtySerializer(serializers.ModelSerializer):
    """Serializer for the DoctorSpecialty model."""

    class Meta:
        model = DoctorSpecialty
        fields = ['id', 'name', 'description']


class ChemistCategorySerializer(serializers.ModelSerializer):
    """Serializer for the ChemistCategory model."""

    class Meta:
        model = ChemistCategory
        fields = ['id', 'name', 'description']


class DoctorSerializer(serializers.ModelSerializer):
    """Serializer for the Doctor model."""

    specialty_details = DoctorSpecialtySerializer(source='specialty', read_only=True)
    added_by_details = UserSerializer(source='added_by', read_only=True)

    class Meta:
        model = Doctor
        fields = [
            'id', 'name', 'specialty', 'specialty_details', 'location',
            'contact_number', 'email', 'added_by', 'added_by_details',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'added_by', 'is_active', 'created_at', 'updated_at']


class DoctorCreateSerializer(DoctorSerializer):
    """Serializer for creating a new doctor."""

    class Meta(DoctorSerializer.Meta):
        read_only_fields = ['id', 'is_active', 'created_at', 'updated_at']

    def create(self, validated_data):
        """Set the added_by field to the current user."""
        validated_data['added_by'] = self.context['request'].user
        return super().create(validated_data)


class ChemistSerializer(serializers.ModelSerializer):
    """Serializer for the Chemist model."""

    category_details = ChemistCategorySerializer(source='category', read_only=True)
    added_by_details = UserSerializer(source='added_by', read_only=True)

    class Meta:
        model = Chemist
        fields = [
            'id', 'name', 'category', 'category_details', 'location',
            'contact_number', 'email', 'added_by', 'added_by_details',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'added_by', 'is_active', 'created_at', 'updated_at']


class ChemistCreateSerializer(ChemistSerializer):
    """Serializer for creating a new chemist."""

    class Meta(ChemistSerializer.Meta):
        read_only_fields = ['id', 'is_active', 'created_at', 'updated_at']

    def create(self, validated_data):
        """Set the added_by field to the current user."""
        validated_data['added_by'] = self.context['request'].user
        return super().create(validated_data)
