from typing import Optional

from posthog.celery import app
from posthog.models import ExportedAsset


@app.task(autoretry_for=(Exception,), max_retries=5, retry_backoff=True, acks_late=True)
def export_asset(exported_asset_id: int, limit: Optional[int] = None) -> None:
    from statshog.defaults.django import statsd

    from posthog.tasks.exports import csv_exporter, image_exporter, video_exporter

    exported_asset: ExportedAsset = ExportedAsset.objects.select_related("insight", "dashboard").get(
        pk=exported_asset_id
    )

    is_csv_export = exported_asset.export_format == ExportedAsset.ExportFormat.CSV
    is_video_export = exported_asset.export_format == ExportedAsset.ExportFormat.MP4

    if is_csv_export:
        max_limit = exported_asset.export_context.get("max_limit", 10000)
        csv_exporter.export_csv(exported_asset, limit=limit, max_limit=max_limit)
        statsd.incr("csv_exporter.queued", tags={"team_id": str(exported_asset.team_id)})
    elif is_video_export:
        video_exporter.export_video(exported_asset)
        statsd.incr("video_exporter.queued", tags={"team_id": str(exported_asset.team_id)})
    else:
        image_exporter.export_image(exported_asset)
        statsd.incr("image_exporter.queued", tags={"team_id": str(exported_asset.team_id)})
