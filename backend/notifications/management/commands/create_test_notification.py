from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from notifications.utils import create_notification

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates a test notification for the first user in the database'

    def handle(self, *args, **options):
        users = User.objects.all()
        
        if users.exists():
            recipient = users.first()
            actor = recipient  # For testing, use the same user as actor
            
            # Create notifications with different levels
            levels = ['info', 'success', 'warning', 'error']
            verbs = [
                "This is an info notification",
                "This is a success notification",
                "This is a warning notification",
                "This is an error notification"
            ]
            
            for level, verb in zip(levels, verbs):
                notification = create_notification(
                    recipient=recipient,
                    actor=actor,
                    verb=verb,
                    level=level,
                    force=True
                )
            
            if notification:
                self.stdout.write(self.style.SUCCESS(f'Successfully created test notification for {recipient.email}'))
            else:
                self.stdout.write(self.style.WARNING('Notification was not created (possibly because actor == recipient)'))
        else:
            self.stdout.write(self.style.ERROR('No users found in the database'))