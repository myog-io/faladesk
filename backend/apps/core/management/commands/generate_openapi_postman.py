import json
from collections import OrderedDict
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from drf_spectacular.generators import SchemaGenerator


HTTP_METHODS = {"get", "post", "put", "patch", "delete", "options", "head"}


class Command(BaseCommand):
    help = "Gera coleção Postman a partir do schema OpenAPI atual."

    def add_arguments(self, parser) -> None:
        default_output = Path(settings.ROOT_DIR) / "docs" / "api" / "postman_collection.json"
        parser.add_argument(
            "--output",
            default=str(default_output),
            help="Caminho de saída para a coleção Postman gerada.",
        )

    def handle(self, *args, **options) -> None:
        generator = SchemaGenerator()
        schema = generator.get_schema(request=None, public=True)

        if not schema:
            raise CommandError("Não foi possível gerar o schema OpenAPI.")

        collection = build_postman_collection(schema)

        output_path = Path(options["output"])
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with output_path.open("w", encoding="utf-8") as file_obj:
            json.dump(collection, file_obj, indent=2, ensure_ascii=False)
            file_obj.write("\n")

        self.stdout.write(
            self.style.SUCCESS(f"Coleção Postman atualizada em {output_path}"),
        )


def build_postman_collection(schema: Dict[str, Any]) -> Dict[str, Any]:
    info = schema.get("info", {})
    title = info.get("title", "Faladesk API")
    description = info.get("description", "")
    version = info.get("version", "1.0.0")

    servers = schema.get("servers") or []
    default_server = (servers[0].get("url", "") if servers else "").rstrip("/")
    base_url_value = default_server or "https://api.faladesk.local"

    collection: Dict[str, Any] = {
        "info": {
            "name": title,
            "description": description,
            "version": version,
            "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
        },
        "variable": [
            {"key": "baseUrl", "value": base_url_value, "type": "string"},
            {"key": "authToken", "value": "", "type": "string"},
        ],
        "auth": {
            "type": "bearer",
            "bearer": [
                {"key": "token", "value": "{{authToken}}", "type": "string"},
            ],
        },
        "item": [],
    }

    folders: "OrderedDict[str, Dict[str, Any]]" = OrderedDict()
    root_items: List[Dict[str, Any]] = []
    paths = schema.get("paths") or {}
    components = schema

    for path_url in sorted(paths.keys()):
        path_config = paths[path_url]
        path_parameters = path_config.get("parameters", [])

        for method, operation in sorted(path_config.items()):
            if method not in HTTP_METHODS:
                continue

            merged_parameters = merge_parameters(path_parameters, operation.get("parameters", []))

            item = {
                "name": operation.get("summary") or f"{method.upper()} {path_url}",
                "request": build_request(
                    method,
                    path_url,
                    merged_parameters,
                    operation,
                    components,
                ),
            }

            folder_name = (operation.get("tags") or [None])[0]
            if folder_name:
                folder = folders.setdefault(folder_name, {"name": folder_name, "item": []})
                folder["item"].append(item)
            else:
                root_items.append(item)

    collection["item"] = list(folders.values()) + root_items
    return collection


def build_request(
    method: str,
    path_url: str,
    parameters: List[Dict[str, Any]],
    operation: Dict[str, Any],
    schema_root: Dict[str, Any],
) -> Dict[str, Any]:
    request: Dict[str, Any] = {
        "method": method.upper(),
        "header": [],
        "url": build_url(path_url, parameters),
    }

    description = operation.get("description") or operation.get("summary")
    if description:
        request["description"] = description

    headers = [build_header(param) for param in parameters if param.get("in") == "header"]
    if headers:
        request["header"] = headers

    body, content_type = build_body(operation.get("requestBody"), schema_root)
    if body:
        request["body"] = body
        if content_type and not has_header(request["header"], "Content-Type"):
            request["header"].append({"key": "Content-Type", "value": content_type})

    return request


def build_url(path_url: str, parameters: List[Dict[str, Any]]) -> Dict[str, Any]:
    clean_path = path_url if path_url.startswith("/") else f"/{path_url}"
    url: Dict[str, Any] = {
        "raw": f"{{{{baseUrl}}}}{clean_path}",
        "host": ["{{baseUrl}}"],
        "path": [segment for segment in clean_path.strip("/").split("/") if segment],
    }

    query_params = [build_query_parameter(param) for param in parameters if param.get("in") == "query"]
    if query_params:
        url["query"] = query_params

    return url


def build_query_parameter(param: Dict[str, Any]) -> Dict[str, Any]:
    value = first_not_none(
        param.get("example"),
        (param.get("schema") or {}).get("example"),
        (param.get("schema") or {}).get("default"),
        "",
    )

    entry = {
        "key": param.get("name"),
        "value": str(value) if value is not None else "",
        "description": param.get("description", ""),
    }
    if not param.get("required"):
        entry["disabled"] = True
    return entry


def build_header(param: Dict[str, Any]) -> Dict[str, Any]:
    value = first_not_none(
        param.get("example"),
        (param.get("schema") or {}).get("example"),
        (param.get("schema") or {}).get("default"),
        "",
    )

    entry = {
        "key": param.get("name"),
        "value": str(value) if value is not None else "",
        "description": param.get("description", ""),
    }
    if not param.get("required"):
        entry["disabled"] = True
    return entry


def build_body(
    request_body: Optional[Dict[str, Any]],
    schema_root: Dict[str, Any],
) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
    if not request_body:
        return None, None

    content = request_body.get("content") or {}
    media_type, media_content = pick_media_type(content)
    if not media_type or not media_content:
        return None, None

    example = extract_example(media_content, schema_root)

    if media_type == "application/json":
        body = {
            "mode": "raw",
            "raw": json.dumps(example if example is not None else {}, indent=2, ensure_ascii=False),
            "options": {"raw": {"language": "json"}},
        }
        return body, media_type

    if media_type in {"application/x-www-form-urlencoded", "multipart/form-data"}:
        fields = build_form_fields(example)
        key = "urlencoded" if media_type == "application/x-www-form-urlencoded" else "formdata"
        body = {"mode": "urlencoded" if key == "urlencoded" else "formdata", key: fields}
        return body, media_type

    raw_value = example
    if isinstance(raw_value, (dict, list)):
        raw_value = json.dumps(raw_value, indent=2, ensure_ascii=False)
    elif raw_value is None:
        raw_value = ""

    return {"mode": "raw", "raw": str(raw_value)}, media_type


def build_form_fields(example: Any) -> List[Dict[str, Any]]:
    if not isinstance(example, dict):
        return []

    fields: List[Dict[str, Any]] = []
    for key, value in example.items():
        if isinstance(value, (dict, list)):
            formatted = json.dumps(value, ensure_ascii=False)
        elif value is None:
            formatted = ""
        else:
            formatted = str(value)

        fields.append({"key": key, "value": formatted})

    return fields


def merge_parameters(
    base: Iterable[Dict[str, Any]],
    extra: Iterable[Dict[str, Any]],
) -> List[Dict[str, Any]]:
    merged: "OrderedDict[Tuple[str, str], Dict[str, Any]]" = OrderedDict()
    for source in (base, extra):
        for param in source or []:
            key = (param.get("name"), param.get("in"))
            merged[key] = param
    return list(merged.values())


def pick_media_type(content: Dict[str, Any]) -> Tuple[Optional[str], Optional[Dict[str, Any]]]:
    if not content:
        return None, None

    for candidate in ("application/json", "application/x-www-form-urlencoded", "multipart/form-data"):
        if candidate in content:
            return candidate, content[candidate]

    first = next(iter(content.items()))
    return first[0], first[1]


def extract_example(media_content: Dict[str, Any], schema_root: Dict[str, Any]) -> Any:
    if not media_content:
        return {}

    if "example" in media_content:
        return media_content["example"]

    examples = media_content.get("examples")
    if isinstance(examples, dict) and examples:
        example_obj = next(iter(examples.values()))
        if isinstance(example_obj, dict) and "value" in example_obj:
            return example_obj["value"]

    schema = media_content.get("schema")
    return generate_example(schema, schema_root)


def generate_example(schema: Optional[Dict[str, Any]], root: Dict[str, Any], depth: int = 0) -> Any:
    if not schema or depth > 6:
        return {}

    if "$ref" in schema:
        resolved = resolve_ref(schema["$ref"], root)
        if resolved:
            return generate_example(resolved, root, depth + 1)
        return {}

    for key in ("example", "default"):
        if key in schema:
            return schema[key]

    for composite in ("oneOf", "anyOf", "allOf"):
        if composite in schema and schema[composite]:
            return generate_example(schema[composite][0], root, depth + 1)

    if "enum" in schema and schema["enum"]:
        return schema["enum"][0]

    schema_type = schema.get("type")
    if not schema_type and "properties" in schema:
        schema_type = "object"

    if schema_type == "object":
        properties = schema.get("properties", {})
        result: Dict[str, Any] = {}
        for prop_name, prop_schema in properties.items():
            result[prop_name] = generate_example(prop_schema, root, depth + 1)
        additional = schema.get("additionalProperties")
        if isinstance(additional, dict):
            result["additionalProp"] = generate_example(additional, root, depth + 1)
        return result

    if schema_type == "array":
        return [generate_example(schema.get("items"), root, depth + 1)]

    if schema_type == "integer":
        return 0

    if schema_type == "number":
        return 0.0

    if schema_type == "boolean":
        return True

    format_hint = schema.get("format")
    if format_hint == "date-time":
        return "2024-01-01T00:00:00Z"
    if format_hint == "date":
        return "2024-01-01"
    if format_hint == "email":
        return "user@example.com"

    return "string"


def resolve_ref(ref: str, root: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    target: Any = root
    for part in ref.lstrip("#/").split("/"):
        if not isinstance(target, dict):
            return None
        target = target.get(part)
        if target is None:
            return None
    return target if isinstance(target, dict) else None


def has_header(headers: List[Dict[str, Any]], key: str) -> bool:
    key_lower = key.lower()
    return any((header.get("key") or "").lower() == key_lower for header in headers)


def first_not_none(*values: Any) -> Any:
    for value in values:
        if value is not None:
            return value
    return None
