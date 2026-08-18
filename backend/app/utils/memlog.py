import os
import sys
import resource
import logging

logger = logging.getLogger(__name__)


def _rss_mb() -> float:
    """Return current RSS in MB (not peak)."""
    pid = os.getpid()
    try:
        import subprocess
        out = subprocess.check_output(
            ["ps", "-o", "rss=", "-p", str(pid)],
            text=True,
        ).strip()
        return int(out) / 1024  # ps reports KB
    except Exception:
        return resource.getrusage(resource.RUSAGE_SELF).ru_maxrss / 1024


def log_mem(stage: str) -> None:
    """Print current process RSS in MB. Negligible overhead."""
    rss = _rss_mb()
    logger.info("[mem] %-20s  RSS %7.1f MB  pid=%d", stage, rss, os.getpid())
    # Also print to stderr for Railway logs (logger may not be configured)
    print(f"[mem] {stage:20s}  RSS {rss:7.1f} MB", file=sys.stderr, flush=True)
