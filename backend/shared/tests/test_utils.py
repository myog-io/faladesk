from __future__ import annotations

from unittest.mock import MagicMock

import pytest

from shared.utils import generate_sequential_code, generate_slug


def test_generate_slug_increments_suffix_when_exists():
    existing = {"sample-slug", "sample-slug-1"}

    slug = generate_slug("Sample Slug", exists=existing.__contains__)

    assert slug == "sample-slug-2"


def test_generate_slug_defaults_to_item_when_empty():
    slug = generate_slug(" ")

    assert slug == "item"


def test_generate_sequential_code_uses_last_code():
    code = generate_sequential_code("tck", last_code="TCK000041")

    assert code == "TCK000042"


def test_generate_sequential_code_reads_queryset_chain():
    queryset = MagicMock()
    filter_result = MagicMock()
    order_by_result = MagicMock()
    values_list_result = MagicMock()

    values_list_result.first.return_value = "ORD000009"
    order_by_result.values_list.return_value = values_list_result
    filter_result.order_by.return_value = order_by_result
    queryset.filter.return_value = filter_result

    code = generate_sequential_code("ord", queryset=queryset, padding=6)

    assert code == "ORD000010"
    queryset.filter.assert_called_once_with(code__startswith="ORD")
    filter_result.order_by.assert_called_once_with("-code")
    order_by_result.values_list.assert_called_once_with("code", flat=True)


@pytest.mark.parametrize(
    "last_code,expected",
    [
        (None, "SUP000001"),
        ("SUPABC", "SUP000001"),
        ("SUP000099", "SUP000100"),
    ],
)
def test_generate_sequential_code_handles_edge_cases(last_code, expected):
    assert generate_sequential_code("sup", last_code=last_code) == expected
