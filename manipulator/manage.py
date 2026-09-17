#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def _apply_default_runserver_addr():
    """Make `runserver` without an explicit address listen on
    0.0.0.0:<DJANGO_HTTP_PORT or 8000> so the backend is reachable from
    other machines in the lab LAN by default.

    Reads DJANGO_HTTP_PORT directly from env (with the same default as
    manipulator/settings.py) because settings are not loaded at this point.
    An explicitly passed address (e.g. `runserver 127.0.0.1:9000`) wins.
    """
    try:
        idx = sys.argv.index('runserver')
    except ValueError:
        return
    if idx + 1 < len(sys.argv) and not sys.argv[idx + 1].startswith('-'):
        return
    port = os.getenv('DJANGO_HTTP_PORT', '8000')
    sys.argv.insert(idx + 1, f'0.0.0.0:{port}')


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'manipulator.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    _apply_default_runserver_addr()
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
