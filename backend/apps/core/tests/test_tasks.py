from apps.core.tasks import health_check


def test_health_check_task_returns_ok() -> None:
    assert health_check() == "ok"
