from __future__ import annotations

from django.core.management.base import BaseCommand

from apps.core.seeders import run_all_seeders


class Command(BaseCommand):
    help = "Aplica seeds padrão de gamificação, notificações e automação."

    def handle(self, *args: object, **options: object) -> None:
        results = run_all_seeders()
        for result in results:
            if result.skipped:
                self.stdout.write(self.style.WARNING(result.message()))
            else:
                self.stdout.write(self.style.SUCCESS(result.message()))

        self.stdout.write(self.style.SUCCESS("Seeds processados."))
