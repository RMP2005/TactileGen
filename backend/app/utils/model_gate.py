"""Global model loading gate.

Prevents DeepLabV3 and EasyOCR from allocating memory at the same time,
which would blow Railway's 512 MB limit.  Import and acquire before any
heavy model init; the lock is re-entrant within the same thread but
blocks other threads.
"""
import threading

_model_load_gate = threading.Lock()


def get_model_load_lock() -> threading.Lock:
    """Return the shared model-loading lock."""
    return _model_load_gate
