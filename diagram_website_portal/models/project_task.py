# -*- coding: utf-8 -*-
from odoo import models, _
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
