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
        encoded_data = quote(self.diagram)
        # Construct the final URL for the viewer
        viewer_url = f"https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1&title=#R{encoded_data}"
        return {
            'name': _("Tracking"),
            'type': 'ir.actions.act_url',
            'url': viewer_url,
            'target': 'new',
        }
