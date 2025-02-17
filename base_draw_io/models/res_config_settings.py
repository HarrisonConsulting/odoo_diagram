from odoo import fields, models


class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    diagram_history_records_count = fields.Integer(
        string='Diagram History Records Count',
        help='The number of diagram history records for the project.',
        default=13,
        config_parameter='base_draw_io.diagram_history_records_count',
        implied_group="project.group_project_recurring_tasks")
