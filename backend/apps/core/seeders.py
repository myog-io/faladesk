from __future__ import annotations

import logging
from dataclasses import dataclass

from django.apps import apps

logger = logging.getLogger(__name__)


DEFAULT_GAMIFICATION_RULES = [
    {
        "codigo": "peer_kudos",
        "descricao": "Reconhecimento entre colegas",
        "origem": "internal_reaction",
        "pontos": 10,
        "limite_diario": 5,
        "anonimo": True,
    },
    {
        "codigo": "customer_csat",
        "descricao": "Avaliação positiva de cliente",
        "origem": "ticket_feedback",
        "pontos": 25,
        "limite_diario": None,
        "anonimo": False,
    },
    {
        "codigo": "sla_on_time",
        "descricao": "Chamado resolvido dentro do SLA",
        "origem": "ticket_feedback",
        "pontos": 15,
        "limite_diario": None,
        "anonimo": False,
    },
    {
        "codigo": "voice_participation",
        "descricao": "Participação em sessão de voz",
        "origem": "voice_session",
        "pontos": 5,
        "limite_diario": 3,
        "anonimo": False,
    },
]

DEFAULT_GAMIFICATION_LEVELS = [
    {"nome": "Bronze", "slug": "bronze", "ordem": 1, "pontos_min": 0},
    {"nome": "Prata", "slug": "prata", "ordem": 2, "pontos_min": 100},
    {"nome": "Ouro", "slug": "ouro", "ordem": 3, "pontos_min": 300},
    {"nome": "Platina", "slug": "platina", "ordem": 4, "pontos_min": 600},
]

DEFAULT_GAMIFICATION_BADGES = [
    {
        "nome": "Kudos Express",
        "slug": "kudos-express",
        "tipo": "recognition",
        "criterios": {"peer_kudos": 5},
    },
    {
        "nome": "Guardião do SLA",
        "slug": "guardian-sla",
        "tipo": "achievement",
        "criterios": {"sla_on_time": 10},
    },
]

DEFAULT_NOTIFICATION_TEMPLATES = [
    {
        "codigo": "ticket_assigned",
        "canal": "in_app",
        "titulo": "Novo ticket atribuído",
        "corpo": "Ticket {{ticket_id}} atribuído a você.",
    },
    {
        "codigo": "sla_warning",
        "canal": "push",
        "titulo": "Atenção ao SLA",
        "corpo": "Ticket {{ticket_id}} está próximo do SLA.",
    },
    {
        "codigo": "analytics_alert",
        "canal": "email",
        "titulo": "Alerta de Analytics",
        "corpo": "Indicador {{metric}} excedeu o limite.",
    },
    {
        "codigo": "gamification_kudos",
        "canal": "in_app",
        "titulo": "Você recebeu um kudos!",
        "corpo": "Colega enviou reconhecimento: {{mensagem}}.",
    },
]

DEFAULT_NOTIFICATION_PREFERENCES = {
    "in_app": True,
    "push": True,
    "email": False,
}

DEFAULT_AUTOMATION_FLOW = {
    "slug": "default-intake",
    "nome": "Roteamento padrão de mensagens",
    "categoria": "intake",
    "status": "published",
    "builder_schema": {
        "nodes": [
            {
                "id": "trigger",
                "type": "trigger",
                "template": "channel_intake",
            },
            {
                "id": "antispam",
                "type": "action",
                "template": "spam_filter",
            },
            {
                "id": "routing",
                "type": "action",
                "template": "org_unit_router",
            },
        ],
        "connections": [
            {"source": "trigger", "target": "antispam"},
            {"source": "antispam", "target": "routing"},
        ],
    },
    "entry_nodes": ["trigger"],
}


@dataclass
class SeedResult:
    namespace: str
    created: int = 0
    updated: int = 0
    skipped: bool = False
    reason: str | None = None

    def message(self) -> str:
        if self.skipped:
            return f"{self.namespace}: ignorado ({self.reason})"
        return (
            f"{self.namespace}: {self.created} registros criados, "
            f"{self.updated} atualizados"
        )


def _models_available(app_label: str, model_names: list[str]) -> bool:
    for model_name in model_names:
        try:
            apps.get_model(app_label, model_name)
        except LookupError:
            logger.info(
                "Seed de %s ignorado: modelo %s não encontrado.",
                app_label,
                model_name,
            )
            return False
    return True


def seed_gamification_defaults() -> SeedResult:
    if not _models_available(
        "gamification",
        ["GamificationLevel", "GamificationRule", "GamificationBadge"],
    ):
        return SeedResult(
            "gamification",
            skipped=True,
            reason="Modelos de gamificação indisponíveis",
        )

    # Implementação real será adicionada quando os modelos forem definidos.
    logger.info(
        "Seeds de gamificação disponíveis: %s níveis, %s regras, %s badges.",
        len(DEFAULT_GAMIFICATION_LEVELS),
        len(DEFAULT_GAMIFICATION_RULES),
        len(DEFAULT_GAMIFICATION_BADGES),
    )
    return SeedResult("gamification", skipped=True, reason="Seeds documentados")


def seed_notification_defaults() -> SeedResult:
    if not _models_available(
        "notifications",
        ["NotificationTemplate", "NotificationPreference"],
    ):
        return SeedResult(
            "notifications",
            skipped=True,
            reason="Modelos de notificações indisponíveis",
        )

    logger.info(
        "Seeds de notificações prontos: %s templates padrão.",
        len(DEFAULT_NOTIFICATION_TEMPLATES),
    )
    return SeedResult("notifications", skipped=True, reason="Seeds documentados")


def seed_automation_defaults() -> SeedResult:
    if not _models_available(
        "automation",
        ["AutomationFlow"],
    ):
        return SeedResult(
            "automation",
            skipped=True,
            reason="Modelos de automação indisponíveis",
        )

    logger.info(
        "Seed de automação disponível: fluxo %s.",
        DEFAULT_AUTOMATION_FLOW["slug"],
    )
    return SeedResult("automation", skipped=True, reason="Seeds documentados")


def run_all_seeders() -> list[SeedResult]:
    return [
        seed_gamification_defaults(),
        seed_notification_defaults(),
        seed_automation_defaults(),
    ]
