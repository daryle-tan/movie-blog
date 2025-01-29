from django.core.management.base import BaseCommand
from posts.models import Posts
from user.models import User
from comments.models import Comments

class Command(BaseCommand):
    help = 'Populate the database with a user, post, and comment for testing'

    def handle(self, *args, **options):
 
        user1 = User.objects.create(email='user1@email.com')
        
        post1 = Posts.objects.create(
            post_title='This is a test title',
            post_content='This is a test content'
        )
        
        comment1 = Comments.objects.create(
            comment='this is a comment',
            comment_user=user1,
            post=post1
        )

        self.stdout.write(self.style.SUCCESS('Successfully added user, post, and comment to the database'))