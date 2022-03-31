import os

from posthog.settings.base_variables import DEBUG, TEST

if TEST or DEBUG:
    OBJECT_STORAGE_HOST = os.getenv("OBJECT_STORAGE_HOST", "localhost")
    OBJECT_STORAGE_PORT = os.getenv("OBJECT_STORAGE_PORT", "19000")
    OBJECT_STORAGE_ACCESS_KEY_ID = os.getenv("OBJECT_STORAGE_ACCESS_KEY_ID", "object_storage_root_user")
    OBJECT_STORAGE_SECRET_ACCESS_KEY = os.getenv("OBJECT_STORAGE_SECRET_ACCESS_KEY", "object_storage_root_password")
else:
    OBJECT_STORAGE_HOST = os.getenv("OBJECT_STORAGE_HOST", "")
    OBJECT_STORAGE_PORT = os.getenv("OBJECT_STORAGE_PORT", "")
    OBJECT_STORAGE_ACCESS_KEY_ID = os.getenv("OBJECT_STORAGE_ACCESS_KEY_ID", "")
    OBJECT_STORAGE_SECRET_ACCESS_KEY = os.getenv("OBJECT_STORAGE_SECRET_ACCESS_KEY", "")

OBJECT_STORAGE_BUCKET = os.getenv("OBJECT_STORAGE_BUCKET", "posthog")
OBJECT_STORAGE_SESSION_RECORDING_FOLDER = os.getenv("OBJECT_STORAGE_SESSION_RECORDING_FOLDER", "session_recordings")
