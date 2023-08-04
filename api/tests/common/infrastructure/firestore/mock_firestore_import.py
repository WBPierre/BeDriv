import sys
from unittest.mock import MagicMock


sys.modules['google.cloud'] = MagicMock()
sys.modules['google.cloud.pubsub_v1'] = MagicMock()
