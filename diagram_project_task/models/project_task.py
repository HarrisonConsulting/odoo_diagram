# -*- coding: utf-8 -*-
from odoo import api, fields, models, _


class ProjectTask(models.Model):
    _inherit = "project.task"

    diagram = fields.Char(string=_("Diagram"), copy=False)
    diagram_version_id = fields.Many2one("diagram.version",
                                         string=_("Diagram Versions"),
                                         domain="[('task_id','=', id)]")
    show_load_diagram = fields.Boolean()

    def write(self, vals):
        if vals.get('diagram', False) and vals.get('save_diagram',False):
            del vals['save_diagram']
            timezone = self._context.get('tz') or self.env.user.partner_id.tz or 'UTC'
            self_tz = self.with_context(tz=timezone)
            date = fields.Datetime.context_timestamp(self_tz, fields.Datetime.now())
            diagram_name = _(f"{date.strftime('%Y-%m-%d %H:%M:%S')} - {self.name}")
            # Store the saved diagram as a record to future use
            created_diagram_ver = self.env["diagram.version"].create({
                'name': diagram_name,
                'diagram_xml': vals.get('diagram'),
                'task_id': self.id,
            })
        return super(ProjectTask, self).write(vals)

    @api.onchange('diagram_version_id')
    def onchange_diagram_version_id(self):
        if self.diagram_version_id:
            self.diagram = self.diagram_version_id.diagram_xml
            self.show_load_diagram = True

    def update_show_load_diagram(self):
        '''Set field show_load_diagram to Flase to hide the button '''
        self.show_load_diagram = False