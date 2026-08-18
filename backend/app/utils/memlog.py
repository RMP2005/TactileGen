import os
import resource
import logging

logger = logging.getLogger(__name__)


def log_mem(stage: str) -> None:
    """Print current process RSS in MB. Negligible overhead."""
    rss_mb = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss / 1024
    logger.info("[mem] %-20s  RSS %.1f MB  (pid %d)", stage, rss_mb, os.getpid())
