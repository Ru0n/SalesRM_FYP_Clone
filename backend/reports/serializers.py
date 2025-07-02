from rest_framework import serializers
from django.utils import timezone
from .models import DailyCallReport
from users.serializers import UserSerializer
from masters.serializers import DoctorSerializer, ChemistSerializer


class DailyCallReportSerializer(serializers.ModelSerializer):
    """Serializer for the DailyCallReport model."""

    user_details = UserSerializer(source='user', read_only=True)
    work_type_display = serializers.CharField(source='get_work_type_display', read_only=True)
    doctors_visited_details = DoctorSerializer(source='doctors_visited', many=True, read_only=True)
    chemists_visited_details = ChemistSerializer(source='chemists_visited', many=True, read_only=True)
    days_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = DailyCallReport
        fields = [
            'id', 'user', 'user_details', 'date', 'work_type', 'work_type_display',
            'summary', 'doctors_visited', 'doctors_visited_details',
            'chemists_visited', 'chemists_visited_details', 'days_count',
            'submitted_at', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user', 'submitted_at', 'is_active', 'created_at', 'updated_at'
        ]


class DailyCallReportCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new daily call report."""

    class Meta:
        model = DailyCallReport
        fields = [
            'date', 'work_type', 'summary', 'doctors_visited', 'chemists_visited'
        ]

    def validate(self, attrs):
        """Validate the daily call report data."""
        # Check if a report already exists for this user and date
        user = self.context['request'].user
        date = attrs.get('date')
        
        if DailyCallReport.objects.filter(user=user, date=date).exists():
            raise serializers.ValidationError(
                {"date": f"A report already exists for {date}."}
            )
        
        # If work_type is field_work, require doctors_visited or chemists_visited
        work_type = attrs.get('work_type')
        doctors_visited = attrs.get('doctors_visited', [])
        chemists_visited = attrs.get('chemists_visited', [])
        
        if work_type == 'field_work' and not (doctors_visited or chemists_visited):
            raise serializers.ValidationError(
                {"doctors_visited": "For field work, you must visit at least one doctor or chemist."}
            )
        
        # If work_type is not field_work, clear doctors_visited and chemists_visited
        if work_type != 'field_work':
            attrs['doctors_visited'] = []
            attrs['chemists_visited'] = []
        
        return attrs

    def create(self, validated_data):
        """Create a new daily call report."""
        # Set the user to the current user
        validated_data['user'] = self.context['request'].user
        
        # Handle many-to-many relationships
        doctors_visited = validated_data.pop('doctors_visited', [])
        chemists_visited = validated_data.pop('chemists_visited', [])
        
        # Create the report
        report = DailyCallReport.objects.create(**validated_data)
        
        # Add the many-to-many relationships
        if doctors_visited:
            report.doctors_visited.set(doctors_visited)
        
        if chemists_visited:
            report.chemists_visited.set(chemists_visited)
        
        return report


class DailyCallReportUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating a daily call report."""

    class Meta:
        model = DailyCallReport
        fields = [
            'work_type', 'summary', 'doctors_visited', 'chemists_visited'
        ]

    def validate(self, attrs):
        """Validate the daily call report update."""
        # If work_type is field_work, require doctors_visited or chemists_visited
        work_type = attrs.get('work_type')
        if work_type == 'field_work':
            doctors_visited = attrs.get('doctors_visited', self.instance.doctors_visited.all())
            chemists_visited = attrs.get('chemists_visited', self.instance.chemists_visited.all())
            
            if not (doctors_visited or chemists_visited):
                raise serializers.ValidationError(
                    {"doctors_visited": "For field work, you must visit at least one doctor or chemist."}
                )
        
        # If work_type is not field_work, clear doctors_visited and chemists_visited
        if work_type and work_type != 'field_work':
            attrs['doctors_visited'] = []
            attrs['chemists_visited'] = []
        
        return attrs
