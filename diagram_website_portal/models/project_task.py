# -*- coding: utf-8 -*-
from odoo import models, _
import base64
from urllib.parse import quote

PROJECT_TASK_READABLE_FIELDS = {
    'show_load_diagram',
    'diagram_version_id',
}

PROJECT_TASK_WRITABLE_FIELDS = {
    'diagram',
}


class ProjectTask(models.Model):
    _inherit = "project.task"

    @property
    def SELF_READABLE_FIELDS(self):
        return super().SELF_READABLE_FIELDS | PROJECT_TASK_READABLE_FIELDS

    @property
    def SELF_WRITABLE_FIELDS(self):
        return super().SELF_WRITABLE_FIELDS | PROJECT_TASK_WRITABLE_FIELDS

    def show_full_screen_diagram(self):
        diagram_data = self.diagram
        if not diagram_data.startswith(
                'data:image/svg+xml;base64,') and not diagram_data.startswith(
                'data:application/xml;base64,'):
            # Base64 encode the diagram data (assuming it's in XML or SVG format)
            base64_encoded = base64.b64encode(
                diagram_data.encode('utf-8')).decode('utf-8')
            # Choose appropriate prefix based on diagram format (SVG or XML)
            if diagram_data.lower().endswith('.svg'):
                diagram_data = 'data:image/svg+xml;base64,' + base64_encoded
            else:
                diagram_data = 'data:application/xml;base64,' + base64_encoded
            # URL encode the base64 data to make it URL-safe (handles special characters in the base64 string)
        encoded_data = quote(diagram_data.split("base64,")[1])

        # Generate the draw.io URL using the base64-encoded diagram data
        drawio_url = f"https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1&title=#R{encoded_data}"
        # Return the URL to open the diagram in viewer mode
        # return {
        #     'name': _("Tracking"),
        #     'type': 'ir.actions.act_url',
        #     'url': drawio_url,
        #     'target': 'new',
        # }
