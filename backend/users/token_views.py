from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .serializers import UserSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom token serializer that includes user data in the response
    """
    def validate(self, attrs):
        # Get the token data from the parent class
        data = super().validate(attrs)
        
        # Add user data to the response
        user_serializer = UserSerializer(self.user)
        data['user'] = user_serializer.data
        
        return data


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom token view that uses the custom serializer
    """
    serializer_class = CustomTokenObtainPairSerializer