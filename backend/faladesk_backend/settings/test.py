from .dev import *  # noqa: F401,F403

DEBUG = False
DATABASES["default"]["NAME"] = env(
    "POSTGRES_DB_TEST", default=f"{DATABASES['default']['NAME']}_test"
)
PASSWORD_HASHERS = ["django.contrib.auth.hashers.MD5PasswordHasher"]
EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"
CELERY_TASK_ALWAYS_EAGER = True
CELERY_TASK_EAGER_PROPAGATES = True
